// src/components/results/FeedbackWidget.tsx

"use client";

import { useState } from 'react';
import { StarIcon, HeartIcon, MessageSquareIcon, SendIcon, CheckCircleIcon } from 'lucide-react';

interface FeedbackWidgetProps {
  userProfile: {
    personaName: string;
    topThree: string[];
  };
  topRecommendations: {
    majors: string[];
    careers: string[];
  };
}

interface FeedbackData {
  accuracy: number | null;
  satisfaction: number | null;
  mostInteresting: string;
  additionalComments: string;
}

export function FeedbackWidget({ userProfile, topRecommendations }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    accuracy: null,
    satisfaction: null,
    mostInteresting: '',
    additionalComments: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!feedback.accuracy || !feedback.satisfaction) {
      alert('Mohon berikan rating untuk akurasi dan kepuasan');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 🚀 REAL API CALL: Send to database
      const feedbackPayload = {
        userProfile,
        topRecommendations,
        feedback,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackPayload)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengirim feedback');
      }
      
      console.log('✅ Feedback saved successfully:', result);
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number | null; 
    onChange: (rating: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none transition-colors"
          >
            <StarIcon
              className={`h-6 w-6 ${
                value && rating <= value
                  ? 'text-yellow-400 fill-current'
                  : 'text-slate-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        {value ? `${value}/5 - ${getRatingLabel(value)}` : 'Pilih rating 1-5'}
      </p>
    </div>
  );
  
  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Sangat Tidak Akurat',
      2: 'Kurang Akurat', 
      3: 'Cukup Akurat',
      4: 'Akurat',
      5: 'Sangat Akurat'
    };
    return labels[rating as keyof typeof labels];
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-lg font-bold text-green-800">Terima Kasih! 🙏</h3>
            <p className="text-green-700">Feedback-mu sangat berharga untuk improve sistem ini.</p>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-700">
            💡 <strong>Keep exploring!</strong> Sistem ini akan terus belajar dari feedback siswa sepertimu 
            untuk memberikan rekomendasi yang semakin akurat.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <HeartIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Bantu Kami Improve! 💪</h3>
          <p className="text-slate-600">Feedback-mu akan membantu siswa lain mendapat rekomendasi yang lebih akurat</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Accuracy Rating */}
        <StarRating
          value={feedback.accuracy}
          onChange={(rating) => setFeedback(prev => ({ ...prev, accuracy: rating }))}
          label="Seberapa akurat rekomendasi ini dengan minat dan kepribadianmu?"
        />
        
        {/* Satisfaction Rating */}
        <StarRating
          value={feedback.satisfaction}
          onChange={(rating) => setFeedback(prev => ({ ...prev, satisfaction: rating }))}
          label="Seberapa puas kamu dengan hasil analisis ini?"
        />
        
        {/* Most Interesting Option */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Dari semua rekomendasi, mana yang paling menarik buatmu?
          </label>
          <select
            value={feedback.mostInteresting}
            onChange={(e) => setFeedback(prev => ({ ...prev, mostInteresting: e.target.value }))}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih salah satu...</option>
            <optgroup label="Jurusan Kuliah">
              {topRecommendations.majors.slice(0, 5).map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </optgroup>
            <optgroup label="Kelompok Karier">
              {topRecommendations.careers.slice(0, 5).map(career => (
                <option key={career} value={career}>{career}</option>
              ))}
            </optgroup>
            <option value="none">Tidak ada yang menarik</option>
            <option value="other">Lainnya (tulis di komentar)</option>
          </select>
        </div>
        
        {/* Additional Comments */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Ada saran, kritik, atau jurusan impian yang tidak muncul?
          </label>
          <div className="relative">
            <MessageSquareIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <textarea
              value={feedback.additionalComments}
              onChange={(e) => setFeedback(prev => ({ ...prev, additionalComments: e.target.value }))}
              placeholder="Tuliskan feedback, saran, atau jurusan yang kamu inginkan..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !feedback.accuracy || !feedback.satisfaction}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <SendIcon className="h-5 w-5" />
              <span>Kirim Feedback</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-slate-500 text-center">
          Data ini akan digunakan untuk improve sistem dan tidak akan dibagikan untuk tujuan komersial
        </p>
      </div>
    </div>
  );
}