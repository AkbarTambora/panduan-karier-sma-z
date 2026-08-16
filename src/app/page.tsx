// src/app/page.tsx
// Halaman Utama: Menampilkan MemberDashboard jika login, GuestDashboard jika tamu

import { auth } from '@/auth';
import { GuestDashboard } from '@/components/dashboard/GuestDashboard';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    return <MemberDashboard user={session.user} />;
  }

  return <GuestDashboard />;
}