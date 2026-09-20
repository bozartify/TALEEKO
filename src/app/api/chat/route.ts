import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, TEACHING_TOOLS, MODE_PROMPTS } from '@/lib/prompts'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { messages, mode = 'general' } = await request.json()

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
