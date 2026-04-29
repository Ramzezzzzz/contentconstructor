import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Plus, Trash2, HardDrive, Clock, Film, Star, Package,
  Monitor, Music, Users, BookOpen, Usb, Database, Settings,
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_KEY = '7fd95d4b-d51b-4959-9e36-408eb4dcba93';
const API_BASE = '/movie/api';
const BASE_URL = import.meta.env.BASE_URL;

// Дебаунс
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Жанры (демо)
const genres = [
  { name: 'Боевик', icon: Monitor },
  { name: 'Комедия', icon: Users },
  { name: 'Музыка', icon: Music },
  { name: 'Документальное', icon: BookOpen },
];

/* ================== Визуальный носитель ================== */
const deviceTypes = {
  usb: { icon: Usb, name: 'USB-флешка', baseCapacity: 32, maxCapacity: 256, color: 'from-red-500 to-orange-400', label: 'ГБ' },
  ssd: { icon: Database, name: 'SSD накопитель', baseCapacity: 500, maxCapacity: 2048, color: 'from-blue-500 to-cyan-400', label: 'ГБ' },
  hdd: { icon: HardDrive, name: 'Жёсткий диск', baseCapacity: 1000, maxCapacity: 8192, color: 'from-yellow-500 to-amber-400', label: 'ГБ' },
};

