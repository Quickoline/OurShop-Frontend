import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { shop } from '../config/shop';

export function ResetPassword() {
  const { token = '' } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Reset link is invalid.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.resetPassword(token, newPassword);
      const authToken = response.token;
      const user = response.user;

      if (!authToken || !user) {
        throw new Error(response.message || 'Invalid reset response from server');
      }

      setSession(authToken, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md card-surface p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="section-label">{shop.name}</span>
          <h1 className="section-title text-3xl">Set new password</h1>
          <p className="text-muted-foreground">
            Choose a new password for your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="input-modern pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input-modern"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 'Update password'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new link
          </Link>
          <span className="mx-2">·</span>
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
