'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Game, Question } from '@prisma/client';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import AnswerInput from './AnswerInput';
import Link from 'next/link';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'answer' | 'question'>[] };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState<string>('');
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState(new Date());
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement[]>([]);
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      inputRef.current.forEach((input) => {
        filledAnswer = filledAnswer.replace('_____', input.value);
        input.value = '';
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: blankAnswer,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      // const payload: z.infer<typeof endGameSchema> = {
      //   gameId: game.id,
      // };
      // const response = await axios.post(`/api/endGame`, payload);
      // return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        console.log(123);

        toast({
          title: `您的答案與正確答案有 ${percentageSimilar} %相似`,
        });
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
      },
    });
  }, [
    checkAnswer,
    questionIndex,
    game.questions.length,
    endGame,
    isChecking,
    toast,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col text-white justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold  bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{' '}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: 'lg' }), 'mt-2')}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* 主題 */}
          <p>
            <span className="text-slate-400">主題</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <AnswerInput
          ref={inputRef}
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />

        <Button
          variant="outline"
          className="mt-4"
          disabled={isChecking || hasEnded}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          下一題 <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
