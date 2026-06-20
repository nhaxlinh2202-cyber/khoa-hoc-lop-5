"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Eye,
  Search,
  HelpCircle,
  Trophy,
  BookOpenCheck,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ClipboardList,
  Star,
  Award,
  Gamepad2,
  User,
  Activity,
  ChevronRight,
  BookOpen,
  Lock,
} from 'lucide-react';
import { DiaryEntry } from '../../types';

const steps = [
  {
    step: 'Bước 01',
    progressKey: 'hd1',
    name: 'Tự làm sữa chua tại nhà',
    subtitle: 'HĐ1 — Trải nghiệm',
    desc: 'Xem video hướng dẫn làm sữa chua từ thùng xốp và ghi chép nhật ký ủ ấm cùng gia đình.',
    path: '/activity/hd1',
    icon: Flame,
    color: 'orange',
    bgHover: 'hover:bg-orange-50/70 hover:border-orange-400 hover:shadow-[0_8px_30px_rgba(249,115,22,0.05)]',
    iconColor: 'text-orange-500 group-hover:text-orange-600',
    borderColor: 'border-orange-100',
  },
  {
    step: 'Bước 02',
    progressKey: 'hd2',
    name: 'Nhận xét & Đánh giá',
    subtitle: 'HĐ2 — Phản ngẫm',
    desc: 'Đóng vai chuyên gia ẩm thực nhí chấm điểm chéo các hũ sữa chua bằng Rubric sao sinh động.',
    path: '/activity/hd2',
    icon: Eye,
    color: 'violet',
    bgHover: 'hover:bg-violet-50/70 hover:border-violet-400 hover:shadow-[0_8px_30px_rgba(139,92,246,0.05)]',
    iconColor: 'text-violet-500 group-hover:text-violet-600',
    borderColor: 'border-violet-100',
  },
  {
    step: 'Bước 03',
    progressKey: 'hd3',
    name: 'Khám phá kính hiển vi',
    subtitle: 'HĐ3 — Lý thuyết',
    desc: 'Soi tiêu bản kính hiển vi ảo 3D sinh động để quan sát trực khuẩn Lactic dưới góc nhìn khoa học.',
    path: '/activity/hd3',
    icon: Search,
    color: 'teal',
    bgHover: 'hover:bg-teal-50/70 hover:border-teal-400 hover:shadow-[0_8px_30px_rgba(20,184,166,0.05)]',
    iconColor: 'text-teal-500 group-hover:text-teal-600',
    borderColor: 'border-teal-100',
  },
  {
    step: 'Bước 04',
    progressKey: 'Giải cứu sữa chua hỏng',
    progressKeyReal: 'hd4',
    name: 'Giải cứu sữa chua',
    subtitle: 'HĐ4 — Vận dụng',
    desc: 'Thảo luận xử lý các tình huống thực tế khi ủ ấm sữa chua bị lạnh lỏng lẻo hay tách nước.',
    path: '/activity/hd4',
    icon: HelpCircle,
    color: 'amber',
    bgHover: 'hover:bg-amber-50/70 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.05)]',
    iconColor: 'text-amber-500 group-hover:text-amber-600',
    borderColor: 'border-amber-100',
  },
  {
    step: 'Bước 05',
    progressKey: 'assessment',
    name: 'Củng cố & Wayground!',
    subtitle: 'HĐ5 — Củng cố',
    desc: 'Trả lời các câu hỏi mở rộng thực tiễn và tham gia minigame Wayground sôi động cùng cả lớp.',
    path: '/activity/assessment',
    icon: BookOpenCheck,
    color: 'emerald',
    bgHover: 'hover:bg-emerald-50/70 hover:border-emerald-400 hover:shadow-[0_8px_30px_rgba(16,185,129,0.05)]',
    iconColor: 'text-emerald-500 group-hover:text-emerald-600',
    borderColor: 'border-emerald-100',
  },
];

