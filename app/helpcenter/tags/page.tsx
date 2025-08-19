export default function ImagesPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white p-8 space-y-4">
      <h1 className="text-2xl font-bold">
        ここはタグについての説明ページです（暫定）
      </h1>
      <ul className="list-disc text-lg pl-6">
        <li>一度登録したタグもクリックで編集可能</li>
        <li>ドラッグアンドドロップで順番の変更が可能</li>
      </ul>
    </main>
  );
}
