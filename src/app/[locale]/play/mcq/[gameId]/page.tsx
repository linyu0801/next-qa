import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";
import MCQ from "./MCQ";

type Props = {
  params: {
    gameId: string;
  };
};

const McqPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        // 只回傳以下三個欄位
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default McqPage;