export default function HomePage() {
  const router = useRouter();
  
  /* ── State variables ── */
  const [isTeacher, setIsTeacher] = useState(false);
  const [studentName, setStudentName] = useState('Nhà khoa học nhí');
  const [progress, setProgress] = useState<Record<string, boolean>>({
    hd1: false,
    hd2: false,
    hd3: false,
    hd4: false,
    assessment: false,
  });
  const [loading, setLoading] = useState(true);

  /* Load stats from API */
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
            if (meData.user.role === 'student') {
              setStudentName(meData.user.name);
            }
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }

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
  const totalStepsCount = steps.length;
  const percentage = Math.round((completedCount / totalStepsCount) * 100);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.clear();
    router.push('/');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-science-bg font-sans text-science-dark antialiased selection:bg-science-accent selection:text-science-dark">
      {/* ── Compact Header ── */}
      <header className="shrink-0 border-b border-science-dark/20 bg-white/95 backdrop-blur-md z-10 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-display font-bold text-lg tracking-tighter text-science-dark">
              SCIENCE.05
            </span>
            <div className="hidden sm:block h-4 w-px bg-science-dark/20" />
            <span className="hidden sm:block font-mono text-[9px] text-[#444444] tracking-widest uppercase">
              Chuyên Đề Vi Khuẩn Lactic
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-[9px] px-3 py-1 border border-science-dark rounded-full font-bold tracking-widest bg-white uppercase text-science-dark">
              KHOA HỌC LỚP 5
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-dashed border-[#B00020] hover:bg-red-50 text-[#B00020] text-[9.5px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Area ── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── Portal Banner ── */}
        <section className="bg-white border-2 border-science-dark p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative" style={{ boxShadow: '8px 8px 0px 0px var(--color-science-dark)' }}>
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="p-1.5 bg-science-base text-white shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-science-dark/60 font-bold">
                CỔNG THÔNG TIN HỌC SINH
              </span>
            </div>
            
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-none text-science-dark">
              Chào mừng, <span className="underline decoration-science-base decoration-4 underline-offset-4">{studentName}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-science-dark/80 max-w-xl">
              Chào mừng em đến với hành trình nghiên cứu khoa học thú vị về vi khuẩn Lactic. Hãy tham gia đầy đủ 5 chặng học tập dưới đây để tích lũy kiến thức thực tiễn và hoàn tất báo cáo khoa học của riêng mình nhé!
            </p>
          </div>

          {/* Progress dashboard circle/bar */}
          <div className="w-full md:w-auto shrink-0 bg-science-bg border border-science-dark/20 p-5 space-y-4 max-w-sm">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-science-dark/60">
              <span>TIẾN ĐỘ HÀNH TRÌNH</span>
              <span className="text-science-dark">{completedCount} / {totalStepsCount} CHẶNG ({percentage}%)</span>
            </div>

            <div className="w-full sm:w-64 bg-white h-3 border border-science-dark overflow-hidden relative">
              <div
                className="h-full bg-science-base transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[9px] font-mono text-[#888888]">
                {percentage === 100 ? '🎉 Xuất sắc! Em đã hoàn thành' : '⚡ Cố gắng lên con nhé!'}
              </span>
            </div>
          </div>
        </section>

        {/* ── Timeline Grid (Hành trình học tập) ── */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-science-dark/20 pb-4">
            <Activity className="w-5 h-5 text-science-dark" />
            <h2 className="font-sans font-bold text-lg sm:text-xl uppercase tracking-tight text-science-dark">
              HÀNH TRÌNH HỌC TẬP (5 BƯỚC KHÉP KÍN)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item, index) => {
              const Icon = item.icon;
              // Map progress key
              const progressKey = item.progressKeyReal || item.progressKey;
              const isCompleted = progress[progressKey];
              
              // Lock HĐ2, HĐ3, HĐ4 if not Teacher
              const lockedPaths = ['/activity/hd2', '/activity/hd3', '/activity/hd4'];
              const isLocked = lockedPaths.includes(item.path) && !isTeacher;

              let cardBorderClass = 'border-science-dark/20 hover:border-science-dark';
              let shadowClass = '';
              let cursorClass = 'cursor-pointer hover:shadow-[4px_4px_0px_0px_var(--color-science-dark)]';
              
              if (isCompleted && !isLocked) {
                cardBorderClass = 'border-science-dark';
                shadowClass = 'shadow-[4px_4px_0px_0px_var(--color-science-base)]'; // Brutalist emerald shadow for completed
              } else if (isLocked) {
                cardBorderClass = 'border-neutral-200 opacity-60 bg-neutral-50/50';
                cursorClass = 'cursor-not-allowed select-none';
              }

              const CardIcon = isLocked ? Lock : Icon;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`group relative bg-white border-2 rounded-none p-6 flex flex-col justify-between transition-all duration-300 ${cardBorderClass} ${shadowClass} ${item.bgHover} ${cursorClass}`}
                  onClick={() => {
                    if (isLocked) {
                      alert("Hoạt động này tạm khóa. Chỉ Giáo viên mới có quyền mở khóa trình chiếu tại lớp học!");
                      return;
                    }
                    router.push(item.path);
                  }}
                >
                  <div>
                    {/* Top line: step number + completion/lock badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block">
                          {item.step}
                        </span>
                        
                        {isLocked ? (
                          <span className="inline-block text-[8px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5">
                            🔒 Chỉ tại lớp học
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-block text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5">
                            ✓ Đã hoàn thành
                          </span>
                        ) : null}
                      </div>

                      <div className={`p-2 border transition-all duration-300 ${
                        isLocked
                          ? 'border-neutral-300 bg-neutral-100 text-neutral-400'
                          : isCompleted
                            ? 'bg-science-light text-science-base border-science-base border'
                            : 'border-science-dark bg-white group-hover:bg-science-base group-hover:border-science-base group-hover:text-white'
                      }`}>
                        <CardIcon className="w-5 h-5 text-current" />
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="space-y-1">
                      <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isLocked ? 'text-neutral-500' : 'text-science-dark'}`}>
                        {item.name}
                      </h3>
                      <span className="font-mono text-[9px] text-science-dark/50 block uppercase tracking-wider">
                        {item.subtitle}
                      </span>
                      <p className={`text-xs leading-relaxed pt-2 ${isLocked ? 'text-neutral-400' : 'text-[#555555]'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Action CTA */}
                  <div className="mt-6 pt-3 border-t border-science-dark/10 flex items-center justify-between group-hover:border-science-dark/30 transition-all">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-science-dark/40 group-hover:text-science-dark font-bold transition-colors">
                      {isLocked ? '🔒 Hoạt động bị khóa' : (isCompleted ? 'Xem lại bài học' : 'Bắt đầu học tập')}
                    </span>
                    {!isLocked && (
                      <ArrowRight className="w-3.5 h-3.5 text-science-dark/30 group-hover:text-science-dark transition-all group-hover:translate-x-1" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>


      </main>

      {/* ── Compact Footer ── */}
      <footer className="shrink-0 border-t border-science-dark/20 bg-white z-10 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-[10px] text-science-dark/60">
          <span>© {new Date().getFullYear()} Nhóm 4 thực hành • Ha Noi University of Science and Technology</span>
          <span className="hidden sm:inline font-mono uppercase tracking-widest text-[9px]">
            Learning by Doing — Học qua trải nghiệm
          </span>
        </div>
      </footer>
    </div>
  );
}
