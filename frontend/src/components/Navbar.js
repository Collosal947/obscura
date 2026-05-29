import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch('');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-primary tracking-wider">
          OBSCURA
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-card border border-border rounded-lg px-3 py-2 w-80">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
          />
        </form>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-300 hover:text-white text-sm transition">Home</Link>
          <Link to="/search" className="text-gray-300 hover:text-white text-sm transition">Movies</Link>
          {user ? (
  <>
    {user.role === 'admin' && (
      <Link to="/admin" className="text-gray-300 hover:text-white text-sm transition">Dashboard</Link>
    )}
    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition">
      <FiUser /> {user.username}
    </Link>
    <button onClick={logout} className="flex items-center gap-1 text-gray-400 hover:text-primary text-sm transition">
      <FiLogOut /> Logout
    </button>
  </>
) : (
  <>
    <Link to="/login" className="text-gray-300 hover:text-white text-sm transition">Login</Link>
    <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
      Sign Up
    </Link>
  </>
)}
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-center bg-dark border border-border rounded-lg px-3 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="bg-transparent text-white text-sm outline-none w-full"
            />
          </form>
          <Link to="/" className="text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/search" className="text-gray-300" onClick={() => setMenuOpen(false)}>Movies</Link>
          {user ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              <Link to="/profile" className="text-gray-300" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-gray-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}