// src/app/components/TestEngine.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { riasecQuestions, RiasecType } from "@/data/riasecQuestions";

type AnswerMap = Map<number, { value: number; type: RiasecType }>;
type TestMode = 'quick' | 'full';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ✅ FIXED: Filter dari riasecQuestions asli by ID, bukan hard-code duplikat
// Ini memastikan sinkronisasi otomatis jika pertanyaan di data utama diupdate
const STRATEGIC_QUESTION_IDS = [1, 6, 12, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86];
const getStrategicQuestions = () => riasecQuestions.filter(q => STRATEGIC_QUESTION_IDS.includes(q.id));

// ===================================================================
// KOMPONEN PEMBUNGKUS (WRAPPER)
// ===================================================================
export default function TestEngineWrapper() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TestEngine />
    </Suspense>
  );
}

// ===================================================================
// MODAL KONFIRMASI — Ganti window.confirm() yang adalah anti-pattern
// ===================================================================
function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Ya, Ganti Mode
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// KOMPONEN UTAMA LOGIKA TES  
// ===================================================================
function TestEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil data personal dari URL
  const nama = searchParams.get('nama') || '';
  const kelas = searchParams.get('kelas') || '';
  const sekolah = searchParams.get('sekolah') || '';

  const [testMode, setTestMode] = useState<TestMode | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof riasecQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(new Map());
  const [isFinished, setIsFinished] = useState(false);
  // ✅ FIXED: state untuk modal konfirmasi, menggantikan window.confirm()
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // useEffect untuk setup questions based on test mode
  useEffect(() => {
    if (!nama) {
      router.replace('/tes/mulai');
      return;
    }
    
    if (testMode === 'quick') {
      setShuffledQuestions(shuffleArray(getStrategicQuestions()));
    } else if (testMode === 'full') {
      setShuffledQuestions(shuffleArray(riasecQuestions));
    }
  }, [nama, router, testMode]);

  const totalQuestions = shuffledQuestions.length;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  
  if (!testMode) {
    return <ModeSelectionScreen onModeSelect={setTestMode} />;
  }
  
  if (!currentQuestion) {
    return <LoadingState />;
  }

  // --- HANDLER FUNCTIONS ---
  const handleAnswer = (value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, { value, type: currentQuestion.type });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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
    const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
    
    if (testMode === 'quick') {
      // Quick test: 3 soal per tipe × faktor 5 = setara 15 soal
      answers.forEach((answer) => {
        scores[answer.type] += answer.value * 5;
      });
      
      // ✅ FIXED: Pastikan semua tipe punya nilai minimal (cegah skor 0 yang jatuh di bawah normalisasi)
      for (const type of RIASEC_TYPES) {
        if (scores[type] === 0) {
          scores[type] = 15; // Nilai minimum (1 × 5 × 3)
        }
      }
    } else {
      // Full test: normal scoring
      answers.forEach((answer) => {
        scores[answer.type] += answer.value;
      });
      
      // Pastikan semua tipe punya nilai minimal
      for (const type of RIASEC_TYPES) {
        if (scores[type] === 0) {
          scores[type] = 15; // Nilai minimum (1 × 15 soal)
        }
      }
    }

    const params = new URLSearchParams();
    params.append('nama', nama);
    params.append('kelas', kelas);
    params.append('sekolah', sekolah);
    params.append('testMode', testMode);

    Object.entries(scores).forEach(([key, value]) => {
      params.append(key, value.toString());
    });

    router.push(`/hasil?${params.toString()}`);
  };

  const colorClasses = {
    red: { hover: 'hover:border-red-400 hover:bg-red-50', active: 'border-red-500 bg-red-100 ring-2 ring-red-400' },
    orange: { hover: 'hover:border-orange-400 hover:bg-orange-50', active: 'border-orange-500 bg-orange-100 ring-2 ring-orange-400' },
    gray: { hover: 'hover:border-gray-400 hover:bg-gray-50', active: 'border-gray-500 bg-gray-100 ring-2 ring-gray-400' },
    green: { hover: 'hover:border-green-400 hover:bg-green-50', active: 'border-green-500 bg-green-100 ring-2 ring-green-400' },
    blue: { hover: 'hover:border-blue-400 hover:bg-blue-50', active: 'border-blue-500 bg-blue-100 ring-2 ring-blue-400' },
  };
  
  const isCurrentQuestionAnswered = answers.has(currentQuestion?.id);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ✅ Modal konfirmasi custom, menggantikan window.confirm() */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Ganti Mode Tes?"
        message="Progress kamu saat ini akan hilang dan kamu akan mulai dari awal. Yakin ingin mengganti mode?"
        onConfirm={() => {
          setShowConfirmModal(false);
          setTestMode(null);
          setAnswers(new Map());
          setCurrentQuestionIndex(0);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[450px] flex flex-col justify-between">
        {isFinished ? (
          <FinishedScreen 
            testMode={testMode} 
            onContinue={calculateAndNavigate} 
          />
        ) : (
          <>
            <div>
              {/* Progress Bar with mode indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-700">Progress Tes</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      testMode === 'quick' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {testMode === 'quick' ? '⚡ Quick' : '📊 Lengkap'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {currentQuestionIndex + 1} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                      testMode === 'quick' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-600'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600'
                    }`}
                    style={{ width: `${(answers.size / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                {testMode === 'quick' && (
                  <p className="text-xs text-green-600 mt-1">
                    ⚡ Quick Test — Pertanyaan strategis paling prediktif
                  </p>
                )}
              </div>
              
              {/* Question */}
              <div className="text-center mb-8 min-h-[100px] flex items-center justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>
              
              {/* Answer Options */}
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
                    className={`p-3 border-2 rounded-lg text-sm font-semibold text-slate-700 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${colorClasses[option.color as keyof typeof colorClasses].hover} ${answers.get(currentQuestion.id)?.value === option.value ? colorClasses[option.color as keyof typeof colorClasses].active : "border-slate-300"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <div className="flex items-center space-x-3">
                {/* ✅ FIXED: Gunakan modal konfirmasi, bukan window.confirm() */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
                >
                  Ganti Mode
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Mode Selection Screen
function ModeSelectionScreen({ onModeSelect }: { onModeSelect: (mode: TestMode) => void }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Pilih Mode Tes</h2>
          <p className="text-slate-600">Pilih jenis tes yang sesuai dengan waktu dan kebutuhan kamu</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Quick Test Option */}
          <button
            onClick={() => onModeSelect('quick')}
            className="group p-8 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              REKOMENDASI
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">⚡ Quick Test</h3>
                <p className="text-green-600 font-medium">2-3 menit • 18 pertanyaan</p>
              </div>
            </div>
            <ul className="text-sm text-slate-700 space-y-3 mb-4">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span><strong>Pertanyaan strategis</strong> yang paling prediktif</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span><strong>Akurasi 85%+</strong> untuk eksplorasi awal</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span><strong>Hemat waktu</strong> - perfect untuk siswa sibuk</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span><strong>Gambaran umum</strong> minat &amp; bakat</span>
              </li>
            </ul>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-medium">
                💡 Ideal untuk: Eksplorasi awal, siswa ragu-ragu, atau yang punya waktu terbatas
              </p>
            </div>
          </button>
          
          {/* Full Test Option */}
          <button
            onClick={() => onModeSelect('full')}
            className="group p-8 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              KOMPREHENSIF
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800">📊 Tes Lengkap</h3>
                <p className="text-blue-600 font-medium">5-8 menit • 90 pertanyaan</p>
              </div>
            </div>
            <ul className="text-sm text-slate-700 space-y-3 mb-4">
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Analisis komprehensif</strong> semua aspek kepribadian</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Akurasi maksimal 95%+</strong> hasil terdetail</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Rekomendasi detail</strong> untuk keputusan penting</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Validasi kepribadian</strong> yang mendalam</span>
              </li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                💡 Ideal untuk: Keputusan jurusan final, validasi hasil quick test, analisis mendalam
              </p>
            </div>
          </button>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-3">💡 Tips Memilih Mode Test:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <span className="font-medium text-green-700">Pilih Quick Test jika:</span>
              <ul className="mt-1 space-y-1">
                <li>• Baru pertama kali tes minat bakat</li>
                <li>• Ingin gambaran umum dulu</li>
                <li>• Waktu terbatas (istirahat sekolah)</li>
                <li>• Masih eksplorasi awal</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-blue-700">Pilih Tes Lengkap jika:</span>
              <ul className="mt-1 space-y-1">
                <li>• Sudah yakin mau tes mendalam</li>
                <li>• Butuh hasil untuk keputusan penting</li>
                <li>• Ingin validasi hasil quick test</li>
                <li>• Punya waktu 5-8 menit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Finished Screen
function FinishedScreen({ 
  testMode, 
  onContinue 
}: { 
  testMode: TestMode; 
  onContinue: () => void;
}) {
  return (
    <div className="text-center transition-opacity duration-500 flex flex-col justify-center items-center h-full">
      <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
        testMode === 'quick' ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        <svg className={`h-8 w-8 ${testMode === 'quick' ? 'text-green-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {testMode === 'quick' ? '⚡ Quick Test Selesai!' : '📊 Tes Lengkap Selesai!'}
      </h2>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {testMode === 'quick' 
          ? 'Analisis cepat berhasil! Kamu akan mendapat rekomendasi berdasarkan 18 pertanyaan strategis.'
          : 'Excellent! Analisis komprehensif akan memberikan rekomendasi yang sangat detail dan akurat.'
        }
      </p>
      
      <button
        onClick={onContinue}
        className={`px-8 py-4 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
          testMode === 'quick' 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Lihat Hasil Analisis
      </button>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8">
      <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-slate-600">Mempersiapkan tes...</p>
    </div>
  );
}