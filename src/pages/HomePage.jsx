import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Plane,
  Car,
  Tent,
  ArrowRight,
  Film,
  HardDrive,
  Usb,
  Database,
  Shield,
  Zap,
  Truck,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL; // '/movie/'

// Популярные фильмы для витрины
const popularFilms = [
  {
    id: 1,
    title: "Интерстеллар",
    year: 2014,
    rating: 8.6,
    poster:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/4e1e85e1-2a4c-4f8d-8bcb-4d4e8e5e3c5f/300x450",
  },
  {
    id: 2,
    title: "Начало",
    year: 2010,
    rating: 8.7,
    poster:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4c8b29d0-9b5c-4b4e-8b4b-8f5c2a7d7c1a/300x450",
  },
  {
    id: 3,
    title: "Побег из Шоушенка",
    year: 1994,
    rating: 9.1,
    poster:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4c0d8e0a-7f1c-4c8e-8b4b-4f4d4d7e4b4f/300x450",
  },
  {
    id: 4,
    title: "Тёмный рыцарь",
    year: 2008,
    rating: 9.0,
    poster:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/4e1b8ec7-3c68-4b1b-8b4b-4d8e5f5c4d4f/300x450",
  },
];

// Варианты использования
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

/* ================== Витрина популярных фильмов ================== */
function PopularFilmShowcase() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {popularFilms.map((film, idx) => (
        <motion.div
          key={film.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative group cursor-pointer overflow-hidden rounded-2xl bg-zinc-800/30 border border-white/10"
        >
          <img
            src={film.poster}
            alt={film.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
            <h3 className="text-lg font-bold truncate">{film.title}</h3>
            <div className="flex items-center gap-1 text-sm text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              {film.rating}
              <span className="text-gray-400 ml-2">{film.year}</span>
            </div>
          </div>
          <Link
            to="/constructor"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="px-6 py-3 bg-red-600 rounded-xl font-semibold shadow-lg">
              Добавить в коллекцию
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ================== Экран 1: Герой ================== */
function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
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
          Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно, без
          интернета.
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ArrowRight className="w-6 h-6 rotate-90 text-white/50" />
      </motion.div>
    </section>
  );
}

/* ================== Экран 2: Популярные фильмы ================== */
function PopularFilms() {
  return (
    <section className="py-32 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Начните с любимого фильма
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Просто выберите — и мы поможем собрать полную коллекцию.
        </motion.p>
        <PopularFilmShowcase />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link
            to="/constructor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-xl shadow-red-600/20 transition-all"
          >
            Открыть конструктор <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ================== Экран 3: Преимущества ================== */
function Advantages() {
  return (
    <section className="py-32 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-20">Всегда с тобой</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {useCases.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
  );
}

/* ================== Экран 4: Призыв к действию ================== */
function CTA() {
  return (
    <section className="py-32 bg-gradient-to-b from-black to-zinc-900 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Готовы собрать свою коллекцию?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-12"
        >
          Выбирайте фильмы, носитель и получайте заказ за пару дней.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/constructor"
            className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
          >
            Конструктор
          </Link>
          <Link
            to="/libraries"
            className="px-10 py-5 border border-white/30 hover:bg-white/10 rounded-2xl text-xl font-semibold transition-all active:scale-95"
          >
            Готовые библиотеки
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================== ГЛАВНАЯ СТРАНИЦА ================== */
export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <Hero />
      <PopularFilms />
      <Advantages />
      <CTA />
    </div>
  );
}
