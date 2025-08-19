"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiPlus, FiHeadphones } from "react-icons/fi"

import HelpButton from "../../components/HelpButton";
import ThumbnailSelector from "../../components/ThumbnailSelector";
import TagInput from "../../components/TagInput";
import PostSettingsForm from "../../components/PostSettingsForm";

const PostPage = () => {
  // アップロード部分
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onAudioDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const audioUrl = URL.createObjectURL(file);
    setAudioFile(audioUrl);
    setFileName(file.name);
  }, []);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } = useDropzone({
    accept: {
      "audio/*": [],
    },
    onDrop: onAudioDrop,
    maxFiles: 1,
    onDropRejected: (rejections) => {
      if (rejections.some(r => r.errors.some(e => e.code === "file-invalid-type"))) {
        alert("音声ファイルのみアップロードできます。");
      }
    },
  });

  const handleAudioRemove = () => {
    setAudioFile(null);
    setFileName(null);
  };

  const truncateFileName = (name: string, maxLength = 10) => {
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

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

  // 初期値（タイトル, メッセージ, タグの編集権限, 年齢制限, 公開範囲, コメント許可範囲, 予約投稿）
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tagEditPermission, setTagEditPermission] = useState("すべてのユーザー");
  const [ageLimit, setAgeLimit] = useState("");
  const [visibility, setVisibility] = useState("すべてのユーザー");
  const [commentPermission, setCommentPermission] = useState("すべてのユーザー");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // 投稿ボタンの無効化条件
  const isPostDisabled = ageLimit === "" || !audioFile;

  return (
    <div className="relative w-full max-w-10xl mx-auto p-8 flex flex-col items-center">
      {/* アップロード */}
      <HelpButton
        href="/helpcenter/upload_sound"
        className="absolute top-0 right-8"
      />

      {!audioFile ? (
        <div {...getAudioRootProps()}
          className="w-full h-[200px] bg-gray-200 mb-12 rounded flex justify-center items-center cursor-pointer">
          <input {...getAudioInputProps()} />
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:opacity-70 cursor-pointer">
            <FiPlus className="text-xl" /> 音声を選択
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-md h-[200px] mb-12">
          <button
            className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition cursor-pointer"
            onClick={handleAudioRemove}
          >
            ×
          </button>

          {audioFile && (
            <div className="text-center text-gray-600 text-5xl mt-5">
              <div className="font-medium" title={fileName || ""}>
                {fileName && truncateFileName(fileName)}
              </div>
              <button
                className="px-4 py-2 mb-9 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
                onClick={() => {
                  const rawTitle = fileName.replace(/\.[^/.]+$/, ""); // 拡張子除去
                  setTitle(rawTitle.slice(0, 100));
                }} 
              >
                ファイル名をタイトルに入力
              </button>
            </div>
          )}

          <audio controls src={audioFile} className="w-full rounded" />
        </div>
      )}

      <div className="w-full max-w-md mb-2">
        {/* タイトル */}
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

          {/* サムネイル設定 */}
          <ThumbnailSelector
            title={title}
            icon={<FiHeadphones className="text-4xl text-gray-600" />}
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

          {/* メッセージ */}
          <label className="font-semibold block mb-2">メッセージ</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="メッセージを入力"
            value={caption}
            maxLength={1000}
            rows={3}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="text-sm text-right text-gray-500">{caption.length.toLocaleString()}/1,000</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 ">
        {/* タグ登録 */}
        <TagInput presets={["楽曲", "素材", "ASMR", "ラジオ", "AI"]} />

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
  );
};

export default PostPage;
