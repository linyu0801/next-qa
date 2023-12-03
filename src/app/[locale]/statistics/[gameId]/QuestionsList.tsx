"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@prisma/client";

type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
  const gameType = questions[0].questionType;
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>問題 & 正確答案</TableHead>
          <TableHead>你的答案</TableHead>

          {gameType === "open_ended" && (
            <TableHead className="w-[10px] text-right whitespace-nowrap">
              準確度
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question, index) => (
          <TableRow key={question.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {question.question} <br />
              <br />
              <span className="font-semibold">{question.answer}</span>
            </TableCell>
            {gameType === "open_ended" && (
              <TableCell className="font-semibold">
                {question.userAnswer}
              </TableCell>
            )}
            {gameType === "mcq" && (
              <TableCell
                className={`${
                  question.isCorrect ? "text-green-600" : "text-red-600"
                } font-semibold`}
              >
                {question.userAnswer}
              </TableCell>
            )}

            {!!question.percentageCorrect && (
              <TableCell className="text-center">
                {question.percentageCorrect}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
