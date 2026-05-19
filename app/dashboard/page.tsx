import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserLinks } from '@/data/links';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const links = await getUserLinks(userId);

  return <DashboardContent links={links} />;
}
