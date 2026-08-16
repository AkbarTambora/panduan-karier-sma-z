// src/app/(main)/hasil/SaveResultButton.tsx
// Komponen Aksi Simpan, Auto-Save saat Login, Share WhatsApp, dan Salin Link

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { RiasecType } from '@/data/riasecQuestions';
import type { UserProfile } from '@/lib/services/riasecService';

interface SaveResultButtonProps {
  saveData: {
    testMode: 'quick' | 'full';
    scores: Record<RiasecType, number>;
    userProfile: UserProfile;
    nama: string;
    kelas: string;
    sekolah: string;
  };
  isLoggedIn: boolean;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function SaveResultButton({ saveData, isLoggedIn }: SaveResultButtonProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAutoSavedNotice, setIsAutoSavedNotice] = useState(false);
  const hasAutoSavedRef = useRef(false);

  const performSave = useCallback(async () => {
    if (saveState === 'saving' || (saveState === 'saved' && sessionId)) return sessionId;
    setSaveState('saving');

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...saveData, isPublic: true }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan hasil');

      const data = await res.json();
      setSessionId(data.sessionId);
      setSaveState('saved');
      return data.sessionId as string;
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
      return null;
    }
  }, [saveData, saveState, sessionId]);

  // 🚀 AUTO-SAVE KETIKA USER SUDAH LOGIN
  // Jika pengguna baru saja register/login dan kembali ke halaman ini, otomatis simpan ke akun!
  useEffect(() => {
    if (isLoggedIn && !hasAutoSavedRef.current) {
      hasAutoSavedRef.current = true;
      performSave().then((sid) => {
        if (sid) {
          setIsAutoSavedNotice(true);
        }
      });
    }
  }, [isLoggedIn, performSave]);

  const getShareUrl = (sid?: string) => {
    const finalSid = sid || sessionId;
    if (typeof window === 'undefined') return '';
    if (finalSid) {
      return `${window.location.origin}/hasil/${finalSid}`;
    }
    return window.location.href;
  };

  const handleShareWhatsApp = async () => {
    let currentSid = sessionId;
    if (!currentSid) {
      currentSid = await performSave();
    }
    const finalUrl = getShareUrl(currentSid || undefined);

    const waText = `Halo! Aku baru saja tes minat bakat RIASEC di Panduan Karier SMA Z 🎯\n\nPersona Minatku: *${saveData.userProfile.personaName}* (Kode: ${saveData.userProfile.topTwoCode})\n\nCek hasil analisis lengkap & rekomendasi jurusanku di sini:\n${finalUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = async () => {
    let currentSid = sessionId;
    if (!currentSid) {
      currentSid = await performSave();
    }
    const finalUrl = getShareUrl(currentSid || undefined);
    await navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Buat URL callback lengkap untuk register & login
  const currentPathWithSearch = typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search}`
    : '/hasil';

  const registerUrl = `/register?callbackUrl=${encodeURIComponent(currentPathWithSearch)}&nama=${encodeURIComponent(saveData.nama)}&sekolah=${encodeURIComponent(saveData.sekolah)}&kelas=${encodeURIComponent(saveData.kelas)}`;
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPathWithSearch)}`;

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Notifikasi Auto-Save untuk Member yang Login */}
      {isLoggedIn && isAutoSavedNotice && (
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-300">
          <span>🎉</span>
          <span>Hasil tes ini <strong>otomatis tersimpan</strong> di riwayat akunmu!</span>
        </div>
      )}

      {/* Tombol Aksi Cepat: WhatsApp & Salin Link */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {/* Tombol WhatsApp Share */}
        <button
          onClick={handleShareWhatsApp}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-200 transform hover:scale-105"
        >
          <span className="text-base">📲</span>
          <span>Bagikan ke WhatsApp</span>
        </button>

        {/* Tombol Salin Link */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
        >
          {copied ? (
            <>
              <span className="text-green-400 font-bold">✓</span>
              <span>Link Tersalin!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Salin Link Hasil</span>
            </>
          )}
        </button>

        {/* Tautan ke Riwayat untuk Member */}
        {isLoggedIn && (
          <Link
            href="/riwayat"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 border-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold text-xs sm:text-sm rounded-xl transition-all"
          >
            <span>📁</span>
            <span>Buka Riwayat</span>
          </Link>
        )}
      </div>

      {/* Banner Khusus Pengguna Tamu (Ajakan Registrasi dengan Callback Auto-Save) */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl text-center space-y-2.5 shadow-sm">
          <p className="text-xs text-slate-700 leading-relaxed">
            💡 <strong>Ingin simpan hasil ini ke akunmu?</strong> Buat akun sekarang, hasil tes ini akan <strong>otomatis tersimpan</strong> di riwayat profilmu tanpa perlu tes ulang.
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <Link
              href={registerUrl}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              Daftar &amp; Simpan Otomatis →
            </Link>
            <Link
              href={loginUrl}
              className="font-semibold text-slate-600 hover:text-slate-800 underline"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
