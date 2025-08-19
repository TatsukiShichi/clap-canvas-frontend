import React, { useEffect } from "react";

interface Serialization {
  id: string;
  title: string;
  readings: string[];
}

interface PostTypeSelectorProps {
  postType: string;
  setPostType: (value: string) => void;
  selectedSerializationId: string;
  setSelectedSerializationId: (value: string) => void;
  isInsertMode: boolean;
  setIsInsertMode: (value: boolean) => void;
  insertIndex: number;
  setInsertIndex: (value: number) => void;
  serializationList: Serialization[];
}

const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  postType,
  setPostType,
  selectedSerializationId,
  setSelectedSerializationId,
  isInsertMode,
  setIsInsertMode,
  insertIndex,
  setInsertIndex,
  serializationList
}) => {
  const selectedSerialization = serializationList.find(s => s.id === selectedSerializationId);
  const readings = selectedSerialization?.readings ?? [];

  // 初期選択されていない場合、自動的に最初の serialization を選択
  useEffect(() => {
    if (postType === "連載" && serializationList.length > 0 && !selectedSerializationId) {
      setSelectedSerializationId(serializationList[0].id);
    }
  }, [postType, serializationList, selectedSerializationId, setSelectedSerializationId]);

  return (
    <div className="mb-6">
      {/* 通常／連載選択 */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="通常"
            checked={postType === "通常"}
            onChange={() => setPostType("通常")}
            className="accent-blue-500"
          />
          通常
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="連載"
            checked={postType === "連載"}
            onChange={() => setPostType("連載")}
            className="accent-blue-500"
          />
          連載
        </label>
      </div>

      {postType === "連載" && serializationList.length > 0 && (
        <>
          {/* 連載選択 */}
          <div className="mt-2 flex gap-2 w-full max-w-md">
            <select
              className="border border-gray-300 p-2 rounded w-full cursor-pointer"
              value={selectedSerializationId}
              onChange={(e) => {
                const value = e.target.value;
                const selected = serializationList.find((s) => s.id === value);
                setSelectedSerializationId(value);
                setIsInsertMode(false);
                setInsertIndex(selected ? selected.readings.length - 1 : 0);
              }}
            >
              {serializationList.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>

            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition whitespace-nowrap cursor-pointer"
              onClick={() => alert("新規作成ボタンがクリックされました")}
            >
              新規作成
            </button>
          </div>

          {/* 投稿位置挿入UI */}
          <div className="mt-2 flex flex-col gap-2 w-full items-start">
            <button
              type="button"
              className={`bg-white px-1 py-0 ${
                selectedSerializationId === ""
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-black cursor-pointer"
              }`}
              onClick={() => {
                if (selectedSerializationId !== "") {
                  setIsInsertMode((prev) => !prev);
                }
              }}
              disabled={selectedSerializationId === ""}
            >
              {isInsertMode ? "－ 投稿位置を変更する" : "＋ 投稿位置を変更する"}
            </button>

            {isInsertMode && (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm w-full">
                <button
                  type="button"
                  className="text-xl px-2 transition cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    setInsertIndex((prev) =>
                      prev <= -1 ? readings.length - 1 : prev - 1
                    )
                  }
                >
                  ◀
                </button>

                <span className="text-gray-700">
                  {insertIndex === -1 ? (
                    "冒頭部分に投稿"
                  ) : insertIndex === readings.length - 1 ? (
                    "最新部分に投稿"
                  ) : (
                    <>
                      「{readings[insertIndex]}」と「{readings[insertIndex + 1]}」の間に投稿
                    </>
                  )}
                </span>

                <button
                  type="button"
                  className="text-xl px-2 transition cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    setInsertIndex((prev) =>
                      prev >= readings.length - 1 ? -1 : prev + 1
                    )
                  }
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostTypeSelector;
