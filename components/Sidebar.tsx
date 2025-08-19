"use client";

import Link from "next/link";
import {
  FiHome,
  FiImage,
  FiVideo,
  FiHeadphones,
  FiBookOpen,
  FiUsers,
} from "react-icons/fi";

const menuItems = [
  { href: "/", label: "ホーム", icon: <FiHome /> },
  { href: "/picture", label: "画像", icon: <FiImage /> },
  { href: "/video", label: "動画", icon: <FiVideo /> },
  { href: "/sound", label: "音声", icon: <FiHeadphones /> },
  { href: "/text", label: "文章", icon: <FiBookOpen /> },
  { href: "/community", label: "コミュニティ", icon: <FiUsers /> },
];

const Sidebar = () => {
  return (
    <aside className="bg-white h-screen fixed top-0 left-0 w-50 overflow-y-auto z-40">
      <nav className="mt-20 flex flex-col items-stretch px-2">
        {menuItems.map((item, index) => {
          if (item.isSpacer) {
            return <div key={`spacer-${index}`} className="my-2 h-6" />;
          }

          return (
            <Link
              key={`menu-${item.href || index}`}
              href={item.href}
              className="flex items-center gap-4 p-3 my-1 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-200 justify-start"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
