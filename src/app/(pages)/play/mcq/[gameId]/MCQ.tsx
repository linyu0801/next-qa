'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Game, Question } from '@prisma/client';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import Link from 'next/link';
import Counter from './Counter';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
};

const MCQ = ({ game }: Props) => {
  const { toast } = useToast();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [now, setNow] = useState(new Date());

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post('/api/checkAnswer', payload);
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
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({ ...stats, correct: stats.correct + 1 }));
          toast({
            title: 'Correct',
            description: 'You got it right!',
            variant: 'success',
          });
        } else {
          setStats((stats) => ({ ...stats, wrong: stats.wrong + 1 }));
          toast({
            title: 'Incorrect',
            description: 'You got it wrong!',
            variant: 'destructive',
          });
        }
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, endGame, isChecking]);

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
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
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
        <Counter correct={stats.correct} wrong={stats.wrong} />
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
        {options.map((option, index) => (
          <Button
            key={option}
            variant={selectedChoice === index ? 'default' : 'outline'}
            className="justify-start w-full py-8 mb-4"
            onClick={() => setSelectedChoice(index)}
          >
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
              <div className="text-start">{option}</div>
            </div>
          </Button>
        ))}
        <Button
          variant="default"
          className="mt-2"
          size="lg"
          disabled={isChecking || hasEnded}
          onClick={() => handleNext()}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          下一題 <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
