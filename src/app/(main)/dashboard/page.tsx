// src/app/(main)/dashboard/page.tsx

import { auth } from '@/auth';
import { GuestDashboard } from '@/components/dashboard/GuestDashboard';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user?.id) {
    return <MemberDashboard user={session.user} />;
  }

  return <GuestDashboard />;
}