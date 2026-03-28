"use client";
import { motion } from "motion/react";
import { FeatureBentoGrid } from "./_components/FeatureBentoGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 block xl:hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat overflow-hidden "
          style={{
            backgroundImage: "url('/parth.gautam.banner.jpeg')",
            // transform: "scale(1.1)",
            backgroundPosition: 'center'
          }}
        />
      </div>
      <div className="fixed inset-0 -z-10 hidden xl:block">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: "url('/parth-gautam-umesh-gautam.png')",
            transform: "scale(1.1)",
            backgroundPosition: 'center 20px'
          }}
        />
      </div>
      {/* Black overlay for mobile readability, white for desktop */}
      <div className="fixed inset-0 -z-10 bg-black/60 md:bg-white/40 xl:bg-white/20 dark:bg-black/70 dark:md:bg-black/40 dark:xl:bg-black/20" />

      <Navbar />
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-3xl lg:text-6xl mt-12 pb-4">
          {" Empower Students with AI Learning Voice Assistants..."
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(0px)", y: 0 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className={`mr-2 inline-block font-extrabold ${index < 6 ? "text-white md:text-slate-950 dark:text-white" : "text-[#FF6600]"
                  }`}
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-semibold text-white md:text-slate-900 dark:text-neutral-200 md:text-xl drop-shadow-lg"
        >
          24/7 AI-powered study assistance for students. Clarify concepts, revise subjects, practice exams, and learn confidently with voice-based AI tutors.
        </motion.p>
        <Link href={'/dashboard'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >

            <button className="w-60 transform rounded-lg bg-[#ff6600] px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e65c00] dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>

          </motion.div>
        </Link>
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://www.verloop.io/wp-content/uploads/vl-home-hero-img-alt-updated.jpg"
              alt="AI School Teacher Demo"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div> */}
      </div>
      {/* <FeatureBentoGrid /> */}
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between px-4 md:px-10 py-2 dark:border-neutral-800 sticky top-0 z-50 bg-white/10">
      <div className="flex items-center gap-2">
        <Link href={'/'}>
          <Image src={'/logo-saffron.svg'} alt='logo' width={140} height={16} className="md:w-[160px]" />
        </Link>
      </div>
      {!user ?
        <Link href={'/dashboard'}>
          <button className="w-24 transform rounded-lg bg-[#ff6600] px-4 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e65c00] md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button></Link> :
        <div className="flex gap-2 md:gap-5 items-center">
          <UserButton />
          <Link href={'/dashboard'}>
            <Button className='bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 md:px-4 text-sm md:text-base'>Dashboard</Button>
          </Link>
        </div>
      }
    </nav>
  );
};
