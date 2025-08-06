// src/data/majors.ts

import type { RiasecType } from './riasecQuestions';
import type { ObjectId } from 'mongodb';

// Menggunakan skala 1-10 untuk mempermudah pembobotan
// Export tipe ini agar bisa digunakan di file lain
export type RiasecScoreProfile = { [key in RiasecType]: number };

export interface Major {
  _id?: ObjectId; // Tambahkan ini, '?' berarti opsional
  id: string;
  name: string;
  description: string;
  riasecProfile: RiasecScoreProfile;
}