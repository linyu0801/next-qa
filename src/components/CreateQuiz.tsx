'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BookOpen, CopyCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Loading from './Loading';

type Props = { topicParams: string };

type Input = z.infer<typeof quizCreationSchema>;

export const CreateQuiz = ({ topicParams }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ amount, type, topic }: Input) => {
      const response = await axios.post('/api/game', {
        amount,
        type,
        topic,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParams,
      type: 'open_ended',
    },
  });
  const onSubmit = (data: Input) => {
    setShowLoader(true);
    mutate(
      {
        amount: data.amount,
        type: data.type,
        topic: data.topic,
      },
      {
        onSuccess: ({ gameId }) => {
          setIsFinished(true);
          const timer = setTimeout(() => {
            const type = form.getValues('type');
            if (type === 'mcq') {
              router.push(`/play/mcq/${gameId}`);
            } else if (type === 'open_ended') {
              router.push(`/play/open-ended/${gameId}`);
            }
            clearTimeout(timer);
          }, 1000);
        },
        onError: () => setShowLoader(false),
      }
    );
  };

  form.watch();

  if (showLoader) {
    return <Loading finished={isFinished} />;
  }

  return (
    <div className='absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4'>
      <Card className='mx-auto w-full max-w-[320px] sm:max-w-[400px]'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>建立一個測驗</CardTitle>
          <CardDescription>選擇一個主題</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='topic'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>主題</FormLabel>
                    <FormControl>
                      <Input placeholder='輸入一個主題' {...field} />
                    </FormControl>
                    <FormDescription>請填寫一個主題</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>測驗總數</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='輸入總數'
                        {...field}
                        min={1}
                        max={10}
                        type='number'
                        onChange={(e) =>
                          form.setValue('amount', parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button
                  type='button'
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                  className='w-1/2 rounded-none rounded-l-lg'
                  onClick={() => form.setValue('type', 'mcq')}
                >
                  <CopyCheck className='mr-2 h-4 w-4' /> 多選題
                </Button>
                <Separator orientation='vertical' />
                <Button
                  type='button'
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }
                  className='w-1/2 rounded-none rounded-r-lg'
                  onClick={() => form.setValue('type', 'open_ended')}
                >
                  <BookOpen className='mr-2 h-4 w-4' />
                  申論題
                </Button>
              </div>
              <Button disabled={isLoading} type='submit'>
                提交
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
