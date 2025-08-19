"use client";

import { useState } from "react";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <div className="w-full max-w-md">
      <div>
        <label className="font-semibold block mb-2">タイトル</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-y"
          placeholder="タイトルを入力"
          value={title}
          maxLength={100}
          rows={1}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="mb-2 text-sm text-right text-gray-500">{title.length.toLocaleString()}/100</p>
      </div>

      <div>
        <label className="font-semibold block mb-2">メッセージ</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="メッセージを入力"
          value={caption}
          maxLength={1000}
          rows={3}
          onChange={(e) => setCaption(e.target.value)}
        />
        <p className="mb-2 text-sm text-right text-gray-500">{caption.length.toLocaleString()}/1,000</p>
      </div>
    </div>
  );
};

export default PostForm;
