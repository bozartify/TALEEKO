import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, TEACHING_TOOLS, MODE_PROMPTS } from '@/lib/prompts'
import { rateLimit } from '@/lib/rate-limit'
import { validateSessionToken, COOKIE_NAME } from '@/lib/auth'

const client = new Anthropic()

const VALID_MODES = new Set(['general', 'lesson', 'quiz', 'feedback', 'rubric', 'unit', 'writing', 'differentiation'])

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (!rateLimit(`chat:${ip}`, 20, 60_000)) {
    return Response.json({ error: 'Too many requests — please wait a moment' }, { status: 429 })
  }

  // Validate session
  const cookieHeader = request.headers.get('cookie') ?? ''
  const sessionToken = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))?.[1]
  if (!sessionToken || !validateSessionToken(sessionToken)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { messages, mode = 'general' } = await request.json()

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'messages must be a non-empty array' }, { status: 400 })
    }
    if (messages.length > 50) {
      return Response.json({ error: 'Too many messages in context' }, { status: 400 })
    }
    const totalChars = messages.reduce((sum: number, m: { content?: unknown }) =>
      sum + (typeof m.content === 'string' ? m.content.length : 0), 0)
    if (totalChars > 100_000) {
      return Response.json({ error: 'Message content too large' }, { status: 400 })
    }
    if (mode && !VALID_MODES.has(mode)) {
      return Response.json({ error: 'Invalid mode' }, { status: 400 })
    }

    const systemPrompt = `${SYSTEM_PROMPT}\n\n${MODE_PROMPTS[mode] ?? ''}`

    const stream = new ReadableStream({
      async start(controller) {
        const encode = (data: string) => new TextEncoder().encode(`data: ${data}\n\n`)

        try {
          const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: [
              {
                type: 'text',
                text: systemPrompt,
                cache_control: { type: 'ephemeral' },
              } as Anthropic.TextBlockParam,
            ],
            tools: TEACHING_TOOLS as Anthropic.Tool[],
            messages,
            stream: true,
          })

          let toolUseBlock: { id: string; name: string; input: Record<string, unknown> } | null = null
          let toolInputStr = ''

          for await (const event of response) {
            if (event.type === 'content_block_start') {
              if (event.content_block.type === 'tool_use') {
                toolUseBlock = {
                  id: event.content_block.id,
                  name: event.content_block.name,
                  input: {},
                }
                toolInputStr = ''
              }
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                controller.enqueue(encode(JSON.stringify({ type: 'text', text: event.delta.text })))
              } else if (event.delta.type === 'input_json_delta') {
                toolInputStr += event.delta.partial_json
              }
            } else if (event.type === 'content_block_stop') {
              if (toolUseBlock && toolInputStr) {
                try {
                  toolUseBlock.input = JSON.parse(toolInputStr)
                  controller.enqueue(encode(JSON.stringify({ type: 'tool_result', tool: toolUseBlock })))
                } catch {
                  // malformed tool input — skip
                }
                toolUseBlock = null
                toolInputStr = ''
              }
            }
          }

          controller.enqueue(encode('[DONE]'))
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error'
          controller.enqueue(encode(JSON.stringify({ type: 'error', message: msg })))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
