"use client";

import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import HelpButton from "./HelpButton";
import { FiX } from "react-icons/fi"

type TagInputProps = {
  presets?: string[];
};

const TagInput = ({ presets = [] }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const normalizeAndValidateTag = (input: string) => {
    const trimmed = input.trim();
    if (trimmed === "" || trimmed === "#") return null;
    let normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (normalized.length > 51) return { error: "タグは50文字以内で入力してください。" };
    return { tag: normalized };
  };

  const handleTagInput = () => {
    const rawInput = tagInput.trim();
    if (rawInput === "" || rawInput === "#") return;

    const rawTags = rawInput.includes("#")
      ? rawInput.split("#").map(t => t.trim()).filter(t => t)
      : [rawInput];

    const newTags: string[] = [];
    const existingTags = [...tags];

    for (let rawTag of rawTags) {
      const { tag, error } = normalizeAndValidateTag(rawTag) || {};
      if (error) {
        alert(error);
        return;
      }
      if (!tag) continue;
      if (existingTags.includes(tag)) {
        alert("同じタグは追加できません。");
        return;
      }

      newTags.push(tag);
      existingTags.push(tag);
    }

    if (tags.length + newTags.length > 50) {
      alert("タグは最大50個までです。");
      return;
    }

    setTags([...tags, ...newTags]);
    setTagInput("");
  };

  const handleTagEditBlur = (index: number) => {
    const { tag, error } = normalizeAndValidateTag(editingValue) || {};
    if (error) {
      alert(error);
      return;
    }
    if (!tag) {
      setTags(tags.filter((_, i) => i !== index));
      setEditingIndex(null);
      return;
    }

    const isDuplicate = tags.some((t, i) => t === tag && i !== index);
    if (isDuplicate) {
      alert("同じタグは追加できません。");
      return;
    }

    setTags(tags.map((t, i) => (i === index ? tag : t)));
    setEditingIndex(null);
  };

  return (
    <div>
      <label className="font-semibold block mb-2">
        タグ <HelpButton href="/helpcenter/tags" />
      </label>

      {/* プリセットタグボタン */}
      <div className="flex flex-wrap gap-2 mb-2">
        {presets.map((preset) => {
          const formattedTag = `#${preset}`;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (tags.length >= 50) {
                  alert("タグは最大50個までです。");
                  return;
                }
                if (!tags.includes(formattedTag)) {
                  setTags([...tags, formattedTag]);
                }
              }}
              disabled={tags.includes(formattedTag)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                tags.includes(formattedTag)
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"
              }`}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {/* 入力欄 */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded"
          placeholder="タグを入力 (最大50文字/個・最大50個)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleTagInput();
            }
          }}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
          onClick={handleTagInput}
        >
          追加
        </button>
      </div>

      {/* 並び替え＆編集 */}
      <ReactSortable
        list={tags.map((tag, index) => ({ id: index, name: tag }))}
        setList={(newList) => setTags(newList.map((item) => item.name))}
        className="flex flex-wrap gap-2 mt-2 mb-2"
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            className="relative flex items-center bg-gray-200 rounded px-2 py-1 cursor-move group"
          >
            {editingIndex === index ? (
              <input
                className="px-2 py-1 bg-white border rounded w-32"
                value={editingValue}
                autoFocus
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => handleTagEditBlur(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            ) : (
              <span
                className="pr-4"
                onClick={() => {
                  setEditingIndex(index);
                  setEditingValue(tag);
                }}
              >
                {tag}
              </span>
            )}

            <button
              type="button"
              className="absolute top-[-6px] right-[-6px] bg-white rounded-full w-5 h-5 flex items-center justify-center text-gray-500 text-xs shadow-sm cursor-pointer hover:bg-red-500 hover:text-white transition"
              onClick={() => {
                setTags(tags.filter((_, i) => i !== index));
                if (editingIndex !== null && editingIndex > index) {
                  setEditingIndex(editingIndex - 1);
                } else if (editingIndex === index) {
                  setEditingIndex(null);
                }
              }}
            >
              <FiX className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </ReactSortable>

      <p className="text-sm text-gray-500 ml-2">{tags.length} / 50個</p>

      {tags.length > 0 && (
        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600 transition cursor-pointer"
          onClick={() => {
            const confirmed = window.confirm("すべてのタグを削除しますか？");
            if (confirmed) {
              setTags([]);
            }
          }}
        >
          全削除
        </button>
      )}
    </div>
  );
};

export default TagInput;
