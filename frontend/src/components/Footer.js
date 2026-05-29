import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-black text-primary mb-3">OBSCURA</h3>
            <p className="text-gray-400 text-sm">Your premium destination for movie ratings, reviews, and discovery.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
              <Link to="/search" className="text-gray-400 hover:text-white text-sm transition">Movies</Link>
              <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Login</Link>
              <Link to="/register" className="text-gray-400 hover:text-white text-sm transition">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">About</h4>
            <p className="text-gray-400 text-sm">Built with React, Node.js, and MySQL. A cinematic experience for film lovers.</p>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-gray-500 text-sm">
          © 2024 Obscura. All rights reserved.
        </div>
      </div>
    </footer>
  );
}