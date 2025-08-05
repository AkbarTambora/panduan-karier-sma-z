// src/components/TestEngine.tsx
"use client";

// Impor 'useEffect' dan 'useMemo' dari React ---
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { riasecQuestions, RiasecType } from "@/data/riasecQuestions";

// Ubah struktur state 'answers' menjadi Map ---
// Menggunakan Map lebih efisien untuk update dan lookup by key (questionId)
type AnswerMap = Map<number, { value: number; type: RiasecType }>;

// Buat fungsi untuk mengacak array (Fisher-Yates shuffle algorithm) ---
// Tempatkan fungsi ini di luar komponen agar tidak dibuat ulang setiap render.
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elemen
  }
  return newArray;
};

export default function TestEngine() {
  const shuffledQuestions = useMemo(() => shuffleArray(riasecQuestions), []);


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Gunakan Map untuk menyimpan jawaban. Key: questionId, Value: { value, type }
  const [answers, setAnswers] = useState<AnswerMap>(new Map());
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  // Gunakan array yang sudah diacak ---
  const totalQuestions = shuffledQuestions.length;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Modifikasi handleAnswer untuk mengupdate Map ---
  const handleAnswer = (value: number) => {
    // Buat salinan Map untuk menjaga immutability
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      value: value,
      type: currentQuestion.type,
    });
    setAnswers(newAnswers);
  };
  
  // Buat fungsi navigasi terpisah ---
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Jika ini adalah pertanyaan terakhir, set isFinished
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  const calculateAndNavigate = () => {
    const scores: { [key in RiasecType]: number } = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    // Iterasi melalui Map answers untuk kalkulasi
    answers.forEach((answer) => {
      scores[answer.type] += answer.value;
    });

    const queryParams = new URLSearchParams(
      Object.entries(scores).map(([key, value]) => [key, value.toString()])
    ).toString();
    
    router.push(`/hasil?${queryParams}`);
  };

  const colorClasses = {
    red: {
      hover: 'hover:border-red-400 hover:bg-red-50',
      active: 'border-red-500 bg-red-100 ring-2 ring-red-400'
    },
    orange: {
      hover: 'hover:border-orange-400 hover:bg-orange-50',
      active: 'border-orange-500 bg-orange-100 ring-2 ring-orange-400'
    },
    gray: {
      hover: 'hover:border-gray-400 hover:bg-gray-50',
      active: 'border-gray-500 bg-gray-100 ring-2 ring-gray-400'
    },
    green: {
      hover: 'hover:border-green-400 hover:bg-green-50',
      active: 'border-green-500 bg-green-100 ring-2 ring-green-400'
    },
    blue: {
      hover: 'hover:border-blue-400 hover:bg-blue-50',
      active: 'border-blue-500 bg-blue-100 ring-2 ring-blue-400'
    },
  };

  // Helper untuk mengecek apakah pertanyaan saat ini sudah dijawab ---
  const isCurrentQuestionAnswered = answers.has(currentQuestion?.id);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isFinished && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Instruksi</p>
          <p>Bacalah setiap pernyataan dan pilih sejauh mana pernyataan tersebut menggambarkan dirimu. Tidak ada jawaban benar atau salah.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[450px] flex flex-col justify-between">
        {isFinished ? (
          <div className="text-center transition-opacity duration-500 flex flex-col justify-center items-center h-full">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Tes Selesai!</h2>
            <p className="mt-2 text-slate-600">Kamu telah berhasil menyelesaikan semua pertanyaan. Klik tombol di bawah untuk melihat hasil analisismu.</p>
            <button
              onClick={calculateAndNavigate}
              className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Lihat Hasil Analisis
            </button>
          </div>
        ) : (
          <>
            <div>
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
                    // Kalkulasi progress berdasarkan ukuran Map ---
                    style={{ width: `${(answers.size / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Pertanyaan */}
              <div className="text-center mb-8 min-h-[100px] flex items-center justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Pilihan Jawaban */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { label: "Sangat Tidak Setuju", value: 1, color: "red" },
                  { label: "Tidak Setuju", value: 2, color: "orange" },
                  { label: "Netral", value: 3, color: "gray" },
                  { label: "Setuju", value: 4, color: "green" },
                  { label: "Sangat Setuju", value: 5, color: "blue" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    // Styling untuk jawaban yang sudah dipilih ---
                    className={`
                      p-3 border-2 rounded-lg text-sm font-semibold text-slate-700
                      transition-all duration-200 ease-in-out
                      transform hover:scale-105 hover:shadow-md focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${option.value === 3 ? "sm:col-span-1" : ""}
                      ${colorClasses[option.color as keyof typeof colorClasses].hover}
                      ${answers.get(currentQuestion.id)?.value === option.value
                        ? colorClasses[option.color as keyof typeof colorClasses].active
                        : "border-slate-300"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tambahkan Tombol Navigasi Back & Next --- */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}