function StorageFiller({ collection, type, onChangeType, onRemove }) {
  const device = deviceTypes[type];
  const totalSize = collection.length * 2.5; // ~2.5 ГБ на фильм
  const maxSize = device.maxCapacity;
  const fillPercent = Math.min(100, (totalSize / maxSize) * 100);

  return (
    <div className="bg-zinc-800/30 border border-white/10 rounded-2xl p-4 md:p-6">
      {/* Селектор носителя */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-red-500" />
        <select
          value={type}
          onChange={(e) => onChangeType(e.target.value)}
          className="bg-black border border-white/20 rounded-xl px-3 py-1 text-white text-sm focus:border-red-500 outline-none"
        >
          {Object.entries(deviceTypes).map(([key, dev]) => (
            <option key={key} value={key}>{dev.name}</option>
          ))}
        </select>
      </div>

      {/* Контейнер-флешка */}
      <div className="relative bg-black/50 border border-white/10 rounded-2xl p-4 mb-4 overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <device.icon className="w-8 h-8 text-white/80" />
          <span className="text-sm text-gray-400">{totalSize.toFixed(1)} из {maxSize} {device.label}</span>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full h-3 bg-zinc-700 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${device.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Сетка мини-постеров */}
        <div className="grid grid-cols-4 gap-2 min-h-[80px]">
          <AnimatePresence>
            {collection.map((movie) => (
              <motion.div
                key={movie.kinopoisk_id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative group"
              >
                <img
                  src={movie.poster_url || 'https://via.placeholder.com/80x120?text=...'}
                  alt={movie.title}
                  className="w-full h-auto object-cover rounded-lg border border-white/10"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120?text='; }}
                />
                <button
                  onClick={() => onRemove(movie.kinopoisk_id)}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {collection.length === 0 && (
            <div className="col-span-4 flex items-center justify-center text-gray-500 text-sm py-4">
              Добавьте фильм, чтобы начать заполнение
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== Главный конструктор ================== */
export default function ConstructorPage() {
  const { user, token } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [deviceType, setDeviceType] = useState('usb'); // тип носителя

  const searchInputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  // Загрузка коллекции
  useEffect(() => {
    if (!user || !token) { setInitialLoad(false); return; }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/collection.php`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setCollection(data);
      } catch (err) { console.error('Ошибка загрузки коллекции:', err); }
      finally { setInitialLoad(false); }
    })();
  }, [user, token]);

  // Поиск
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) { setSearchResults([]); return; }
    setLoading(true);
    try {
      const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(searchQuery)}&page=1`;
      const res = await fetch(url, { headers: { 'X-API-KEY': API_KEY } });
      if (!res.ok) throw new Error('Ошибка поиска');
      const data = await res.json();
      setSearchResults(data.films?.slice(0, 20) || []);
    } catch (error) { console.error(error); setSearchResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { handleSearch(debouncedQuery); }, [debouncedQuery, handleSearch]);

  // Добавление в коллекцию
  const addToCollection = async (movie) => {
    if (!user || !token) return;
    if (collection.some((item) => item.kinopoisk_id === movie.filmId)) return;
    try {
      const res = await fetch(`${API_BASE}/collection.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ kinopoisk_id: movie.filmId, title: movie.nameRu || movie.nameEn || 'Без названия', poster_url: movie.posterUrl || '', rating: movie.rating || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка добавления');
      setCollection(prev => [...prev, { kinopoisk_id: movie.filmId, title: movie.nameRu || movie.nameEn, poster_url: movie.posterUrl, rating: movie.rating }]);
    } catch (err) { console.error(err); alert('Не удалось добавить фильм: ' + err.message); }
  };

  // Удаление
  const removeFromCollection = async (kinopoiskId) => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE}/collection.php`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ kinopoisk_id: kinopoiskId }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Ошибка удаления'); }
      setCollection(prev => prev.filter(item => item.kinopoisk_id !== kinopoiskId));
    } catch (err) { console.error(err); alert('Не удалось удалить фильм: ' + err.message); }
  };

  const clearSearch = () => { setQuery(''); setSearchResults([]); searchInputRef.current?.focus(); };
  const handleKeyDown = (e) => { if (e.key === 'Escape') clearSearch(); };

  if (initialLoad) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
        <Film className="w-16 h-16 text-red-500" />
      </motion.div>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Конструктор коллекции</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Найдите любимые фильмы и сохраните их в свой аккаунт</p>
          </motion.div>

          {/* Поиск + жанры */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input ref={searchInputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Введите название фильма..." className="w-full py-4 pl-12 pr-12 bg-zinc-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors text-lg" />
              {query && <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>}
            </div>
            {loading && <div className="absolute -bottom-8 left-0 right-0 text-center text-gray-400 text-sm">Поиск...</div>}
          </div>

          <div className="flex justify-center flex-wrap gap-3 mb-8">
            {genres.map(genre => (
              <button key={genre.name} onClick={() => setSelectedGenre(genre.name === selectedGenre ? null : genre.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedGenre === genre.name ? 'bg-red-600 border-red-600 text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'}`}>
                <genre.icon className="w-4 h-4" />{genre.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Результаты поиска */}
            <div className="lg:col-span-2">
              {searchResults.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Результаты поиска</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {searchResults.map(movie => (
                        <motion.div key={movie.filmId} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group">
                          <img src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=Нет+постера'} alt={movie.nameRu} className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=Нет+постера'; }} loading="lazy" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-sm font-bold truncate">{movie.nameRu}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span>{movie.rating}</span></div>
                              <button onClick={() => addToCollection(movie)} disabled={collection.some(m => m.kinopoisk_id === movie.filmId)} className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
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
                <div className="text-center py-16 text-gray-400"><Film className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Ничего не найдено</p><p className="text-sm mt-2">Попробуйте изменить запрос</p></div>
              ) : !query ? (
                <div className="text-center py-16 text-gray-400"><Search className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Начните вводить название фильма</p><p className="text-sm mt-2">или выберите жанр выше</p><Link to="/libraries" className="inline-block mt-4 text-red-500 hover:text-red-400 transition-colors">Перейти в готовые библиотеки</Link></div>
              ) : null}
            </div>

            {/* Панель коллекции (флешка) */}
            <div className="space-y-6">
              <StorageFiller collection={collection} type={deviceType} onChangeType={setDeviceType} onRemove={removeFromCollection} />
              <Link to="/catalog" className="block w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-center font-semibold transition-colors">Перейти к выбору носителя</Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}