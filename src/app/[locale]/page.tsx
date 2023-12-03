import SignInButton from '@/components/SignInButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getAuthSession();
  const t = await getTranslations('Login');
  if (session?.user) {
    return redirect('/dashboard');
  }

  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card className='min-w-[300px]'>
        <CardHeader>
          <CardTitle className='mb-5 text-xl'>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className=''>
          <SignInButton text={t('loginButton')} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
