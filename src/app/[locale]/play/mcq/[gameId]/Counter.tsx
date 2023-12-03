import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

type Props = {
  correct: number;
  wrong: number;
};

const MCQCounter = ({ correct, wrong }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2 color="green" size={30} />
      <span className="mx-3 text-2xl text-[green]">{correct}</span>

      <Separator orientation="vertical" />

      <span className="mx-3 text-2xl text-[red]">{wrong}</span>
      <XCircle color="red" size={30} />
    </Card>
  );
};

export default MCQCounter;
