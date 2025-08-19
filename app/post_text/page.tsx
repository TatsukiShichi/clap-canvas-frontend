"use client";

import { useState, useCallback } from "react";
import { FiPlus, FiBookOpen as BookIcon } from "react-icons/fi"
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Image from "next/image";

import PostTextTypeSelector from "../../components/PostTextTypeSelector";
import ThumbnailSelector from "../../components/ThumbnailSelector";
import HelpButton from "../../components/HelpButton";
import { TextPreview } from "../../components/TextPreview";
import TagInput from "../../components/TagInput";
import PostSettingsForm from "../../components/PostSettingsForm";

const PostPage = () => {
  // サムネイル設定に必要な初期値及び関数
  const [images, setImages] = useState<string[]>([]); // アップロードされた画像を格納
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0); // サムネイル選択用インデックス
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // 切り抜き後の画像データURL
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // 切り抜き位置
  const [zoom, setZoom] = useState(1); // ズーム値
  const [tempCroppedData, setTempCroppedData] = useState<string | null>(null);

  const onCropComplete = useCallback(async (_: any, croppedAreaPixels: any) => {
    if (!images[thumbnailIndex]) return;

    const cropped = await new Promise<string>((resolve) => {
      const canvas = document.createElement("canvas");
      const image = new window.Image();
      image.src = images[thumbnailIndex];

      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        resolve(canvas.toDataURL());
      };
    });

    setTempCroppedData(cropped);
  }, [images, thumbnailIndex]);

  // バックエンド未完成のため取り込むリスト代わりのダミーデータ
  interface Serialization {
    id: string;
    title: string;
    readings: string[];
  }

  const [serializationList, setSerializationList] = useState<Serialization[]>([
    { id: "1", title: "testA", readings: ["第1話", "第2話"] },
    { id: "2", title: "testB", readings: ["第1話"] },
    { id: "3", title: "testC", readings: ["第1話", "第2話", "第3話", "第4話", "第5話"] },
  ]);

  const [selectedSerializationId, setSelectedSerializationId] = useState(
    serializationList[0]?.id || ""
  );
  const selectedSerialization = serializationList.find(s => s.id === selectedSerializationId) || null;
  const readingInsertList = selectedSerialization?.readings ?? [];

  // 各種初期値
  const [postType, setPostType] = useState<"通常" | "連載">("通常");
  const [isInsertMode, setIsInsertMode] = useState(false);
  const [insertIndex, setInsertIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [maintext, setMaintext] = useState("");
  const [fileName, setFileName] = useState("");
  const [preface, setPreface] = useState("");
  const [afterword, setAfterword] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [tagEditPermission, setTagEditPermission] = useState("すべてのユーザー");
  const [ageLimit, setAgeLimit] = useState("");
  const [visibility, setVisibility] = useState("すべてのユーザー");
  const [commentPermission, setCommentPermission] = useState("すべてのユーザー");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // 投稿ボタンの無効化条件
  const isPostDisabled = title.length === 0 || maintext.length === 0 || ageLimit === "";

  return (
    <div className="relative w-full max-w-10xl mx-auto p-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* 投稿タイプの選択ボタン */}
        <PostTextTypeSelector
          postType={postType}
          setPostType={setPostType}
          selectedSerializationId={selectedSerializationId}
          setSelectedSerializationId={setSelectedSerializationId}
          isInsertMode={isInsertMode}
          setIsInsertMode={setIsInsertMode}
          insertIndex={insertIndex}
          setInsertIndex={setInsertIndex}
          serializationList={serializationList}
        />

        {/* タイトル */}
        <label className="font-semibold block mt-8 mb-2 text-red-600">
          タイトル <span className="text-xs text-red-500 ml-1">(必須)</span>
        </label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-y"
          placeholder="タイトルを入力"
          value={title}
          maxLength={100}
          rows={1}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="mb-2 text-sm text-right text-gray-500">{title.length.toLocaleString()}/100</p>

        {/* サムネイル設定 */}
        <ThumbnailSelector
          title={title}
          icon={<BookIcon className="text-4xl text-gray-600" />}
          images={images}
          setImages={setImages}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
          CropComponentProps={{
            crop,
            zoom,
            setCrop,
            setZoom,
            onCropComplete,
            tempCroppedData,
            thumbnailIndex
          }}
        />

        {/* 本文, 前書き, 後書き, プレビュー */}
        <label className="font-semibold block mb-2 text-red-600">
          本文 <span className="text-xs text-red-500 ml-1">(必須)</span>
          <HelpButton href="/helpcenter/upload_text/maintext" />
        </label>
      </div>

      <div className="relative h-9 w-full max-w-md">
        <label className="absolute left-0 top-0 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer inline-block hover:bg-blue-600">
          .txtファイルを選択
          <input
            type="file"
            accept=".txt"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.type !== "text/plain") {
                alert("テキストファイル（.txt）のみ対応しています。");
                return;
              }
              const text = await file.text();
              setMaintext(text);
              setFileName(file.name);
            }}
          />
        </label>

        {fileName && (
          <span className="absolute left-[9.5rem] top-[0.7rem] text-sm text-gray-700 truncate max-w-[230px]">
            {fileName}
          </span>
        )}

        {(fileName || maintext) && (
          <button
            type="button"
            className="absolute right-0 top-0 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            onClick={() => {
              const confirmed = window.confirm("削除しますか？");
              if (confirmed) {
                setMaintext("");
                setFileName("");
              }
            }}
          >
            クリア
          </button>
        )}
      </div>

      <div className="w-full max-w-md">
        <textarea
          className="w-full border border-gray-300 p-2 rounded mt-2"
          placeholder="本文を入力"
          value={maintext}
          maxLength={100000}
          rows={10}
          onChange={(e) => setMaintext(e.target.value)}
        />
        <p className="text-sm text-right text-gray-500">{maintext.length.toLocaleString()}/100,000</p>

        <label className="font-semibold block mt-1 mb-2">
          前書き
        </label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="前書きを入力"
          value={preface}
          maxLength={1000}
          rows={2}
          onChange={(e) => setPreface(e.target.value)}
        />
        <p className="text-sm text-right text-gray-500">{preface.length.toLocaleString()}/1,000</p>

        <label className="font-semibold block mt-1 mb-2">
          後書き
        </label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="後書きを入力"
       　 value={afterword}
          maxLength={10000}
          rows={2}
          onChange={(e) => setAfterword(e.target.value)}
        />
        <p className="text-sm text-right text-gray-500">{afterword.length.toLocaleString()}/10,000</p>

        <label className="font-semibold block mt-1 mb-2">
          プレビュー
        </label>
        <div className="border border-gray-300 rounded-md p-4 bg-white resize-y overflow-auto h-64 min-h-[8rem]">
          <TextPreview
            title={title}
            preface={preface}
            maintext={maintext}
            afterword={afterword}
          />
        </div>
      </div>

      <div className="relative w-full max-w-10xl flex flex-col items-center mt-8">
        <div className="w-full max-w-md space-y-8">
          {/* タグ登録 */}
          <TagInput presets={["小説", "オリジナル", "二次創作", "評論", "記事", "AI"]} />

          {/* タグ編集権限～予約投稿 */}
          <PostSettingsForm
            tagEditPermission={tagEditPermission}
            setTagEditPermission={setTagEditPermission}
            ageLimit={ageLimit}
            setAgeLimit={setAgeLimit}
            visibility={visibility}
            setVisibility={setVisibility}
            commentPermission={commentPermission}
            setCommentPermission={setCommentPermission}
            schedulePost={schedulePost}
            setSchedulePost={setSchedulePost}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
          />

          {/* 投稿ボタン */}
          <button
            className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded transition w-full ${
              isPostDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-70 cursor-pointer"
            }`}
            disabled={isPostDisabled}
          >
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
