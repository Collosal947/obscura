import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../api';
import MovieCard from '../components/MovieCard';

const GENRES = ['Action','Comedy','Drama','Horror','Sci-Fi','Thriller','Romance','Animation','Documentary','Fantasy'];
const LANGUAGES = ['English','Korean','Japanese','Telugu','Hindi','French'];
const YEARS = ['2024','2023','2022','2021','2020','2019','2018','2010','2000','1990'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('avg_rating');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (language) params.append('language', language);
      if (year) params.append('year', year);
      params.append('sort', sort);
      params.append('limit', '24');
      const res = await api.get(`/movies?${params}`);
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, [genre, language, year, sort]);
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setSearch(q); }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-8">Browse Movies</h1>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center bg-card border border-border rounded-lg px-4 py-3">
          <FiSearch className="text-gray-400 mr-3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchMovies()}
            placeholder="Search movies..."
            className="bg-transparent text-white outline-none w-full"
          />
        </div>
        <button onClick={fetchMovies} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold">
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select value={genre} onChange={e => setGenre(e.target.value)} className="bg-card border border-border text-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary">
          <option value="">All Genres</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-card border border-border text-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary">
          <option value="">All Languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} className="bg-card border border-border text-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary">
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="bg-card border border-border text-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary">
          <option value="avg_rating">Top Rated</option>
          <option value="total_ratings">Most Popular</option>
          <option value="release_year">Newest First</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-gray-400 mb-4">{movies.length} movies found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          {movies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No movies found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}