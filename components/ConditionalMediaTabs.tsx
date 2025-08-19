'use client'

import { usePathname } from 'next/navigation'
import MediaTabs from './MediaTabs'

// これらのパスで始まるURLにのみ表示する
const visiblePrefixes = ['/', '/picture', '/video', '/sound', '/text','/other','/community']

export default function ConditionalMediaTabs() {
  const pathname = usePathname()

  // 条件にマッチしない場合は非表示
  const shouldShow = visiblePrefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  )

  if (!shouldShow) return null

  return <MediaTabs />
}
