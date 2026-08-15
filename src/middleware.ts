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

// Routes that are always public
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
  // Every /api route that isn't explicitly public requires a session. These
  // were previously unlisted, so they fell through the protected check and
  // were served unauthenticated — including /api/chat, which spends
  // Anthropic API credits on every call.
  if (pathname.startsWith('/api/')) return true
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

/**
 * Verify the session cookie's HMAC signature.
 *
 * This previously did a structural check only — base64-decode the payload and
 * look at `exp` — on the assumption that "full HMAC validation happens
 * server-side". Nothing downstream performed that validation, so any token
 * whose payload merely *parsed* was accepted: forging one was a matter of
 * base64-encoding `{"userId":"...","exp":<future>}` and appending arbitrary
 * bytes as the signature.
 *
 * Node's crypto module isn't available in the edge runtime, but Web Crypto is,
 * so we verify properly here. Must stay byte-compatible with sign() in
 * lib/auth.ts: HMAC-SHA256 over the base64url payload, hex-encoded.
 */
async function validateToken(token: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, signature] = parts

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Length-independent comparison; both sides are fixed-length hex here.
    if (signature.length !== expected.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
      diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
    }
    if (diff !== 0) return false

    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
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
      // API callers get a status they can act on; a redirect to an HTML login
      // page would arrive at fetch() as an opaque 200.
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }
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
