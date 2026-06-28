"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { LogOut, Play, Lock, Trophy, Star, Sparkles } from 'lucide-react';
import { AppleEmoji } from '../../components/shared/AppleEmoji';

const steps = [
  { id: 'hd1', progressKey: 'hd1', name: <>BÀI 1: LÀM SỮA CHUA <AppleEmoji symbol="🥣" /></>, path: '/activity/hd1', color: 'bg-[#FF0000]', emoji: <AppleEmoji symbol="🥛" /> },
  { id: 'hd2', progressKey: 'hd2', name: <>BÀI 2: CHẤM ĐIỂM <AppleEmoji symbol="⭐" /></>, path: '/activity/hd2', color: 'bg-[#FF00FF]', emoji: <AppleEmoji symbol="🏅" /> },
  { id: 'hd3', progressKey: 'hd3', name: <>BÀI 3: SOI VI KHUẨN <AppleEmoji symbol="🔬" /></>, path: '/activity/hd3', color: 'bg-[#00FF00]', emoji: <AppleEmoji symbol="🦠" /> },
  { id: 'hd4', progressKey: 'hd4', name: <>BÀI 4: CỨU HỘ <AppleEmoji symbol="🚑" /></>, path: '/activity/hd4', color: 'bg-[#FF8C00]', emoji: <AppleEmoji symbol="💡" /> },
  { id: 'assessment', progressKey: 'assessment', name: <>ÔN TẬP: TRÒ CHƠI <AppleEmoji symbol="🎮" /></>, path: '/activity/assessment', color: 'bg-[#00E5FF]', emoji: <AppleEmoji symbol="🎯" /> },
];

export default function HomePage() {
  const router = useRouter();
  
  const [isTeacher, setIsTeacher] = useState(false);
  const [studentName, setStudentName] = useState('Bé Yêu');
  const [progress, setProgress] = useState<Record<string, boolean>>({
    hd1: false, hd2: false, hd3: false, hd4: false, assessment: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, progressRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/progress')
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.authenticated) {
            setIsTeacher(meData.user.role === 'teacher');
            if (meData.user.role === 'student') setStudentName(meData.user.name);
          } else router.push('/');
        } else router.push('/');

        if (progressRes.ok) {
          const pData = await progressRes.json();
          if (pData.success && pData.progress?.completedSteps) {
            const completed = pData.progress.completedSteps as string[];
            setProgress({
              hd1: completed.includes('hd1'),
              hd2: completed.includes('hd2'),
              hd3: completed.includes('hd3'),
              hd4: completed.includes('hd4'),
              assessment: completed.includes('assessment'),
            });
          }
        }
      } catch (error) {
        console.error('Error loading data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.clear();
    router.push('/');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen w-full bg-[#FFFF00] font-display flex flex-col p-4 md:p-6 gap-4">
      
      {/* HEADER */}
      <header className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF0000] border-2 border-black flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-black text-2xl md:text-3xl text-black uppercase tracking-tight">KHOA HỌC 5</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="px-4 py-2 bg-black text-white font-black text-sm md:text-base uppercase rounded-xl flex items-center gap-2 border-2 border-black"
        >
          THOÁT <LogOut className="w-4 h-4" />
        </motion.button>
      </header>

      <main className="flex-1 flex flex-col gap-4">
        
        {/* WELCOME BANNER */}
        <section className="flex-none bg-[#00E5FF] rounded-[2rem] p-6 border-4 border-black shadow-[8px_8px_0px_0px_#FF00FF] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-2xl opacity-30 -mr-10 -mt-10 pointer-events-none" />
          
          <div className="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-inner shrink-0 z-10">
            <span className="text-5xl drop-shadow-md flex justify-center items-center"><AppleEmoji symbol="🚀" className="w-12 h-12" /></span>
          </div>

          <div className="flex-1 z-10 space-y-3 text-center md:text-left w-full">
            <h1 className="font-black text-3xl md:text-4xl text-black uppercase">
              CHÀO BẠN, <span className="text-[#FF0000]">{studentName}!</span>
            </h1>
            
            <div className="bg-white border-2 border-black rounded-full p-1.5 relative h-10 w-full max-w-xl mx-auto md:mx-0 shadow-inner">
              <div 
                className="h-full bg-[#00FF00] border-r-2 border-black rounded-full transition-all duration-1000 flex items-center justify-end px-2"
                style={{ width: `${Math.max(percentage, 10)}%` }}
              >
                <div className="bg-white border-2 border-black rounded-full p-0.5">
                  <Trophy className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-sm md:text-base text-black mix-blend-overlay pointer-events-none uppercase">
                ĐÃ HỌC: {completedCount} / {steps.length} BÀI
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVITY CARDS */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((item) => {
            const isCompleted = progress[item.progressKey];
            const lockedPaths = ['/activity/hd2', '/activity/hd3', '/activity/hd4'];
            const isLocked = lockedPaths.includes(item.path) && !isTeacher;

            return (
              <motion.div
                key={item.id}
                whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                onClick={() => {
                  if (isLocked) {
                    alert("Khoá rồi! 🔒 Cô giáo sẽ mở khóa hoạt động này trên lớp nhé!");
                    return;
                  }
                  router.push(item.path);
                }}
                className={`relative rounded-3xl p-4 flex flex-col items-center text-center transition-all cursor-pointer border-4 border-black shadow-[6px_6px_0px_0px_#000000] min-h-[220px]
                  ${isLocked ? 'bg-gray-400 opacity-80' : `${item.color} text-white`}
                `}
              >
                <div className="absolute top-3 left-3">
                  {isLocked ? (
                    <div className="w-8 h-8 bg-black rounded-full border-2 border-white flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  ) : isCompleted ? (
                    <div className="w-8 h-8 bg-[#FFFF00] rounded-full border-2 border-black flex items-center justify-center shadow-md">
                      <Star className="w-4 h-4 text-black fill-black" />
                    </div>
                  ) : null}
                </div>

                <div className="flex-1 flex items-center justify-center mt-6">
                  <span className="text-6xl drop-shadow-xl">{item.emoji}</span>
                </div>

                <div className="w-full flex flex-col gap-3 mt-4">
                  <h3 className={`font-black text-sm lg:text-base uppercase line-clamp-2 ${isLocked ? 'text-gray-800' : 'text-black bg-white/90 rounded-xl p-2 border-2 border-black'}`}>
                    {item.name}
                  </h3>

                  <motion.button 
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`w-full py-2.5 rounded-xl font-black text-sm uppercase border-2 flex items-center justify-center gap-2
                      ${isLocked 
                        ? 'bg-gray-500 border-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-black border-black text-white shadow-md'
                      }`}
                  >
                    {isCompleted ? 'CHƠI LẠI' : 'VÀO HỌC'} 
                    {!isLocked && <Play className="w-4 h-4 fill-current" />}
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </section>

      </main>
    </div>
  );
}
