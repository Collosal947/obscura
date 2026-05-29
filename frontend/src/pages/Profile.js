import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiHeart, FiBookmark, FiStar } from 'react-icons/fi';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('watchlist');
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        const [w, f] = await Promise.all([
          api.get('/users/watchlist'),
          api.get('/users/favorites'),
        ]);
        setWatchlist(w.data);
        setFavorites(f.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: FiBookmark, data: watchlist },
    { id: 'favorites', label: 'Favorites', icon: FiHeart, data: favorites },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black">
          {user.username?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black text-white mb-1">{user.username}</h1>
          <p className="text-gray-400 mb-1">{user.email}</p>
          {user.role === 'admin' && (
            <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full border border-primary/30">Admin</span>
          )}
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{watchlist.length}</p>
            <p className="text-gray-400 text-sm">Watchlist</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{favorites.length}</p>
            <p className="text-gray-400 text-sm">Favorites</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-primary transition text-sm">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${tab === t.id ? 'bg-primary text-white' : 'bg-card border border-border text-gray-400 hover:text-white'}`}
          >
            <t.icon size={16} /> {t.label} ({tabs.find(x => x.id === t.id)?.data.length || 0})
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(tab === 'watchlist' ? watchlist : favorites).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {(tab === 'watchlist' ? watchlist : favorites).length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400">Nothing here yet. Start adding movies!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}