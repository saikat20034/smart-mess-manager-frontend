import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  Key,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addMember } = useMess();
  const navigate = useNavigate();

  const [mode, setMode] = useState('create'); // 'create' or 'join'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    messName: '',
    inviteCode: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const role = mode === 'create' ? 'manager' : 'member';
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      });

      if (res.success) {
        // Also register in mess members
        await addMember({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role,
          status: 'active'
        });
        navigate('/dashboard');
      } else {
        setError(res.error || 'Failed to register account');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">
            Smart Mess <span className="text-emerald-600">Manager</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in to existing mess
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'create'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create New Mess
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'join'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Join with Code
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="tanvir@du.ac.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone / bKash
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01711223344"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {mode === 'create' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mess Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shahidullah Hall Mess 302"
                    value={formData.messName}
                    onChange={(e) => setFormData({ ...formData, messName: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mess Invite Code *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. PADMA2026"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : mode === 'create' ? 'Create Mess & Start' : 'Join Mess'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
