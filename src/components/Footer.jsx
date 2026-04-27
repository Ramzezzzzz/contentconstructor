import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold">КонтентКонструктор</span>
            </div>
            <p className="text-gray-400 text-sm">
              Физические носители с любимыми фильмами
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-white transition-colors"
                >
                  Носители
                </Link>
              </li>
              <li>
                <Link
                  to="/libraries"
                  className="hover:text-white transition-colors"
                >
                  Библиотеки
                </Link>
              </li>
              <li>
                <Link
                  to="/constructor"
                  className="hover:text-white transition-colors"
                >
                  Конструктор
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/delivery"
                  className="hover:text-white transition-colors"
                >
                  Доставка
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Оплата
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Гарантия
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>ramis.batrov@icloud.com</li>
              <li>+7 (916) 654-22-8</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          © 2026 КонтентКонструктор. Все права защищены
        </div>
      </div>
    </footer>
  );
}
