import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star, Plane, Car, Tent, ArrowRight, Film, Usb, Database, HardDrive,
  CheckCircle, User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.BASE_URL;

const useCases = [
  { icon: Plane, title: 'В самолёте', desc: 'Смотрите без интернета в полёте.', image: `${BASE_URL}images/airplane.jpg` },
  { icon: Car,   title: 'В дороге',   desc: 'Займите детей в автомобиле.', image: `${BASE_URL}images/car.webp` },
  { icon: Tent,  title: 'На природе', desc: 'Кинотеатр у костра.', image: `${BASE_URL}images/camping.jpg` },
];

// Расширенный список демо-фильмов
const demoFilms = [
  { id: 1, title: 'Интерстеллар', rating: 8.6, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/4e1e85e1-2a4c-4f8d-8bcb-4d4e8e5e3c5f/200x300' },
  { id: 2, title: 'Начало', rating: 8.7, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4c8b29d0-9b5c-4b4e-8b4b-8f5c2a7d7c1a/200x300' },
  { id: 3, title: 'Побег из Шоушенка', rating: 9.1, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4c0d8e0a-7f1c-4c8e-8b4b-4f4d4d7e4b4f/200x300' },
  { id: 4, title: 'Тёмный рыцарь', rating: 9.0, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/4e1b8ec7-3c68-4b1b-8b4b-4d8e5f5c4d4f/200x300' },
  { id: 5, title: 'Криминальное чтиво', rating: 8.9, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/2f7e6a8e-1c5d-4f6f-8e3e-2b1e6c1d2c3f/200x300' },
  { id: 6, title: 'Бойцовский клуб', rating: 8.8, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/3a5e6c7d-8f4b-4e1a-9f7e-1d2c3b4a5f6g/200x300' },
  { id: 7, title: 'Форрест Гамп', rating: 8.9, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/5f6e7a8d-9c0b-4e1f-8d2e-3e4f5a6b7c8d/200x300' },
  { id: 8, title: 'Матрица', rating: 8.5, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/6b7c8d9e-0f1a-4b2c-8d3e-4f5a6b7c8d9e/200x300' },
  { id: 9, title: 'Гарри Поттер', rating: 8.2, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8d9e0f1a-2b3c-4d4e-8f5a-6b7c8d9e0f1a/200x300' },
  { id: 10, title: 'Зелёная миля', rating: 9.0, poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b/200x300' },
];

/* ---------- Экран 1: Герой ---------- */
function Hero() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      <motion.div
        style={{ y, backgroundImage: `url(${BASE_URL}images/hero_bg.webp)` }}
        className="absolute inset-0 bg-cover bg-center opacity-30"
      />
      <div className="relative z-10 max-w-4xl">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6">
          {user ? `С возвращением, ${user.name || 'друг'}!` : 'Твой офлайн‑кинотеатр'}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl mx-auto mb-8 sm:mb-12">
          {user ? 'Ваша коллекция ждёт. Продолжите наполнять её или выберите готовую подборку.' : 'Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно, без интернета.'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link to="/constructor" className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-lg font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95">Продолжить сборку</Link>
              <Link to="/profile" className="px-8 py-4 border border-white/30 hover:bg-white/10 rounded-2xl text-lg font-semibold transition-all active:scale-95 inline-flex items-center justify-center gap-2"><User className="w-5 h-5" /> Личный кабинет</Link>
            </>
          ) : (
            <Link to="/constructor" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-lg font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95">Создать коллекцию <ArrowRight className="w-5 h-5" /></Link>
          )}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1, duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ArrowRight className="w-6 h-6 rotate-90 text-white/50" />
      </motion.div>
    </section>
  );
}

/* ---------- Экран 2: Как это работает (возвращён с анимацией) ---------- */
function HowItWorks() {
  const [selectedFilms, setSelectedFilms] = useState([]);
  const [step, setStep] = useState(0); // 0: выбор, 1: запись, 2: готово

  const toggleFilm = (film) => {
    setSelectedFilms(prev =>
      prev.find(f => f.id === film.id) ? prev.filter(f => f.id !== film.id) : [...prev, film]
    );
  };

  const handleRecord = () => {
    if (selectedFilms.length === 0) return;
    setStep(1);
    setTimeout(() => setStep(2), 2000); // имитация записи
  };

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Как это работает
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Выберите фильмы — они «запишутся» на флешку.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Сетка фильмов */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-xl lg:max-w-none">
            {demoFilms.map(film => (
              <motion.div
                key={film.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleFilm(film)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedFilms.some(f => f.id === film.id) ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-transparent'
                }`}
              >
                <img src={film.poster} alt={film.title} className="w-full h-36 sm:h-44 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                  <h3 className="text-xs font-bold truncate">{film.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3 h-3 fill-current" />{film.rating}</div>
                </div>
                {selectedFilms.some(f => f.id === film.id) && (
                  <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1"><CheckCircle className="w-4 h-4" /></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Визуальная флешка + кнопка */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-40 bg-zinc-800/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
              <Usb className="w-12 h-12 text-red-400" />
              {/* Анимация "запрыгивания" */}
              <AnimatePresence>
                {step === 1 && selectedFilms.map((film, idx) => (
                  <motion.div
                    key={film.id}
                    initial={{ opacity: 1, x: -80 + idx * 10, y: -50, scale: 0.6 }}
                    animate={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                    className="absolute z-20"
                  >
                    <img src={film.poster} alt="" className="w-10 h-14 object-cover rounded-lg" />
                  </motion.div>
                ))}
              </AnimatePresence>
              {step === 2 && selectedFilms.length > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>

            <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                initial={{ width: '0%' }}
                animate={{ width: step >= 1 ? '100%' : `${(selectedFilms.length / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400">
              {step === 0 && `Выбрано: ${selectedFilms.length}`}
              {step === 1 && 'Запись...'}
              {step === 2 && 'Готово!'}
            </p>
            {step === 0 && (
              <button onClick={handleRecord} disabled={selectedFilms.length === 0} className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors">
                Записать ({selectedFilms.length})
              </button>
            )}
            {step === 2 && (
              <Link to="/constructor" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors">
                Попробовать в конструкторе
              </Link>
            )}
            <button onClick={() => { setStep(0); setSelectedFilms([]); }} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Экран 3: Преимущества ---------- */
function Advantages() {
  return (
    <section className="py-20 sm:py-32 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20">
          Всегда с тобой
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

/* ---------- Экран 4: CTA ---------- */
function CTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-zinc-900 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Готовы собрать свою коллекцию?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl text-gray-400 mb-12"
        >
          Выбирайте фильмы, носитель и получайте заказ за пару дней.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/constructor"
            className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
          >
            Конструктор
          </Link>
          <Link
            to="/catalog"
            className="px-10 py-5 border border-white/30 hover:bg-white/10 rounded-2xl text-xl font-semibold transition-all active:scale-95"
          >
            Выбрать носитель
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <Hero />
      <HowItWorks />
      <Advantages />
      <CTA />
    </div>
  );
}
