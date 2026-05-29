import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, FolderOpen, Grid, LogOut, Settings } from 'lucide-react';
import { signOut } from '@/auth';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Grid },
  { href: '/admin/tools', label: 'Tools', icon: Settings },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <html lang="en">
      <body className="min-h-screen bg-base flex">
        {/* Sidebar */}
        <aside className="w-56 bg-hero text-text-inverse flex flex-col shrink-0">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="font-bold text-sm">aidirectory</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10">
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }); }}>
              <button type="submit" className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
