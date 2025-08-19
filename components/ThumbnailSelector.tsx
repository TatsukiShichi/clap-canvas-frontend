import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";

interface ThumbnailSelectorProps {
  title: string;
  icon: React.ReactNode;
  images: string[];
  setImages: (images: string[]) => void;
  croppedImage: string | null;
  setCroppedImage: (image: string) => void;
  CropComponentProps: {
    crop: any;
    zoom: number;
    setCrop: (c: any) => void;
    setZoom: (z: number) => void;
    onCropComplete: (c: any, z: any) => void;
    tempCroppedData: string | null;
    thumbnailIndex: number;
  };
}

export default function ThumbnailSelector({
  title,
  icon,
  images,
  setImages,
  croppedImage,
  setCroppedImage,
  CropComponentProps,
}: ThumbnailSelectorProps) {
  const {
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    tempCroppedData,
    thumbnailIndex,
  } = CropComponentProps;

  const [selectedType, setSelectedType] = useState<"icon" | "title" | "upload">("icon");

  const { getRootProps, getInputProps, open: handleClick } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages([reader.result]);
        }
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <div>
      <label className="font-semibold block mb-2">サムネイル設定</label>

      {/* 選択肢 */}
      <div className="flex gap-4 mb-8 justify-center">
        {/* アイコン */}
        <div
          className={`w-32 h-32 flex items-center justify-center rounded cursor-pointer border ${
            selectedType === "icon" ? "border-blue-500" : "border-gray-300"
          } bg-white`}
          onClick={() => setSelectedType("icon")}
        >
          {icon}
        </div>

        {/* タイトル */}
        <div
          className={`w-32 h-32 flex items-center justify-center rounded cursor-pointer border text-center px-2 ${
            selectedType === "title" ? "border-blue-500" : "border-gray-300"
          } bg-white`}
          onClick={() => setSelectedType("title")}
        >
          <span className="text-sm text-gray-700 break-all text-center line-clamp-6">
            {title || "タイトルを表示"}
          </span>
        </div>

        {/* アップロード */}
        <div
          {...getRootProps({ onClick: handleClick })}
          className={`w-32 h-32 flex items-center justify-center rounded cursor-pointer border ${
            selectedType === "upload" ? "border-blue-500" : "border-gray-300"
          } bg-gray-200 relative overflow-hidden`}
        >
          <input {...getInputProps()} />
          <FiPlus className="text-3xl text-gray-500" />
        </div>
      </div>

      {/* Cropper */}
      {images[0] && (
        <>
          <div className="relative w-full h-[400px] bg-gray-100 mb-6">
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

          {/* Zoom control */}
          <div className="w-full max-w-md mb-6">
            <label className="block mb-2 font-semibold">ズーム</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={5}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 cursor-pointer"
              />
              <button
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                −
              </button>
              <button
                onClick={() => setZoom((prev) => Math.min(5, prev + 0.1))}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ＋
              </button>
            </div>
          </div>

          {/* 確定ボタン */}
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mb-8 cursor-pointer"
              onClick={() => {
                if (tempCroppedData) setCroppedImage(tempCroppedData);
              }}
            >
              サムネイルを確定
            </button>
          </div>
        </>
      )}

      {/* プレビュー */}
      {croppedImage && (
        <div className="mb-8 text-center">
          <h2 className="font-semibold mb-2">サムネイルプレビュー</h2>
          <Image src={croppedImage} alt="Cropped" width={300} height={200} className="rounded mx-auto" />
        </div>
      )}
    </div>
  );
}
