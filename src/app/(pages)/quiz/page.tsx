import { CreateQuiz } from '@/components/CreateQuiz';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};
export const metadata = {
  title: 'Quiz | Quizmify',
};
const QuizPage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/');
  }
  return <CreateQuiz />;
};
export default QuizPage;
