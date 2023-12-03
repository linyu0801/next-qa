import { CreateQuiz } from "@/components/CreateQuiz";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  searchParams: { topic?: string };
};
export const metadata: Metadata = {
  title: "Quiz | Quizmify",
  description: "Quiz yourself on anything!",
};
const QuizPage = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return <CreateQuiz topicParams={searchParams.topic || ""} />;
};
export default QuizPage;
