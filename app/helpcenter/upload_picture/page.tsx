export default function ImagesPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white p-8 space-y-4">
      <h1 className="text-2xl font-bold">
        ここは画像投稿のアップロード部分についての説明ページです（暫定）
      </h1>
      <ul className="list-disc text-lg pl-6">
        <li>ダブルクリックでサムネイル指定に使う画像の位置の指定が可能</li>
        <li>ドラッグアンドドロップで順番の変更が可能</li>
      </ul>
    </main>
  );
}
