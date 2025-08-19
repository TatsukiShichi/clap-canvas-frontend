'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import {
  FiHome,
  FiImage,
  FiVideo,
  FiHeadphones,
  FiBookOpen,
  FiUsers,
} from 'react-icons/fi'

const tabs = [
  { href: '/', icon: FiHome, title: 'ホーム' },
  { href: '/picture', icon: FiImage, title: '画像' },
  { href: '/video', icon: FiVideo, title: '動画' },
  { href: '/sound', icon: FiHeadphones, title: '音声' },
  { href: '/text', icon: FiBookOpen, title: '文章' },
  { href: '/community', icon: FiUsers, title: 'コミュニティ' },
]

export default function MediaTabs() {
  const pathname = usePathname()

  return (
    <div className="flex justify-start pt-4 pl-0">{/* ptが縦、plが横の位置を変更する数値 */}
      <div className="inline-flex rounded-md bg-transparent overflow-hidden">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            title={tab.title}
            className={clsx(
              'flex items-center justify-center px-5 py-4 text-xl transition-all duration-150',
              pathname === tab.href
                ? 'text-blue-600 bg-blue-100 rounded-md'
                : 'text-gray-500 hover:bg-gray-100 rounded-md'
            )}
          >
            <tab.icon />
          </Link>
        ))}
      </div>
    </div>
  )
}
