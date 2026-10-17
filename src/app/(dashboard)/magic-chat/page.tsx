import { Suspense } from 'react'
import ChatInterface from '@/components/chat/chat-interface'

export default function MagicChatPage() {
  return (
    <div className="h-full flex flex-col -m-6">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-sm text-surface-500">Loading...</div>}>
        <ChatInterface />
      </Suspense>
    </div>
  )
}
