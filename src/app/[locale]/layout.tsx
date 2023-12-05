import PageLoader from '@/components/PageLoader';
import { Suspense } from 'react';
import NextIntlProvider from './NextIntlProvider';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};
export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    // notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <NextIntlProvider
        locale={locale}
        messages={messages}
        timeZone='Asia/Taipei'
        now={new Date()}
      >
        {children}
      </NextIntlProvider>
    </Suspense>
  );
}
