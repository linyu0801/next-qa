import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z.string().min(4, { message: "topic 最少需要四個字" }).max(50),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});
