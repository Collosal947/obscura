import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
        <p className="text-gray-400 mb-8">Join Obscura today</p>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Full Name', key: 'full_name', type: 'text', placeholder: 'John Doe' },
            { label: 'Username', key: 'username', type: 'text', placeholder: 'johndoe' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-gray-400 text-sm mb-1 block">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({...form, [key]: e.target.value})}
                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition"
                placeholder={placeholder}
              />
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}