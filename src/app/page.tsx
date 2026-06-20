"use client";

/**
 * page.tsx — Split-screen role selector (Student / Teacher).
 * Playful aesthetic: Soft gradients, rounded corners, fun animations.
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
  Sparkles,
  Star
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
    <div className="h-screen flex flex-col bg-science-bg font-sans text-science-dark antialiased overflow-hidden selection:bg-science-accent selection:text-science-dark">
      
      {/* ── Top Bar ── */}
      <header className="shrink-0 bg-white/80 backdrop-blur-md border-b border-science-base/20 z-10 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-science-base to-science-accent flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-science-dark">
              SCIENCE.05
            </span>
          </div>
          <span className="font-mono text-xs px-4 py-1.5 rounded-full bg-science-light text-science-dark font-bold border border-science-base/30 shadow-sm animate-bounce-in" style={{ animationDelay: '0.5s' }}>
            BẮT ĐẦU NÀO! 🚀
          </span>
        </div>
      </header>

      {/* ── Split Layout ── */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 relative">
        
        {/* Floating background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-40">
          <div className="absolute w-96 h-96 bg-science-base/20 rounded-full blur-3xl -top-20 -left-20 animate-float" />
          <div className="absolute w-96 h-96 bg-science-accent/20 rounded-full blur-3xl -bottom-20 -right-20 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* ═══════════════ LEFT — STUDENT ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white/40 backdrop-blur-sm z-10"
        >
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            {/* Fun Icon Container */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-science-base to-science-accent rounded-3xl blur opacity-30 animate-pulse" />
              <div className="relative p-6 bg-white rounded-3xl shadow-xl shadow-science-base/20 border-2 border-white transform transition-transform hover:scale-105 hover:rotate-3 duration-300">
                <GraduationCap className="w-14 h-14 text-science-base" />
              </div>
              <Star className="absolute -top-3 -right-3 w-6 h-6 text-science-accent animate-bounce" />
            </div>

            {/* Label */}
            <div className="space-y-3">
              <span className="font-display inline-block px-3 py-1 bg-science-base/10 text-science-base rounded-full text-xs font-bold uppercase tracking-wider">
                Dành cho Học sinh
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-science-dark drop-shadow-sm">
                Sẵn sàng khám phá!
              </h2>
              <p className="text-base text-science-dark/70 max-w-xs mx-auto leading-relaxed font-medium">
                Cùng nhau tìm hiểu về vi khuẩn Lactic qua các hoạt động trải nghiệm cực kỳ thú vị nhé.
              </p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {!showStudentForm ? (
                <motion.button
                  key="student-toggle"
                  onClick={() => setShowStudentForm(true)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-science-base to-[#2eb886] text-white
                             rounded-full text-lg font-display font-bold shadow-lg shadow-science-base/40
                             hover:shadow-xl hover:shadow-science-base/50 transition-all duration-300 cursor-pointer"
                >
                  <span>Bắt đầu học ngay</span>
                  <ArrowRight className="w-5 h-5 bg-white/20 rounded-full p-1" />
                </motion.button>
              ) : (
                <motion.form
                  key="student-form"
                  onSubmit={handleStudentSubmit}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="w-full bg-white p-6 rounded-3xl shadow-xl shadow-science-base/10 border border-science-light space-y-4"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-science-dark/60 uppercase pl-2">Tên của em là gì?</label>
                    <div className="relative">
                      <input
                        ref={studentInputRef}
                        type="text"
                        value={studentName}
                        onChange={(e) => {
                          setStudentName(e.target.value);
                          if (studentError) setStudentError('');
                        }}
                        placeholder="Nhập họ và tên..."
                        className={`w-full px-5 py-4 bg-science-bg rounded-2xl font-display text-lg
                                    placeholder:text-science-dark/30
                                    focus:outline-none focus:ring-4 transition-all
                                    ${studentError ? 'ring-red-100 border-red-300' : 'ring-science-base/20 border-transparent focus:bg-white'}`}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {studentError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center space-x-1.5 text-red-500 bg-red-50 p-2 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-display font-bold">{studentError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowStudentForm(false);
                        setStudentName('');
                        setStudentError('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-500 rounded-2xl
                                 text-sm font-display font-bold
                                 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={studentLoading}
                      className="flex-[2] inline-flex items-center justify-center space-x-2 px-4 py-3 bg-science-base text-white rounded-2xl
                                 text-sm font-display font-bold shadow-md shadow-science-base/30
                                 hover:bg-[#2eb886] hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {studentLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Vào lớp</span>
                          <ArrowRight className="w-4 h-4" />
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
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.4 }}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-science-light/50 backdrop-blur-sm z-10"
        >
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            {/* Icon */}
            <div className="p-6 bg-white rounded-full shadow-lg shadow-science-dark/5 border border-science-base/10">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-science-dark/70" />
            </div>

            {/* Label */}
            <div className="space-y-3">
              <span className="font-display inline-block px-3 py-1 bg-white text-science-dark/60 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-black/5">
                Khu vực Quản lý
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-science-dark">
                Dành cho Giáo viên
              </h2>
              <p className="text-sm text-science-dark/60 max-w-xs mx-auto leading-relaxed font-medium">
                Theo dõi tiến trình học tập của các em học sinh và quản lý nội dung bài giảng.
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-science-dark
                             rounded-full text-sm font-display font-bold shadow-md shadow-black/5 border border-black/5
                             hover:bg-science-bg transition-all duration-300 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-science-base" />
                  <span>Nhập mã PIN</span>
                </motion.button>
              ) : (
                <motion.form
                  key="pin-form"
                  onSubmit={handlePinSubmit}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="w-full bg-white p-6 rounded-3xl shadow-xl shadow-black/5 border border-black/5 space-y-4"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-science-dark/60 uppercase pl-2">Mã PIN Giáo viên</label>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="password"
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="••••"
                        maxLength={10}
                        className={`w-full px-5 py-4 bg-science-bg rounded-2xl font-mono text-center text-xl tracking-[0.5em]
                                    placeholder:text-science-dark/20 placeholder:tracking-normal
                                    focus:outline-none focus:ring-4 transition-all
                                    ${error ? 'ring-red-100 border-red-300' : 'ring-science-dark/10 border-transparent focus:bg-white'}`}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center space-x-1.5 text-red-500 bg-red-50 p-2 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-display font-bold">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPinForm(false);
                        setPin('');
                        setError('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-500 rounded-2xl
                                 text-sm font-display font-bold
                                 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] inline-flex items-center justify-center space-x-2 px-4 py-3 bg-science-dark text-white rounded-2xl
                                 text-sm font-display font-bold shadow-md shadow-science-dark/20
                                 hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Xác nhận</span>
                          <ArrowRight className="w-4 h-4" />
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
      <footer className="shrink-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center text-xs text-science-dark/50 font-display font-medium">
          <p>© {new Date().getFullYear()} Nhóm 4 thực hành • Trải nghiệm học tập khoa học thú vị dành cho học sinh Lớp 5 ✨</p>
        </div>
      </footer>
    </div>
  );
}
