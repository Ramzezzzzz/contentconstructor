import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Sparkles, Package, Film } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const API_KEY = 'da5b6b9748f6df83ac6c08f2ce83f46a';
const BASE_URL = 'https://api.themoviedb.org/3';

// Категории (эндпоинты TMDB)
const categories = [
  {
    name: 'ТОП 100 IMDB',
    count: '100 фильмов',
    icon: Star,
    color: 'from-amber-600/20 to-amber-600/5',
    borderColor: 'border-amber-600/30',
    endpoint: '/movie/top_rated', // рейтинг IMDB
    params: '&vote_count.gte=1000&page=1',
  },
  {
    name: 'ТОП 100 Кинопоиск',
    count: '100 фильмов',
    icon: Star,
    color: 'from-orange-600/20 to-orange-600/5',
    borderColor: 'border-orange-600/30',
    endpoint: '/discover/movie',
    params: '&sort_by=vote_average.desc&vote_count.gte=500&with_original_language=ru|en&page=1',
  },
  {
    name: 'Фильмы по годам',
    count: '1950-2026',
    icon: Calendar,
    color: 'from-blue-600/20 to-blue-600/5',
    borderColor: 'border-blue-600/30',
    endpoint: '/discover/movie',
    params: '&sort_by=primary_release_date.desc&year=2024&page=1',
  },
  {
    name: 'Новинки 2026',
    count: '50+ фильмов',
    icon: Sparkles,
    color: 'from-purple-600/20 to-purple-600/5',
    borderColor: 'border-purple-600/30',
    endpoint: '/movie/now_playing',
    params: '&page=1',
  },
];

async function fetchMovies(endpoint, params) {
  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=ru${params}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results?.slice(0, 12) || []; // берём первые 12 фильмов для превью
}

export default function LibrariesPage() {
  const [libraryData, setLibraryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      categories.map(async (cat) => {
        const movies = await fetchMovies(cat.endpoint, cat.params);
        return { ...cat, movies };
      })
    ).then((data) => {
      setLibraryData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Film className="w-16 h-16 text-red-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Готовые библиотеки</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Кураторские подборки лучших фильмов всех времен — от классики до новинок
            </p>
          </motion.div>

          {libraryData.map((library, index) => (
            <motion.div
              key={library.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`mb-12 p-8 bg-gradient-to-br ${library.color} border ${library.borderColor} rounded-2xl`}
            >
              <div className="flex items-center gap-6 mb-6">
                <library.icon className="w-12 h-12 text-red-500" />
                <div>
                  <h2 className="text-3xl font-bold">{library.name}</h2>
                  <p className="text-gray-400">{library.count}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {library.movies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=Нет+постера'
                      }
                      alt={movie.title}
                      className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-sm font-bold truncate">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Выберите носитель при оформлении</span>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium">
                  Заказать подборку
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
