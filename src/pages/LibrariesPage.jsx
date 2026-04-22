import AnimatedPage from "../components/AnimatedPage";

export default function LibrariesPage() {
  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Библиотеки фильмов</h1>
          <p className="text-gray-400">
            Здесь будут отображаться готовые подборки фильмов.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
