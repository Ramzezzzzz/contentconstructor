import AnimatedPage from "../components/AnimatedPage";
import { Film } from "lucide-react";

export default function ConstructorPage() {
  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Film className="w-20 h-20 mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-bold mb-4">Конструктор коллекции</h1>
          <p className="text-gray-400">
            Соберите свою уникальную подборку фильмов.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
