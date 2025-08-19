"use client";

import { FC } from "react";
import HelpButton from "./HelpButton";

type Props = {
  tagEditPermission: string;
  setTagEditPermission: (value: string) => void;
  ageLimit: string;
  setAgeLimit: (value: string) => void;
  visibility: string;
  setVisibility: (value: string) => void;
  commentPermission: string;
  setCommentPermission: (value: string) => void;
  schedulePost: boolean;
  setSchedulePost: (value: boolean) => void;
  scheduleDate: string;
  setScheduleDate: (value: string) => void;
};

const PostSettingsForm: FC<Props> = ({
  tagEditPermission,
  setTagEditPermission,
  ageLimit,
  setAgeLimit,
  visibility,
  setVisibility,
  commentPermission,
  setCommentPermission,
  schedulePost,
  setSchedulePost,
  scheduleDate,
  setScheduleDate,
}) => {
  return (
    <div className="w-full max-w-md">
      <div>
        <label className="font-semibold block mb-2">タグの編集権限</label>
        <select
          className="w-full border border-gray-300 p-2 mb-8 rounded cursor-pointer"
          value={tagEditPermission}
          onChange={(e) => setTagEditPermission(e.target.value)}
        >
          {["すべてのユーザー", "投稿者＋フォロワー", "投稿者のみ"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="font-semibold block text-red-600">
          年齢制限 <span className="text-xs text-red-500 ml-1">(必須)</span>
          <HelpButton href="/helpcenter/age-limit" />
        </label>
        {["全年齢", "R-18"].map((option) => {
          const isSelected = ageLimit === option;
          return (
            <label
              key={option}
              className={`flex items-center gap-2 my-1 cursor-pointer transition ${
                !isSelected ? "hover:opacity-50" : ""
              }`}
            >
              <input
                type="radio"
                name="ageLimit"
                value={option}
                checked={isSelected}
                onChange={() => setAgeLimit(option)}
                className="cursor-pointer"
              />
              {option}
            </label>
          );
        })}

        <label className="font-semibold block mt-7 mb-2">公開範囲</label>
        <select
          className="w-full border border-gray-300 p-2 mb-8 rounded cursor-pointer"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          {["すべてのユーザー", "投稿者＋フォロワー", "非公開"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="font-semibold block mb-2">コメント許可範囲</label>
        <select
          className="w-full border border-gray-300 p-2 mb-8 rounded cursor-pointer"
          value={commentPermission}
          onChange={(e) => setCommentPermission(e.target.value)}
        >
          {["すべてのユーザー", "投稿者＋フォロワー", "不可"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 mb-2 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={schedulePost}
            onChange={() => setSchedulePost(!schedulePost)}
          />
          予約投稿
        </label>
        {schedulePost && (
          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-2 mb-3 rounded cursor-pointer"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default PostSettingsForm;
