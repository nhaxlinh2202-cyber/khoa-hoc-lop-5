"use client";

/**
 * page.tsx — Split-screen role selector (Student / Teacher).
 * Swiss Brutalist aesthetic: #FAFAFA bg, thick black borders, sharp corners.
 * Teacher PIN: 1234 (hardcoded).
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const TEACHER_PIN = '1234';

export default function Gateway() {
  const router = useRouter();

  /* ── Teacher form state ── */
  const [showPinForm, setShowPinForm] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Student form state ── */
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);
  const studentInputRef = useRef<HTMLInputElement>(null);

  /* Focus inputs when forms appear */
  useEffect(() => {
    if (showPinForm && inputRef.current) inputRef.current.focus();
  }, [showPinForm]);

  useEffect(() => {
    if (showStudentForm && studentInputRef.current) studentInputRef.current.focus();
  }, [showStudentForm]);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    if (!studentName.trim()) {
      setStudentError('Vui lòng nhập họ tên.');
      return;
    }

    setStudentLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName }),
      });
      const data = await res.json();
      if (data.success) {
        // Auth role is stored in JWT cookie (set by server) — no sessionStorage needed
        router.push('/home');
      } else {
        setStudentError(data.error || 'Lỗi đăng nhập');
      }
    } catch (err) {
      setStudentError('Lỗi kết nối máy chủ');
    } finally {
      setStudentLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('Vui lòng nhập mã PIN.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        // Auth role is stored in JWT cookie (set by server) — no sessionStorage needed
        router.push('/home');
      } else {
        setError(data.error || 'Mã PIN không đúng.');
        setPin('');
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-science-bg font-sans text-science-dark antialiased selection:bg-science-accent selection:text-science-dark overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="shrink-0 border-b-2 border-science-dark bg-white z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tighter text-science-dark">
            SCIENCE.05
          </span>
          <span className="font-mono text-[9px] px-3 py-1 border-2 border-science-dark font-bold tracking-widest bg-white uppercase">
            CHỌN VAI TRÒ
          </span>
        </div>
      </header>

      {/* ── Split Layout ── */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">

        {/* ═══════════════ LEFT — STUDENT ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white border-b-2 lg:border-b-0 lg:border-r-2 border-science-dark"
        >
          {/* Giant watermark number */}
          <span className="absolute top-4 left-6 font-mono text-[120px] sm:text-[160px] font-black text-science-dark/[0.03] leading-none select-none pointer-events-none">
            01
          </span>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            {/* Icon */}
            <div className="p-5 border-2 border-science-dark bg-science-bg">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-science-dark" />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] block">
                Truy cập trực tiếp
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase">
                Dành cho Học sinh
              </h2>
              <p className="text-sm text-[#666666] max-w-xs mx-auto leading-relaxed">
                Khám phá hành trình học tập vi khuẩn Lactic qua các hoạt động trải nghiệm thú vị.
              </p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {!showStudentForm ? (
                <motion.button
                  key="student-toggle"
                  onClick={() => setShowStudentForm(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 border-2 border-science-dark bg-science-base text-white
                             text-[11px] font-mono font-bold uppercase tracking-widest
                             hover:bg-science-dark transition-all duration-300 cursor-pointer shadow-[4px_4px_0px_0px_var(--color-science-dark)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  <span>Bắt đầu học</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.form
                  key="student-form"
                  onSubmit={handleStudentSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full space-y-3"
                >
                  {/* Name input */}
                  <div className="relative">
                    <input
                      ref={studentInputRef}
                      type="text"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (studentError) setStudentError('');
                      }}
                      placeholder="Nhập họ và tên của em"
                      className={`w-full px-4 py-3 border-2 bg-white font-mono text-center
                                  placeholder:text-science-dark/40
                                  focus:outline-none focus:border-science-dark transition-colors
                                  ${studentError ? 'border-red-500' : 'border-science-dark'}`}
                      autoComplete="off"
                    />
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {studentError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center space-x-1.5 text-[#B00020]"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-mono font-bold">{studentError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit + Cancel */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowStudentForm(false);
                        setStudentName('');
                        setStudentError('');
                      }}
                      className="flex-1 px-4 py-2.5 border-2 border-science-dark/20 bg-white
                                 text-[10px] font-mono font-bold uppercase tracking-widest text-science-dark/60
                                 hover:border-science-dark hover:text-science-dark transition-all cursor-pointer"
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      disabled={studentLoading}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 border-2 border-science-dark bg-science-base text-white
                                 text-[10px] font-mono font-bold uppercase tracking-widest
                                 hover:bg-science-dark transition-all cursor-pointer
                                 disabled:opacity-60 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      {studentLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Xác nhận</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══════════════ RIGHT — TEACHER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-science-light"
        >
          {/* Giant watermark number */}
          <span className="absolute top-4 right-6 font-mono text-[120px] sm:text-[160px] font-black text-science-dark/[0.03] leading-none select-none pointer-events-none">
            02
          </span>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            {/* Icon */}
            <div className="p-5 border-2 border-science-dark bg-white">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-science-dark" />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] block">
                Yêu cầu xác thực
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase">
                Dành cho Giáo viên
              </h2>
              <p className="text-sm text-[#666666] max-w-xs mx-auto leading-relaxed">
                Truy cập bảng điều khiển quản lý, chỉnh sửa nội dung và theo dõi tiến trình học sinh.
              </p>
            </div>

            {/* PIN toggle / form */}
            <AnimatePresence mode="wait">
              {!showPinForm ? (
                <motion.button
                  key="pin-toggle"
                  onClick={() => setShowPinForm(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 border-2 border-science-dark bg-white text-science-dark
                             text-[11px] font-mono font-bold uppercase tracking-widest
                             hover:bg-science-accent transition-all duration-300 cursor-pointer shadow-[4px_4px_0px_0px_var(--color-science-dark)] hover:shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Nhập mã PIN</span>
                </motion.button>
              ) : (
                <motion.form
                  key="pin-form"
                  onSubmit={handlePinSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full space-y-3"
                >
                  {/* PIN input */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="password"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="• • • •"
                      maxLength={10}
                      className={`w-full px-4 py-3 border-2 bg-white font-mono text-center text-lg tracking-[0.5em]
                                  placeholder:text-science-dark/40 placeholder:tracking-[0.5em]
                                  focus:outline-none focus:border-science-dark transition-colors
                                  ${error ? 'border-red-500' : 'border-science-dark'}`}
                      autoComplete="off"
                    />
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center space-x-1.5 text-[#B00020]"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-mono font-bold">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit + Cancel */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPinForm(false);
                        setPin('');
                        setError('');
                      }}
                      className="flex-1 px-4 py-2.5 border-2 border-science-dark/20 bg-white
                                 text-[10px] font-mono font-bold uppercase tracking-widest text-science-dark/60
                                 hover:border-science-dark hover:text-science-dark transition-all cursor-pointer"
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 border-2 border-science-dark bg-science-base text-white
                                 text-[10px] font-mono font-bold uppercase tracking-widest
                                 hover:bg-science-dark transition-all cursor-pointer
                                 disabled:opacity-60 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Xác nhận</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* ── Bottom Bar ── */}
      <footer className="shrink-0 border-t-2 border-science-dark bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-[10px] text-science-dark/60">
          <span>© {new Date().getFullYear()} Nhóm 4 thực hành • Ha Noi University of Science and Technology</span>
          <span className="hidden sm:inline font-mono uppercase tracking-widest text-[9px]">
            Hệ thống quản lý học tập EdTech
          </span>
        </div>
      </footer>
    </div>
  );
}
