"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, HelpCircle, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const DetailsDialog = (props: Props) => {
  const t = useTranslations("Dashboard");
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex items-center px-2 py-1 text-white rounded-md bg-slate-800">
          {t("introButton")}
          <HelpCircle className="w-5 h-5 ml-1" />
        </span>
      </DialogTrigger>
      <DialogContent className="w-4/5 min-w-fit max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("intro.title")}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-3 my-2">
              <p className="flex items-center">
                <Github className="w-5 h-5" />
                <Link
                  className="ml-1 underline"
                  href="https://github.com/elliott-chong/quizmify"
                >
                  GitHub
                </Link>
              </p>
              <p className="flex items-center">
                <Youtube className="w-5 h-5" />
                <Link
                  className="ml-1 underline"
                  href="https://youtube.com/@elliottchong"
                >
                  YouTube
                </Link>
              </p>
            </div>
            <p className="my-2 mt-4 ">{t("intro.description")}</p>
            <hr />
            <div className="my-2 font-semibold">
              <h4 className="text-base font-semibold text-left">
                {t("intro.content")}
              </h4>
              <div className="text-left justify-center sm:justify-normal md:text-center grid md:justify-items-center items-center grid-cols-[50px,auto] sm:grid-cols-[repeat(2,30px_auto)] md:grid-cols-[repeat(8,minmax(30px,auto))] mt-2 gap-y-3 gap-x-2.5">
                <Image
                  alt="planetscale"
                  src="/planetscale.png"
                  width={35}
                  height={35}
                />
                <span className="">Planet Scale</span>

                <Image alt="nextjs" src="/nextjs.png" width={35} height={35} />
                <span className="">Next.js</span>

                <Image
                  alt="tailwind"
                  src="/tailwind.png"
                  width={35}
                  height={35}
                />
                <span className="">Tailwind</span>

                <Image
                  alt="nextauth"
                  src="/nextauth.png"
                  width={30}
                  height={30}
                />
                <span className="">NextAuth</span>

                <Image alt="openai" src="/openai.png" width={30} height={30} />
                <span className="">OpenAI</span>

                <Image
                  alt="react query"
                  src="/react-query.png"
                  width={30}
                  height={30}
                />
                <span className="">React Query</span>

                <Image alt="primsa" src="/prisma.png" width={30} height={30} />
                <span className="">Prisma</span>

                <Image
                  alt="typescript"
                  src="/typescript.png"
                  width={30}
                  height={30}
                />
                <span className="">TypeScript</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
