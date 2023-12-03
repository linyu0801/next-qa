import DetailsDialog from '@/components/DetailsDialog';
import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizMeCard from '@/components/dashboard/QuizCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { getAuthSession } from '@/lib/nextauth';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};

export const metadata: Metadata = {
  title: 'Dashboard | Quizmify',
  description: 'Quiz yourself on anything!',
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  const t = await getTranslations('Dashboard');
  if (!session?.user) {
    redirect('/');
  }
  return (
    <main className='mx-auto max-w-7xl px-4 py-8 sm:px-8'>
      <div className='flex items-center'>
        <h2 className='mr-2 text-3xl font-bold tracking-tight'>{t('title')}</h2>
        <DetailsDialog />
      </div>

      <div className='mt-4 grid gap-4 md:grid-cols-2'>
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
};

export default Dashboard;
