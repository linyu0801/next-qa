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
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getAuthSession();
  if (session?.user) {
    return redirect('/dashboard');
  }
  return (
    <div className="absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Qa</CardTitle>
          <CardDescription>
            CardDescriptionCardDescriptionCardDescription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="透過 Google 登入" />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
