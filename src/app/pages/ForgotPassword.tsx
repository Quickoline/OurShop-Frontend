import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { shop } from '../config/shop';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetUrl('');
    setLoading(true);

    try {
      const response = await userApi.forgotPassword(email.trim());
      setMessage(
        response.message ||
          'If an account exists, a reset link has been generated.'
      );
      if (response.resetUrl) {
        setResetUrl(response.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md card-surface p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="section-label">{shop.name}</span>
          <h1 className="section-title text-3xl">Forgot password</h1>
          <p className="text-muted-foreground">
            Enter your email to get a password reset link.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {message}
          </div>
        )}

        {resetUrl ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Open this link to set a new password. It expires in 10 minutes.
            </p>
            <a
              href={resetUrl}
              className="block w-full text-center bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Reset password
            </a>
            <p className="text-xs text-muted-foreground break-all bg-secondary/50 rounded-xl p-3">
              {resetUrl}
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-modern"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Get reset link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
