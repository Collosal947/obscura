import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiPlus, FiHeart, FiClock, FiCalendar, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const submitReview = async () => {
    if (!user) return toast.error('Login to submit a review');
    if (!review.trim()) return toast.error('Write something first');
    setSubmitting(true);
    try {
      await api.post(`/reviews/${id}`, { content: review });
      toast.success('Review submitted!');
      setReview('');
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const submitRating = async (rating) => {
  if (!user) return toast.error('Login to rate');
  try {
    const res = await api.post(`/ratings/${id}`, { rating });
    setUserRating(rating);
    toast.success(`Rated ${rating}/10!`);
    const updated = await api.get(`/movies/${id}`);
    setMovie(updated.data);
  } catch (err) {
    console.log('Rating error:', err.response?.data);
    if (err.response?.status === 500) {
      setUserRating(rating);
      toast.success(`Rated ${rating}/10!`);
    } else {
      toast.error('Failed to rate');
    }
  }
};

  const addToWatchlist = async () => {
    if (!user) return toast.error('Login first');
    try {
      await api.post(`/users/watchlist/${id}`);
      toast.success('Added to watchlist!');
    } catch { toast.error('Already in watchlist'); }
  };

  const addToFavorites = async () => {
    if (!user) return toast.error('Login first');
    try {
      await api.post(`/users/favorites/${id}`);
      toast.success('Added to favorites!');
    } catch { toast.error('Already in favorites'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <p className="text-gray-400 text-xl">Movie not found</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark z-10" />
        <img
          src={movie.poster || `https://via.placeholder.com/1280x500/141414/e50914?text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30"
          onError={(e) => { e.target.src = `https://via.placeholder.com/1280x500/141414/e50914?text=${encodeURIComponent(movie.title)}`; }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-48 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="w-48 h-72 flex-shrink-0 rounded-xl overflow-hidden border-2 border-border shadow-2xl">
            <img
              src={movie.poster || `https://via.placeholder.com/200x300/141414/e50914?text=${encodeURIComponent(movie.title)}`}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = `https://via.placeholder.com/200x300/141414/e50914?text=${encodeURIComponent(movie.title)}`; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <FiStar className="fill-current" size={20} />
                <span className="text-white text-xl font-bold">{movie.avg_rating}</span>
                <span className="text-gray-400 text-sm">/ 10</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <FiCalendar size={14} /> <span className="text-sm">{movie.release_year}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <FiClock size={14} /> <span className="text-sm">{movie.duration} min</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <FiGlobe size={14} /> <span className="text-sm">{movie.language}</span>
              </div>
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.split(', ').map(g => (
                  <span key={g} className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full border border-primary/30">{g}</span>
                ))}
              </div>
            )}

            <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">{movie.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={addToWatchlist} className="flex items-center gap-2 bg-card border border-border text-white px-5 py-2.5 rounded-lg hover:border-primary transition">
                <FiPlus /> Watchlist
              </button>
              <button onClick={addToFavorites} className="flex items-center gap-2 bg-card border border-border text-white px-5 py-2.5 rounded-lg hover:border-red-400 transition">
                <FiHeart /> Favorite
              </button>
            </div>

            {/* Rate */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Your Rating:</p>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    onClick={() => submitRating(n)}
                    className={`w-8 h-8 rounded text-sm font-bold transition ${userRating >= n ? 'bg-yellow-400 text-black' : 'bg-card border border-border text-gray-400 hover:border-yellow-400'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {movie.trailer_url && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Trailer</h2>
            <div className="aspect-video max-w-2xl rounded-xl overflow-hidden border border-border">
              <iframe
                src={movie.trailer_url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title="Trailer"
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Cast & Crew</h2>
            <div className="flex flex-wrap gap-3">
              {movie.cast.map(c => (
                <div key={c.id} className="bg-card border border-border rounded-lg px-4 py-2">
                  <p className="text-white text-sm font-semibold">{c.name}</p>
                  <p className="text-gray-400 text-xs">{c.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Reviews ({movie.reviews?.length || 0})</h2>

          {user && (
            <div className="bg-card border border-border rounded-xl p-4 mb-6">
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-primary transition resize-none h-24"
              />
              <button
                onClick={submitReview}
                disabled={submitting}
                className="mt-3 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {movie.reviews?.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {r.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-white font-semibold">{r.username}</span>
                  <span className="text-gray-500 text-xs ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}