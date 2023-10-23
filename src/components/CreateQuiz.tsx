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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

export const CreateQuiz = (props: Props) => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ amount, type, topic }: Input) => {
      const response = await axios.post('api/game', {
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
      topic: '',
      type: 'open_ended',
    },
  });
  const onSubmit = (data: Input) => {
    console.log(JSON.stringify(data, null, 2));
    mutate(
      {
        amount: data.amount,
        type: data.type,
        topic: data.topic,
      },
      {
        onSuccess: ({ gameId }) => {
          const type = form.getValues('type');
          if (type === 'mcq') {
            router.push(`/play/mcq/${gameId}`);
          } else if (type === 'open_ended') {
            router.push(`/play/open-ended/${gameId}`);
          }
        },
      }
    );
  };

  form.watch();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">建立一個測驗</CardTitle>
          <CardDescription>選擇一個主題</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>主題</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入一個主題" {...field} />
                    </FormControl>
                    <FormDescription>請填寫一個主題</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>測驗總數</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="輸入總數"
                        {...field}
                        min={1}
                        max={10}
                        type="number"
                        onChange={(e) =>
                          form.setValue('amount', parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => form.setValue('type', 'mcq')}
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> 多選題
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue('type', 'open_ended')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  申論題
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                提交
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
