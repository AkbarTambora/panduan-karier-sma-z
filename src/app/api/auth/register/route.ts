// src/app/api/auth/register/route.ts
// API untuk registrasi user baru

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, school, class: userClass } = body;

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    // Cek apakah email sudah terdaftar
    const existingUser = await db.collection('users').findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      school: school?.trim() || null,
      class: userClass?.trim() || null,
      isPublic: true, // Default profil publik
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    // Buat index untuk email (jika belum ada)
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil dibuat! Silakan login.',
      userId: result.insertedId.toString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    
    // Handle duplicate key error dari MongoDB
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
