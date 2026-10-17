import { cookies } from 'next/headers'
import crypto from 'crypto'

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev_secret_taleeko_2024_change_in_prod'
const COOKIE_NAME = 'taleeko_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

export const DEMO_TEACHER_ID = 'demo_teacher_001'

interface SessionPayload {
  userId: string
  exp: number
}

function sign(payload: string): string {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payload)
    .digest('hex')
}

function encode(payload: SessionPayload): string {
  const json = JSON.stringify(payload)
  const base64 = Buffer.from(json).toString('base64url')
  const signature = sign(base64)
  return `${base64}.${signature}`
}

function decode(token: string): SessionPayload | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [base64, signature] = parts
  const expectedSig = sign(base64)

  // Constant-time comparison
  if (signature.length !== expectedSig.length) return null
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSig)
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null

  try {
    const json = Buffer.from(base64, 'base64url').toString('utf-8')
    const payload = JSON.parse(json) as SessionPayload

    // Check expiry
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<void> {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION,
  }

  const token = encode(payload)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION / 1000,
  })
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  const payload = decode(token)
  if (!payload) return null

  return { userId: payload.userId }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

/**
 * Validate a session token string without accessing cookies.
 * Used by middleware where cookies() is not available.
 */
export function validateSessionToken(token: string): { userId: string } | null {
  const payload = decode(token)
  if (!payload) return null
  return { userId: payload.userId }
}

export { COOKIE_NAME }
