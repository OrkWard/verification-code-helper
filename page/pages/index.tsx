import { Inter } from "next/font/google";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  code,
  mtime,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const typography =
    "font-sans antialiased leading-relaxed text-inherit text-lg";

  return (
    <>
      <Head>
        <title>验证码是多少！？</title>
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
      >
        <div className="relative flex flex-col place-items-center before:absolute before:-z-10 before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40">
          <p className={`${typography}`}>上次获取时间：{mtime}</p>
          <p className={`${typography}`}>验证码：{code}</p>
        </div>
      </main>
    </>
  );
}

interface Code {
  code: string;
  mtime: string;
}

async function getCode() {
  if (!process.env.BACKEND_URL) {
    throw new Error("没有找到 bot 服务");
  }

  const res = await fetch(`${process.env.BACKEND_URL}`);

  return await (res.json() as Promise<Code>);
}

export const getServerSideProps = (async () => {
  return { props: await getCode() };
}) satisfies GetServerSideProps<Code>;
