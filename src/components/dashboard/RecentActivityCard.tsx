import HistoryComponent from "@/app/[locale]/history/History";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {};

const RecentActivityCard = async (props: Props) => {
  const t = await getTranslations("RecentActivityCard");
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">{t("title")}</Link>
        </CardTitle>
        <CardDescription>
          {t("description", { count: games_count })}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-y-scroll">
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
