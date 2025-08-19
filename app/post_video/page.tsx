"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";

import getCroppedImg from "./utils/cropImage";
import HelpButton from "../../components/HelpButton";
import PostForm from "../../components/PostForm";
import PostSettingsForm from "../../components/PostSettingsForm";
import TagInput from "../../components/TagInput";

const PostPage = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const isPlayableVideo = async (file: File): Promise<boolean> => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    return await new Promise<boolean>((resolve) => {
      video.preload = "metadata";
      video.src = url;
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
    });
  };

  const onVideoDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.size > 9999999999) {
      alert("10GB以下の動画のみアップロード可能です。");
      return;
    }

    const playable = await isPlayableVideo(file);
    if (!playable) {
      alert("この動画は読み込めませんでした。動画の形式や内容に互換性がない可能性があります。別の動画ファイルをお試しください。");
      return;
    }

    const url = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.src = url;

    await new Promise((resolve, reject) => {
      videoEl.onloadedmetadata = () => {
        if (videoEl.duration > 901) {
          alert("15分以内の動画のみアップロード可能です。");
          URL.revokeObjectURL(url);
          reject(null);
        } else {
          resolve(true);
        }
      };
      videoEl.onerror = () => {
        alert("動画の読み込みに失敗しました。");
        URL.revokeObjectURL(url);
        reject(null);
      };
    });

    setVideo(url);
  }, []);

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setThumbnails((prev) => [...prev, imageData]);
      setSelectedThumbnail(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: { "video/*": [] },
    onDrop: onVideoDrop,
    onDropRejected: (rejections) => {
      if (rejections.some(r => r.errors.some(e => e.code === "too-many-files"))) {
        alert("動画は1本のみアップロード可能です。");
      }
    },
    maxFiles: 1,
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: onThumbnailDrop,
    maxFiles: 1,
  });

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!selectedThumbnail || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(selectedThumbnail, croppedAreaPixels);
    setCroppedImage(cropped);
  }, [selectedThumbnail, croppedAreaPixels]);

  const [tagEditPermission, setTagEditPermission] = useState("すべてのユーザー");
  const [ageLimit, setAgeLimit] = useState("");
  const [visibility, setVisibility] = useState("すべてのユーザー");
  const [commentPermission, setCommentPermission] = useState("すべてのユーザー");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const isPostDisabled = thumbnails.length === 0 || ageLimit === "";

  return (
    <div className="relative w-full max-w-10xl mx-auto p-8 flex flex-col items-center">
      <HelpButton
        href="/helpcenter/upload_video"
        className="absolute top-0 right-8"
      />

      {!video ? (
        <div {...getVideoRootProps()} className="w-full h-[200px] bg-gray-200 mb-12 rounded flex justify-center items-center cursor-pointer">
          <input {...getVideoInputProps()} />
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:opacity-70 cursor-pointer">
            <FiPlus className="text-xl" /> 動画を選択
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <button
            onClick={() => {
              setVideo(null);
              setThumbnails([]);
              setSelectedThumbnail(null);
            }}
            className="absolute -top-3 -right-8 bg-white rounded-full w-8 h-8 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition cursor-pointer"
          >
            ×
          </button>

          <video
            src={video}
            controls
            className="w-full max-h-[400px] rounded-md"
            controlsList="nodownload noremoteplayback"
          />
        </div>
      )}

      {thumbnails.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            {thumbnails.map((thumb, i) => (
              <img
                key={i}
                src={thumb}
                onClick={() => setSelectedThumbnail(thumb)}
                className={`w-32 h-20 object-cover rounded border cursor-pointer ${selectedThumbnail === thumb ? "ring-2 ring-blue-500" : ""}`}
                alt={`thumb-${i}`}
              />
            ))}
            <div {...getImageRootProps()} className="w-32 h-20 bg-gray-200 rounded flex justify-center items-center border cursor-pointer">
              <input {...getImageInputProps()} />
              <FiPlus className="text-2xl text-gray-600" />
            </div>
          </div>

          <div className="relative w-full max-w-md h-[400px] bg-gray-100 mb-4">
            {selectedThumbnail && (
              <Cropper
                image={selectedThumbnail}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={1}
                maxZoom={5}
              />
            )}
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
        <main className="w-full max-w-md">
          <PostForm />
        </main>

        <div className="w-full max-w-md space-y-8">
          <TagInput presets={["メイキング", "解説", "AI"]} />
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
