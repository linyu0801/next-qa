import { getAuthSession } from '@/lib/nextauth';
import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import UserAccountNav from './UserAccountNav';
import ThemeToggle from './ThemeToggle';
import LanguageSelect from './LanguageSelect';

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();

  return (
    <div className='fixed inset-x-0 top-0 z-[10] h-fit w-full border-b border-zinc-300 bg-white  py-2 dark:bg-gray-950'>
      <div className='mx-auto flex h-full w-full items-center justify-between gap-2 px-4 sm:px-8   xl:max-w-7xl'>
        {/* Logo */}
        <Link href={'/dashboard'} className='flex items-center gap-2'>
          <span className='rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] dark:border-white md:block'>
            Quizmify
          </span>
        </Link>
        <div className='flex items-center gap-2 sm:gap-3'>
          <LanguageSelect />
          <ThemeToggle className='py-2' />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text='Sign In' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
