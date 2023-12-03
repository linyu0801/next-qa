'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        signIn('google')
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
