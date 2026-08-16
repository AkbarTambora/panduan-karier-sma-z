// src/components/Navbar.tsx
// Navigasi utama yang adaptif terhadap status sesi (Tamu vs Member)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Link Navigasi berdasarkan status login
  const navLinks = session
    ? [
        { href: '/', label: 'Dashboard' },
        { href: '/tes/mulai', label: 'Mulai Tes' },
        { href: '/explore', label: 'Explore Komunitas' },
        { href: '/riwayat', label: 'Riwayat Saya' },
      ]
    : [
        { href: '/', label: 'Beranda' },
        { href: '/tes/mulai', label: 'Mulai Tes' },
        { href: '/login?callbackUrl=/explore', label: 'Explore', badge: '🔒 Member' },
      ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 text-base leading-tight">
                Panduan Karier
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                SMA Gen-Z
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Tombol Auth & Menu Profil */}
          <div className="flex items-center space-x-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : session ? (
              /* User Avatar Menu */
              <div className="relative">
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center space-x-2 pl-3 pr-1 py-1 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-colors bg-white"
                >
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[120px] truncate">
                    {session.user?.name}
                  </span>
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {avatarMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAvatarMenuOpen(false)} />
                    <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">{session.user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                        {(session.user?.school || session.user?.class) && (
                          <p className="text-[11px] text-blue-600 font-semibold mt-0.5 truncate">
                            {[session.user.class, session.user.school].filter(Boolean).join(' • ')}
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>🏠</span>
                          <span>Dashboard Saya</span>
                        </Link>

                        <Link
                          href="/riwayat"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>📋</span>
                          <span>Riwayat &amp; Share Link</span>
                        </Link>

                        <Link
                          href="/explore"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>🌐</span>
                          <span>Explore Komunitas</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Tombol Masuk / Daftar untuk Tamu */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Tombol Hamburger Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {!session && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                Daftar Akun
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
