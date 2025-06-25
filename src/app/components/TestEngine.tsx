// src/components/TestEngine.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Pastikan path import ini sesuai dengan konfigurasimu yang sudah bekerja
import { riasecQuestions, RiasecType } from '@/data/riasecQuestions';

// Definisikan tipe untuk jawaban, kita tambahkan 'type' untuk mempermudah kalkulasi
type Answer = {
  questionId: number;
  value: number; // 1-5
  type: RiasecType; // 'R', 'I', 'A', 'S', 'E', atau 'C'
};

export default function TestEngine() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const router = useRouter(); // Sekarang kita akan pakai ini

  const totalQuestions = riasecQuestions.length;
  const currentQuestion = riasecQuestions[currentQuestionIndex];

  const handleAnswer = (value: number) => {
    // 1. Simpan jawaban lengkap (termasuk tipe RIASEC-nya)
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: value,
      type: currentQuestion.type,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers); // ESLint warning untuk 'setAnswers' akan hilang

    // 2. Cek apakah tes sudah selesai
    if (currentQuestionIndex < totalQuestions - 1) {
      // Belum selesai, maju ke pertanyaan berikutnya
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 3. Tes Selesai! Lakukan kalkulasi dan navigasi
      calculateAndNavigate(updatedAnswers);
    }
  };

  const calculateAndNavigate = (finalAnswers: Answer[]) => {
    // Inisialisasi skor untuk setiap tipe
    const scores: { [key in RiasecType]: number } = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };

    // Akumulasi skor dari setiap jawaban
    finalAnswers.forEach(answer => {
      scores[answer.type] += answer.value;
    });

    console.log('Final Scores:', scores); // Untuk debugging

    // Ubah skor menjadi format yang bisa dikirim via URL
    // Contoh: "R=15&I=20&A=10..."
    const queryParams = new URLSearchParams(
        Object.entries(scores).map(([key, value]) => [key, value.toString()])
    ).toString();

    // Arahkan ke halaman hasil dengan membawa data skor di URL
    // ESLint warning untuk 'router' akan hilang
    router.push(`/hasil?${queryParams}`);
  };

  // ... (JSX untuk UI tetap sama)
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 1. Tambahkan Instruksi di sini */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-8" role="alert">
        <p className="font-bold">Instruksi</p>
        <p>Bacalah setiap pernyataan dan pilih sejauh mana pernyataan tersebut menggambarkan dirimu. Tidak ada jawaban benar atau salah.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Progress Bar & Counter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">Progress Tes</span>
            <span className="text-sm font-medium text-slate-500">
              Pertanyaan {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${((currentQuestionIndex) / (totalQuestions -1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="text-center mb-8 min-h-[100px] flex items-center justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Pilihan Jawaban (Refactored) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Sangat Tidak Setuju', value: 1, color: 'red' },
            { label: 'Tidak Setuju', value: 2, color: 'orange' },
            { label: 'Netral', value: 3, color: 'gray' },
            { label: 'Setuju', value: 4, color: 'green' },
            { label: 'Sangat Setuju', value: 5, color: 'blue' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              // 2. Styling tombol yang lebih rapi dan konsisten
              className={`
                p-3 border-2 border-slate-300 rounded-lg text-sm font-semibold text-slate-700
                transition-all duration-200 ease-in-out
                transform hover:scale-105 hover:shadow-md focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                hover:border-${option.color}-400 hover:bg-${option.color}-50
                // Untuk tombol 'Netral', kita buat sedikit beda
                ${option.value === 3 ? 'col-span-2 sm:col-span-1' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}