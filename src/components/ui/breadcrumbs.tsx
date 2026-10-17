'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'

const pathNames: Record<string, string> = {
  'dashboard': 'Dashboard',
  'magic-chat': 'Magic Chat',
  'agents': 'Agent Swarm',
  'classroom': 'Classroom',
  'courses': 'Courses',
  'workspace': 'Workspace',
  'rubrics': 'Rubrics',
  'standards': 'Standards',
  'communication': 'Communication',
  'calendar': 'Calendar',
  'portfolio': 'Portfolios',
  'gradebook': 'Gradebook',
  'analytics': 'Analytics',
  'library': 'Content Library',
  'templates': 'Templates',
  'reports': 'Reports',
  'report-cards': 'Report Cards',
  'attendance': 'Attendance',
  'curriculum': 'Curriculum',
  'professional-dev': 'PD Courses',
  'parent-portal': 'Parent Portal',
  'groups': 'Student Groups',
  'differentiation': 'Differentiation',
  'accommodations': 'Accommodations',
  'integrations': 'Integrations',
  'api-keys': 'API Keys',
  'notifications': 'Notifications',
  'settings': 'Settings',
  'help': 'Help',
  'onboarding': 'Onboarding',
}

function formatSegment(segment: string): string {
  return pathNames[segment] ?? segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-xs">
      <Link
        href="/dashboard"
        className="text-surface-400 hover:text-surface-200 transition-colors flex items-center"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = formatSegment(segment)

        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-surface-600" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
