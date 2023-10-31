import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import axios from 'axios';
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: '尚未登入',
        },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    await prisma.topicCount.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      topic,
      type,
      amount,
    });
    if (type === 'mcq') {
      // api 回傳答案跟選項放在一起
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        // 隨機排序選項
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options), // 與 prisma 設定為 JSON 格式相符
          gameId: game.id,
          questionType: 'mcq',
        };
      });

      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === 'open_ended') {
      type openQuestion = {
        question: string;
        answer: string;
      };
      await prisma.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: 'open_ended',
          };
        }),
      });
    }
    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    console.log(error);

    return NextResponse.json({ error: '發生錯誤' }, { status: 500 });
  }
}
