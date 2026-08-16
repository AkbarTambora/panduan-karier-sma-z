// src/app/(auth)/register/page.tsx
// Halaman Registrasi Akun Baru (Mendukung callbackUrl & prefill data dari guest test)

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const initialName = searchParams.get('nama') || '';
  const initialSchool = searchParams.get('sekolah') || '';
  const initialClass = searchParams.get('kelas') || '';

  const [formData, setFormData] = useState({
    name: initialName,
    email: '',
    password: '',
    confirmPassword: '',
    school: initialSchool,
    class: initialClass,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika parameter URL berubah, update form
  useEffect(() => {
    if (initialName) setFormData(prev => ({ ...prev, name: initialName }));
    if (initialSchool) setFormData(prev => ({ ...prev, school: initialSchool }));
    if (initialClass) setFormData(prev => ({ ...prev, class: initialClass }));
  }, [initialName, initialSchool, initialClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          school: formData.school,
          class: formData.class,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal membuat akun.');
        return;
      }

      // Auto-login setelah register berhasil
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        router.push(`/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFromTestResult = callbackUrl.includes('/hasil');
  const inputClass = "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Buat Akun Gratis</h1>
          <p className="text-slate-500 text-sm mt-1">Simpan riwayat tes &amp; bagikan hasilmu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 space-y-5">
          {/* Banner jika datang dari hasil tes guest */}
          {isFromTestResult && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-start space-x-2.5 text-xs">
              <span className="text-base">🎯</span>
              <div>
                <p className="font-bold">Simpan Hasil Tesmu</p>
                <p className="text-emerald-700 mt-0.5">
                  Setelah akun dibuat, hasil tes yang baru kamu kerjakan akan <strong>otomatis tersimpan</strong> di riwayat profilmu.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label htmlFor="name" className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
              <input
                id="name" type="text" value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClass} placeholder="Nama kamu" required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                id="email" type="email" value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={inputClass} placeholder="nama@email.com" required autoComplete="email"
              />
            </div>

            {/* Sekolah & Kelas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="school" className={labelClass}>Sekolah <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input
                  id="school" type="text" value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className={inputClass} placeholder="SMAN 1 Jakarta"
                />
              </div>
              <div>
                <label htmlFor="class" className={labelClass}>Kelas <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input
                  id="class" type="text" value={formData.class}
                  onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                  className={inputClass} placeholder="XI MIPA 1"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>Password <span className="text-red-500">*</span></label>
              <input
                id="password" type="password" value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={inputClass} placeholder="Minimal 6 karakter" required autoComplete="new-password"
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Konfirmasi Password <span className="text-red-500">*</span></label>
              <input
                id="confirmPassword" type="password" value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={inputClass} placeholder="Ulangi password" required autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-md shadow-blue-200 flex items-center justify-center space-x-2 mt-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Membuat Akun &amp; Menyimpan...</span>
                </>
              ) : (
                <span>Buat Akun Sekarang</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Sudah punya akun?{' '}
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-blue-600 hover:text-blue-700">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
