import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Star, Plane, Car, Tent, ArrowRight } from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL; // '/movie/'

const useCases = [
  {
    icon: Plane,
    title: "В самолёте",
    desc: "Смотрите без интернета в полёте.",
    image: `${BASE_URL}images/airplane.jpg`,
  },
  {
    icon: Car,
    title: "В дороге",
    desc: "Займите детей в автомобиле.",
    image: `${BASE_URL}images/car.webp`,
  },
  {
    icon: Tent,
    title: "На природе",
    desc: "Кинотеатр у костра.",
    image: `${BASE_URL}images/camping.jpg`,
  },
];

function MiniConstructor() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const demofilms = [
    { id: 1, title: "Интерстеллар", year: 2014, rating: 8.6 },
    { id: 2, title: "Начало", year: 2010, rating: 8.7 },
    { id: 3, title: "Побег из Шоушенка", year: 1994, rating: 9.1 },
    { id: 4, title: "Тёмный рыцарь", year: 2008, rating: 9.0 },
  ];

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length === 0) {
      setResults([]);
    } else {
      setResults(
        demofilms.filter((f) =>
          f.title.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Название любимого фильма..."
          className="w-full py-4 pl-12 pr-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors"
        />
      </div>
      {results.length > 0 && (
        <ul className="mt-2 bg-zinc-800 border border-white/10 rounded-xl overflow-hidden">
          {results.map((f) => (
            <li
              key={f.id}
              className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>
                {f.title} ({f.year}) – {f.rating}
              </span>
              <Link
                to="/constructor"
                className="ml-auto px-3 py-1 bg-red-600 rounded-lg text-sm"
              >
                Добавить
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-gray-500 mt-4 text-center">
        Это демо‑версия. В полном конструкторе — тысячи фильмов.
      </p>
    </div>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="bg-black text-white">
      {/* Экран 1: Герой */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          style={{ y, backgroundImage: `url(${BASE_URL}images/hero_bg.webp)` }}
          className="absolute inset-0 bg-cover bg-center opacity-40"
        />
        <div className="relative z-10 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Твой офлайн‑кинотеатр
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12"
          >
            Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно,
            без интернета.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/constructor"
              className="inline-flex items-center gap-2 px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
            >
              Создать коллекцию <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 rotate-90 text-white/50" />
        </div>
      </section>

      {/* Экран 2: Преимущества */}
      <section className="py-32 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            Всегда с тобой
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {useCases.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="text-center group"
              >
                <div className="overflow-hidden rounded-3xl mb-6 shadow-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <item.icon className="w-10 h-10 mx-auto mb-3 text-red-400" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Экран 3: Быстрый старт */}
      <section className="py-32 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Начните прямо сейчас
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12"
          >
            Любимый фильм уже ждёт вас на физическом носителе.
          </motion.p>
          <MiniConstructor />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Link
              to="/libraries"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Посмотреть готовые подборки <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
