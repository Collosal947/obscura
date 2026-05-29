import { Link } from 'react-router-dom';
import { FiStar, FiPlus } from 'react-icons/fi';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function MovieCard({ movie }) {
  const { user } = useAuth();

  const addToWatchlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to add to watchlist');
    try {
      await api.post(`/users/watchlist/${movie.id}`);
      toast.success('Added to watchlist!');
    } catch {
      toast.error('Already in watchlist');
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative aspect-[2/3] bg-gray-800">
        <img
          src={movie.poster || `https://via.placeholder.com/300x450/141414/e50914?text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x450/141414/e50914?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <button onClick={addToWatchlist} className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition">
            <FiPlus /> Watchlist
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs">{movie.release_year}</span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <FiStar className="fill-current" />
            <span>{movie.avg_rating || 'N/A'}</span>
          </div>
        </div>
        {movie.genres && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-1">{movie.genres}</p>
        )}
      </div>
    </Link>
  );
}