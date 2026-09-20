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
const PUBLIC_PATHS = ['/', '/login', '/api/seed']

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

function validateToken(token: string): boolean {
  // Inline validation to avoid importing Node crypto in edge runtime
  // We do a structural check here; full HMAC validation happens server-side
  const parts = token.split('.')
  if (parts.length !== 2) return false

  try {
    const json = Buffer.from(parts[0], 'base64url').toString('utf-8')
    const payload = JSON.parse(json)
    if (!payload.userId || !payload.exp) return false
    if (Date.now() > payload.exp) return false
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  if (isProtectedPath(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token || !validateToken(token)) {
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
