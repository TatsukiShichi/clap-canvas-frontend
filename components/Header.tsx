"use client";

import Link from 'next/link';
import Image from 'next/image';
import {
  FiUser,
  FiBell,
  FiPlusCircle,
  FiChevronDown,
  FiSearch,
  FiImage,
  FiVideo,
  FiHeadphones,
  FiBookOpen,
} from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const postDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        postDropdownRef.current &&
        !postDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPostDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white fixed top-0 left-0 w-full px-4 py-3 flex justify-between items-center z-40">
      {/* 左側：ロゴ */}
      <Link
        href="/"
        className="flex items-center text-2xl font-extrabold tracking-wide ml-11.5 mt-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
      >
        <Image
          src="/favicon.png"
          alt="ClapCanvas Logo"
          width={28}
          height={28}
          className="mt-1 mr-3"
        />
        ClapCanvas
      </Link>

      {/* 中央：検索バー */}
      <div className="relative w-1/2 mt-1">
        <input
          type="text"
          placeholder="検索..."
          className="w-full pl-10 pr-4 py-2 border rounded-full bg-whit focus:ring focus:ring-blue-300"
        />
        <FiSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* 右側：ユーザーメニュー + 投稿ドロップダウン */}
      <div className="flex gap-4 items-center relative">
        <Link
          href="/premium"
          className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-semibold text-sm hover:opacity-80 transition"
        >
          プレミアムプランを体験
        </Link>

        {/* 投稿ドロップダウン */}
        <div className="relative" ref={postDropdownRef}>
          <button
            onClick={() => setIsPostDropdownOpen(!isPostDropdownOpen)}
            className="px-4 py-2 bg-white text-gray-800 rounded-full hover:bg-gray-200 transition text-sm font-medium flex items-center"
          >
            ＋ 投稿
            <FiChevronDown size={16} className="ml-1" />
          </button>
          {isPostDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg z-50 rounded-md">
              <Link href="/post_picture" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiImage className="text-base" />
                画像
              </Link>
              <Link href="/post_video" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiVideo className="text-base" />
                動画
              </Link>
              <Link href="/post_sound" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiHeadphones className="text-base" />
                音声
              </Link>
              <Link href="/post_text" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiBookOpen className="text-base" />
                文章
              </Link>
            </div>
          )}
        </div>

        {/* 通知 */}
        <Link
          href="/notification"
          className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-200"
        >
          <FiBell size={20} />
        </Link>

        {/* ユーザードロップダウン */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-200 flex items-center"
          >
            <FiUser size={20} />
            <FiChevronDown size={16} className="ml-1" />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg z-50 rounded-md">
              <Link
                href="/mypage"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                マイページ
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                設定
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => alert('ログアウト処理')}
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
