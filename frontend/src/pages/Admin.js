import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiFilm, FiUsers, FiStar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', poster: '', trailer_url: '',
    release_year: '', language: '', duration: '', genres: []
  });

 useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [m, u, g] = await Promise.all([
        api.get('/movies?limit=100&sort=id&order=DESC'),
        api.get('/admin/users'),
        api.get('/admin/genres'),
      ]);
      setMovies(m.data);
      setUsers(u.data);
      setGenres(g.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies(movies.filter(m => m.id !== id));
      toast.success('Movie deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const addMovie = async () => {
    try {
      await api.post('/movies', form);
      toast.success('Movie added!');
      setShowAddMovie(false);
      setForm({ title: '', description: '', poster: '', trailer_url: '', release_year: '', language: '', duration: '', genres: [] });
      fetchData();
    } catch {
      toast.error('Failed to add movie');
    }
  };

  const toggleGenre = (id) => {
    setForm(f => ({
      ...f,
      genres: f.genres.includes(id) ? f.genres.filter(g => g !== id) : [...f.genres, id]
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <span className="bg-primary/20 text-primary text-sm px-3 py-1 rounded-full border border-primary/30">Admin</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Movies', value: movies.length, icon: FiFilm, color: 'text-blue-400' },
          { label: 'Total Users', value: users.length, icon: FiUsers, color: 'text-green-400' },
          { label: 'Total Genres', value: genres.length, icon: FiStar, color: 'text-yellow-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['movies', 'users'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition ${tab === t ? 'bg-primary text-white' : 'bg-card border border-border text-gray-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setShowAddMovie(true)}
          className="ml-auto flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          <FiPlus /> Add Movie
        </button>
      </div>

      {/* Movies Table */}
      {tab === 'movies' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Movie</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Year</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Language</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Rating</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} className="border-b border-border hover:bg-dark transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={movie.poster || `https://via.placeholder.com/40x60/141414/e50914?text=${encodeURIComponent(movie.title[0])}`}
                        alt={movie.title}
                        className="w-8 h-12 object-cover rounded"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/40x60/141414/e50914?text=${encodeURIComponent(movie.title[0])}`; }}
                      />
                      <span className="text-white text-sm font-medium">{movie.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{movie.release_year}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{movie.language}</td>
                  <td className="px-4 py-3 text-yellow-400 text-sm">⭐ {movie.avg_rating}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteMovie(movie.id)} className="text-gray-400 hover:text-red-400 transition">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Table */}
      {tab === 'users' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left text-gray-400 text-sm px-4 py-3">User</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Email</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Role</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Joined</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border hover:bg-dark transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-gray-800 text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-gray-400 hover:text-red-400 transition">
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovie && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Movie</h2>
              <button onClick={() => setShowAddMovie(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Title', key: 'title', type: 'text' },
                { label: 'Release Year', key: 'release_year', type: 'number' },
                { label: 'Language', key: 'language', type: 'text' },
                { label: 'Duration (mins)', key: 'duration', type: 'number' },
                { label: 'Poster URL', key: 'poster', type: 'text' },
                { label: 'Trailer URL', key: 'trailer_url', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition text-sm resize-none h-20"
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button
                    key={g.id}
                    onClick={() => toggleGenre(g.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${form.genres.includes(g.id) ? 'bg-primary text-white' : 'bg-dark border border-border text-gray-400 hover:border-primary'}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addMovie}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mt-6"
            >
              Add Movie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}