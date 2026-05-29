'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

const MAX_ATTEMPTS = 5;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (attempts >= MAX_ATTEMPTS) return;

    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn('credentials', {
        username: fd.get('username'),
        password: fd.get('password'),
        redirect: false,
      });

      if (result?.error) {
        setAttempts((a) => a + 1);
        setError(attempts + 1 >= MAX_ATTEMPTS ? 'Too many attempts. Refresh and try again.' : 'Invalid username or password.');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
          <p className="text-sm text-text-muted mt-1">aidirectory management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Username</label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              disabled={attempts >= MAX_ATTEMPTS}
              className="w-full px-3 py-2.5 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={attempts >= MAX_ATTEMPTS}
              className="w-full px-3 py-2.5 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="bg-paid-bg border border-paid/20 text-paid rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || attempts >= MAX_ATTEMPTS}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
