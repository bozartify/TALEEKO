import Image from 'next/image'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const statusDotSize = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
  color = 'from-accent-500 to-accent-700',
  status,
}: AvatarProps) {
  const pixelSize = { xs: 24, sm: 32, md: 40, lg: 48 }[size]

  return (
    <div className={`relative inline-flex flex-shrink-0 ${sizeMap[size]}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={pixelSize}
          height={pixelSize}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-semibold text-white`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusDotSize[size]} ${statusColors[status]} rounded-full ring-2 ring-surface-900`}
        />
      )}
    </div>
  )
}
