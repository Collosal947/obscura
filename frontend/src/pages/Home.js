import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import api from '../api';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, r] = await Promise.all([
          api.get('/movies/trending'),
          api.get('/movies/top-rated'),
        ]);
        setTrending(t.data);
        setTopRated(r.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const hero = trending[0];

  return (
    <div className="pt-16">
      {/* Hero */}
      {hero && (
        <div className="relative h-[70vh] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <img
            src={hero.poster || `https://via.placeholder.com/1280x720/0a0a0a/e50914?text=${encodeURIComponent(hero.title)}`}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            onError={(e) => { e.target.src = `https://via.placeholder.com/1280x720/0a0a0a/e50914?text=${encodeURIComponent(hero.title)}`; }}
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 pb-16">
            <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-widest">Trending #1</p>
            <h1 className="text-5xl font-black text-white mb-3">{hero.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <FiStar className="fill-current" />
                <span className="text-white font-bold">{hero.avg_rating}</span>
              </div>
              <span className="text-gray-400">{hero.release_year}</span>
              <span className="text-gray-400">{hero.language}</span>
            </div>
            <p className="text-gray-300 max-w-lg line-clamp-3 mb-6">{hero.description}</p>
            <Link to={`/movie/${hero.id}`} className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition inline-block">
              View Details
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Trending */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FiTrendingUp className="text-primary" size={20} />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>

        {/* Top Rated */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <FiAward className="text-primary" size={20} />
            <h2 className="text-2xl font-bold text-white">Top Rated</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topRated.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </div>
    </div>
  );
}