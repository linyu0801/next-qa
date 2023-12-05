import { Loader2 } from 'lucide-react';

type Props = {};

const PageLoader = (props: Props) => {
  return (
    <div className='flex min-h-screen items-center justify-center opacity-30'>
      <Loader2 className='h-10 w-10 animate-spin' />
    </div>
  );
};

export default PageLoader;
