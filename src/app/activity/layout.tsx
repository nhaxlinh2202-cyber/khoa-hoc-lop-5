"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Home, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const STEPS = [
  { path: '/activity/hd1', label: 'CHẶNG 1' },
  { path: '/activity/hd2', label: 'CHẶNG 2' },
  { path: '/activity/hd3', label: 'CHẶNG 3' },
  { path: '/activity/hd4', label: 'CHẶNG 4' },
  { path: '/activity/assessment', label: 'CHẶNG 5' },
];

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsTeacher(data.user.role === 'teacher');
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/'));
  }, [router]);

  const currentIndex = STEPS.findIndex((step) => step.path === pathname);
  const prevStep = currentIndex > 0 ? STEPS[currentIndex - 1] : null;
  const nextStep = currentIndex >= 0 && currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;

  const handleNext = () => {
    if (!nextStep) return;
    const lockedPaths = ['/activity/hd2', '/activity/hd3', '/activity/hd4'];
    if (lockedPaths.includes(nextStep.path) && !isTeacher) {
      alert("Hoạt động này tạm khóa. Chỉ Giáo viên mới có quyền mở khóa!");
      return;
    }
    router.push(nextStep.path);
  };

  return (
    <>
      {/* MAIN CONTENT (No padding or scrolling forced by layout) */}
      <main className="w-full h-full relative font-sans">
        {children}
      </main>

      {/* FLOATING NAVIGATION (Pins exactly to the corners without a white bar) */}
      <div className="fixed bottom-4 left-4 right-4 z-[900] pointer-events-none flex items-end justify-between">
        
        {/* Left: Home */}
        <div className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/home')}
            className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_#000000] text-black hover:bg-white opacity-80 transition-opacity"
            title="Về Trang Chủ"
          >
            <Home className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Right: Next & Prev */}
        <div className="flex gap-2 sm:gap-4 pointer-events-auto">
          {prevStep && (
            <motion.button
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(prevStep.path)}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 backdrop-blur-sm border-[3px] border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_#000000] text-black font-black text-sm sm:text-base uppercase hover:bg-white opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> QUAY LẠI
            </motion.button>
          )}

          {nextStep && (
            <motion.button
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-[#00FF00]/90 backdrop-blur-sm border-[3px] border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_#000000] text-black font-black text-sm sm:text-base uppercase hover:bg-[#00FF00] opacity-80 transition-opacity"
            >
              <span className="hidden sm:inline">TIẾP: {nextStep.label}</span>
              <span className="sm:hidden">TIẾP THEO</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          )}
        </div>

      </div>
    </>
  );
}
