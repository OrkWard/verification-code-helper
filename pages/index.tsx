import { Inter } from "next/font/google";
import fs from 'fs/promises'
import { GetStaticProps, InferGetStaticPropsType } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home({code, mtime}: InferGetStaticPropsType<typeof getStaticProps> ){
  const typography = 'font-sans  antialiased leading-relaxed text-inherit text-lg'

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <div className="relative flex flex-col place-items-center before:-z-10 before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <p className={`${typography}`}>上次获取时间：{mtime}</p>
        <p className={`${typography}`}>验证码：{code}</p>
      </div>
    </main>
  );
}

export const getStaticProps = (async () => {
  const code = await fs.readFile('/home/orkward/Repos/tg-verification-code-helper/dist/logs/messages.log', 'utf8');
  const {mtime} = await fs.stat('/home/orkward/Repos/tg-verification-code-helper/dist/logs/messages.log')
  return {props: {code, mtime: mtime.toLocaleString('zn-CN')}};
}) satisfies GetStaticProps<{code: string, mtime: string}>;

