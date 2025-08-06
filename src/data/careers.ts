// src/data/careers.ts

// Import dari majors.ts yang sekarang sudah mengekspor tipe yang benar
import type { RiasecScoreProfile } from './majors';
import type { ObjectId } from 'mongodb';

export interface Career {
  _id?: ObjectId; // Tambahkan ini, '?' berarti opsional
  id: string;
  name: string;
  description: string;
  riasecProfile: RiasecScoreProfile;
}
