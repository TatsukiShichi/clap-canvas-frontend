"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Image from "next/image";
import { ReactSortable } from "react-sortablejs";
import { FiPlus } from "react-icons/fi";

import getCroppedImg from "./utils/cropImage";
import HelpButton from "../../components/HelpButton";
import PostForm from "../../components/PostForm";
import PostSettingsForm from "../../components/PostSettingsForm";
import TagInput from "../../components/TagInput";

const PostPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = 100 - images.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = acceptedFiles.slice(0, remainingSlots);

    const readers = filesToProcess.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setImages((prev) => [...prev, ...results]);
    });
  }, [images]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    disabled: images.length >= 100,
  });

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleCrop = useCallback(async () => {
    if (!images[thumbnailIndex] || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(images[thumbnailIndex], croppedAreaPixels);
    setCroppedImage(cropped);
  }, [images, thumbnailIndex, croppedAreaPixels]);

  // 共通部分の初期状態
  const [tagEditPermission, setTagEditPermission] = useState("すべてのユーザー");
  const [ageLimit, setAgeLimit] = useState("");
  const [visibility, setVisibility] = useState("すべてのユーザー");
  const [commentPermission, setCommentPermission] = useState("すべてのユーザー");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // 投稿ボタンの無効化条件
  const isPostDisabled = images.length === 0 || ageLimit === "";

  return (
    <div className="relative w-full max-w-10xl mx-auto p-8 flex flex-col items-center">
      <HelpButton
        href="/helpcenter/upload_picture"
        className="absolute top-0 right-8"
      />

      {images.length === 0 ? (
        <div {...getRootProps()}
          className="w-full h-[200px] bg-gray-200 mb-12 rounded flex justify-center items-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:opacity-70">
            <FiPlus className="text-xl" /> 画像を選択
          </button>
        </div>
      ) : (
        <>
          <ReactSortable
            tag="div"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full justify-center cursor-move"
            list={images.map((img, i) => ({ id: i.toString(), url: img }))}
            setList={(newList) => {
              setImages(newList.map((item) => item.url));
            }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative w-full min-w-0 aspect-square overflow-hidden border-1 ${
                  thumbnailIndex === index ? "border-red-500" : "border-transparent"
                }`}
                onDoubleClick={() => setThumbnailIndex(index)}
              >
                <Image
                  src={img}
                  alt={`preview-${index}`}
                  fill
                  className="object-contain rounded"
                />
                <button
                  type="button"
                  className="absolute top-[6px] right-[6px] bg-white rounded-full w-6 h-6 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition"
                  onClick={() => removeImage(index)}
                >
                  <span className="text-sm cursor-pointer">×</span>
                </button>
              </div>
            ))}
            <div
              {...getRootProps()}
              className="relative w-full min-w-0 aspect-square bg-gray-200 rounded flex justify-center items-center border cursor-pointer"
            >
              <input {...getInputProps()} />
              <FiPlus className="text-2xl text-gray-600" />
            </div>
          </ReactSortable>
          <p className="text-sm text-gray-500 mt-2 text-center">{images.length} / 100枚</p>
          <br />
        </>
      )}

      {images[0] && (
        <>
          <div className="relative max-w-md w-full h-[400px] bg-gray-100 mb-6">
            <Cropper
              image={images[thumbnailIndex]}
              crop={crop}
              zoom={zoom}
              aspect={3 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              minZoom={1}
              maxZoom={5}
            />
          </div>

          <div className="w-full max-w-md mb-6">
            <label className="block mb-2 font-semibold">ズーム</label>
            <input
              type="range"
              min={1}
              max={5}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mb-8 cursor-pointer"
            onClick={handleCrop}
          >
            サムネイルを確定
          </button>
        </>
      )}

      {croppedImage && (
        <div className="mb-8 text-center">
          <h2 className="font-semibold mb-2">サムネイルプレビュー</h2>
          <Image src={croppedImage} alt="Cropped" width={300} height={200} className="rounded mx-auto" />
        </div>
      )}

      <div className="relative w-full max-w-10xl flex flex-col items-center">
        {/* タイトル＋メッセージ */}
        <main className="w-full max-w-md">
          <PostForm />
        </main>

        <div className="w-full max-w-md space-y-8">
          {/* タグ登録 */}
          <TagInput presets={["オリジナル", "二次創作", "イラスト", "マンガ", "写真", "AI"]} />

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
