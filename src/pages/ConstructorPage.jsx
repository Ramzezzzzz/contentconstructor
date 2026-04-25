import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Plus, Trash2, HardDrive, Clock, Film, Star,
  ChevronLeft, Package,
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const API_KEY = '7fd95d4b-d51b-4959-9e36-408eb4dcba93';

// Функция дебаунса (чтобы не дёргать API на каждую букву)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Заглушка для постера
const ImageWithFallback = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x450?text=Нет+постера';
  };
  return <img src={src} alt={alt} className={className} onError={handleError} loading="lazy" />;
};

export default function ConstructorPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState(() => {
    // Загружаем коллекцию из localStorage при старте
    try {
      const saved = localStorage.getItem('cinebox_collection');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  // Сохранение коллекции в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('cinebox_collection', JSON.stringify(collection));
  }, [collection]);

  // Фокусировка на поле поиска при загрузке
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Поиск фильмов
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      // Правильный эндпоинт для поиска — v2.1
      const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(searchQuery)}&page=1`;
      const res = await fetch(url, {
        headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Ошибка поиска');
      const data = await res.json();
      setSearchResults(data.films?.slice(0, 20) || []);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Автопоиск при изменении debouncedQuery
  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  // Добавление фильма в коллекцию
  const addToCollection = (movie) => {
    if (collection.find((m) => m.kinopoiskId === movie.kinopoiskId)) return; // Уже есть
    setCollection((prev) => [...prev, movie]);
  };

  // Удаление фильма из коллекции
  const removeFromCollection = (kinopoiskId) => {
    setCollection((prev) => prev.filter((m) => m.kinopoiskId !== kinopoiskId));
  };

  // Очистка запроса
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  // Расчёт суммарных характеристик
  const totalMovies = collection.length;
  const totalSizeGB = (totalMovies * 2.5).toFixed(1); // ~2.5 ГБ на фильм (среднее)
  const totalDurationMin = totalMovies * 120; // предположим 120 мин в среднем
  const totalDurationHours = (totalDurationMin / 60).toFixed(1);

  // Обработчик клавиш
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Конструктор коллекции</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Найдите любимые фильмы и соберите свой уникальный набор на носитель
            </p>
          </motion.div>

          {/* Поисковая строка */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите название фильма..."
                className="w-full py-4 pl-12 pr-12 bg-zinc-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors text-lg"
                aria-label="Поиск фильмов"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors"
                  aria-label="Очистить поиск"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {loading && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-gray-400 text-sm">
                Поиск...
              </div>
            )}
          </motion.div>

          {/* Результаты поиска и коллекция */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая часть: результаты поиска */}
            <div className="lg:col-span-2">
              {searchResults.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Результаты поиска</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {searchResults.map((movie) => (
                        <motion.div
                          key={movie.kinopoiskId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group"
                        >
                          <ImageWithFallback
                            src={movie.posterUrl}
                            alt={movie.nameRu}
                            className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-sm font-bold truncate">{movie.nameRu}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{movie.rating}</span>
                              </div>
                              <button
                                onClick={() => addToCollection(movie)}
                                disabled={collection.some((m) => m.kinopoiskId === movie.kinopoiskId)}
                                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                aria-label="Добавить в коллекцию"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : query && !loading ? (
                <div className="text-center py-16 text-gray-400">
                  <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Ничего не найдено</p>
                  <p className="text-sm mt-2">Попробуйте изменить запрос</p>
                </div>
              ) : !query ? (
                <div className="text-center py-16 text-gray-400">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Начните вводить название фильма</p>
                </div>
              ) : null}
            </div>

            {/* Правая часть: коллекция */}
            <div>
              <div className="bg-zinc-800/30 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  Моя коллекция
                </h2>

                {collection.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Film className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Пока пусто</p>
                    <p className="text-xs mt-1">Ищите и добавляйте фильмы</p>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      <AnimatePresence>
                        {collection.map((movie) => (
                          <motion.li
                            key={movie.kinopoiskId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3 bg-black/30 rounded-xl p-2 border border-white/5"
                          >
                            <ImageWithFallback
                              src={movie.posterUrl}
                              alt={movie.nameRu}
                              className="w-12 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate">{movie.nameRu}</h3>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {movie.rating}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCollection(movie.kinopoiskId)}
                              className="p-1 hover:text-red-500 transition-colors"
                              aria-label="Удалить из коллекции"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    {/* Статистика */}
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><Film className="w-4 h-4" /> Фильмов</span>
                        <span>{totalMovies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><HardDrive className="w-4 h-4" /> Объём</span>
                        <span>≈ {totalSizeGB} ГБ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Время</span>
                        <span>≈ {totalDurationHours} ч</span>
                      </div>
                    </div>

                    {/* Кнопка оформления */}
                    <button className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-xl font-medium">
                      Перейти к выбору носителя
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}