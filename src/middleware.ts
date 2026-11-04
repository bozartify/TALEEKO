import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'taleeko_session'
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev_secret_taleeko_2024_change_in_prod'

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/magic-chat',
  '/agents',
  '/courses',
  '/classroom',
  '/workspace',
  '/rubrics',
  '/standards',
  '/communication',
  '/calendar',
  '/portfolio',
  '/analytics',
  '/settings',
]

// Routes that are always public — /api/seed is intentionally excluded
const PUBLIC_PATHS = ['/', '/login']

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  // Allow all static assets and Next.js internals
  if (pathname.startsWith('/_next')) return true
  if (pathname.startsWith('/api/auth')) return true
  if (pathname.includes('.')) return true // static files (favicon, images, etc.)
  return false
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function base64urlDecode(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  return atob(padded)
}

// Verifies HMAC-SHA256 signature using Web Crypto API (edge-compatible, no Node crypto)
async function validateToken(token: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [base64, hexSig] = parts

  try {
    const keyMaterial = new TextEncoder().encode(AUTH_SECRET)
    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const data = new TextEncoder().encode(base64)
    const sig = hexToBytes(hexSig)
    const valid = await crypto.subtle.verify('HMAC', key, sig, data)
    if (!valid) return false

    const json = base64urlDecode(base64)
    const payload = JSON.parse(json)
    if (!payload.userId || !payload.exp) return false
    if (Date.now() > payload.exp) return false
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  if (isProtectedPath(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token || !(await validateToken(token))) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
