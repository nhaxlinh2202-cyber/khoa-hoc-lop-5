"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Home, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const STEPS = [
  { path: '/activity/hd1', label: 'HĐ1 - Trải nghiệm' },
  { path: '/activity/hd2', label: 'HĐ2 - Lý thuyết' },
  { path: '/activity/hd3', label: 'HĐ3 - Phản ngẫm' },
  { path: '/activity/hd4', label: 'HĐ4 - Vận dụng' },
  { path: '/activity/assessment', label: 'HĐ5 - Củng cố & Đánh giá' },
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
          // Not authenticated — redirect to login
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
    
    // Router Guard check for students
    const lockedPaths = ['/activity/hd2', '/activity/hd3', '/activity/hd4'];
    if (lockedPaths.includes(nextStep.path) && !isTeacher) {
      alert("Hoạt động này tạm khóa. Chỉ Giáo viên mới có quyền mở khóa!");
      return;
    }
    
    router.push(nextStep.path);
  };

  return (
    <div className="min-h-screen bg-science-bg font-sans text-science-dark antialiased selection:bg-science-accent selection:text-science-dark relative flex flex-col pb-20">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Left: Home */}
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-science-dark shadow-[4px_4px_0px_0px_var(--color-science-dark)] hover:shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer text-science-dark font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </button>

          {/* Right: Next & Prev */}
          <div className="flex gap-3 sm:gap-4">
            {prevStep && (
              <button
                onClick={() => router.push(prevStep.path)}
                className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-white border-2 border-science-dark shadow-[4px_4px_0px_0px_var(--color-science-dark)] hover:shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer text-science-dark font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            )}

            {nextStep && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-science-base border-2 border-science-dark shadow-[4px_4px_0px_0px_var(--color-science-dark)] hover:shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest group"
              >
                <span className="hidden sm:inline">Tiếp: {nextStep.label}</span>
                <span className="sm:hidden">Tiếp theo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
