"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  const t = useTranslations("HistoryCard");
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <History size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
