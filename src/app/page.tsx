"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ShieldCheck, ArrowRight, KeyRound, AlertCircle, Loader2, Sparkles, Star } from 'lucide-react';

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
      setStudentError('CHƯA NHẬP TÊN KÌA BÉ ƠI!');
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
        setStudentError(data.error || 'LỖI ĐĂNG NHẬP!');
      }
    } catch (err) {
      setStudentError('LỖI KẾT NỐI MẠNG!');
    } finally {
      setStudentLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('CÔ CHƯA NHẬP MÃ PIN!');
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
        setError(data.error || 'MÃ PIN SAI RỒI!');
        setPin('');
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('LỖI KẾT NỐI MẠNG!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFF00] font-sans text-black antialiased p-4 md:p-8 selection:bg-black selection:text-white">
      
      {/* ── Top Bar ── */}
      <header className="shrink-0 bg-white px-6 py-4 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_#000000] z-10 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-[#FF0000] border-2 border-black flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-[#FFFF00]" />
          </div>
          <span className="font-display font-black text-3xl tracking-tighter text-black uppercase">
            KHOA HỌC LỚP 5
          </span>
        </div>
        <span className="hidden sm:inline-block font-black text-lg px-6 py-2 rounded-full bg-[#00FF00] border-2 border-black text-black uppercase tracking-widest animate-bounce">
          VUI LÀ CHÍNH! 🚀
        </span>
      </header>

      {/* ── Split Layout ── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* ═══════════════ LEFT — STUDENT ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#00E5FF] rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_#FF00FF] z-10"
        >
          <div className="flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            
            <div className="relative">
              <div className="relative p-6 bg-white rounded-full shadow-[6px_6px_0px_0px_#000000] border-4 border-black transform transition-transform hover:scale-110 hover:rotate-6 duration-300">
                <GraduationCap className="w-16 h-16 text-[#0000FF]" />
              </div>
              <Star className="absolute -top-4 -right-4 w-10 h-10 text-[#FFFF00] fill-[#FFFF00] animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <span className="font-black inline-block px-4 py-1.5 bg-[#FFFF00] border-2 border-black rounded-full text-sm uppercase">
                Dành cho Học sinh
              </span>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-black uppercase drop-shadow-md">
                BÉ ĐÃ SẴN SÀNG?
              </h2>
            </div>

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
                  className="w-full inline-flex items-center justify-center space-x-3 px-8 py-5 bg-[#00FF00] text-black border-4 border-black rounded-3xl text-xl font-black uppercase shadow-[6px_6px_0px_0px_#000000] hover:bg-[#00CC00] transition-colors"
                >
                  <span>BẮT ĐẦU HỌC NÀO!</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              ) : (
                <motion.form
                  key="student-form"
                  onSubmit={handleStudentSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full bg-white p-6 rounded-3xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black space-y-4"
                >
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-black text-black uppercase">TÊN BÉ LÀ GÌ NÀO?</label>
                    <input
                      ref={studentInputRef}
                      type="text"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (studentError) setStudentError('');
                      }}
                      placeholder="Nhập họ và tên bé..."
                      className={`w-full px-4 py-3 bg-gray-100 rounded-2xl font-black text-lg border-4 focus:outline-none transition-colors
                        ${studentError ? 'border-red-500 bg-red-50' : 'border-black focus:bg-[#FFFF00]'}`}
                      autoComplete="off"
                    />
                  </div>

                  <AnimatePresence>
                    {studentError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center space-x-2 text-white bg-red-600 border-2 border-black py-2 px-4 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-black uppercase">{studentError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex space-x-3 pt-2">
                    <button type="button" onClick={() => { setShowStudentForm(false); setStudentName(''); setStudentError(''); }}
                      className="flex-1 px-4 py-3 bg-gray-300 text-black border-4 border-black rounded-2xl text-base font-black uppercase hover:bg-gray-400">
                      HUỶ
                    </button>
                    <button type="submit" disabled={studentLoading}
                      className="flex-[2] inline-flex items-center justify-center space-x-2 px-4 py-3 bg-[#00FF00] text-black border-4 border-black rounded-2xl text-base font-black uppercase shadow-[4px_4px_0px_0px_#000000] hover:bg-[#00CC00] disabled:opacity-50">
                      {studentLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><span>VÀO LỚP NGAY</span><ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══════════════ RIGHT — TEACHER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#FF00FF] rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_#00E5FF] z-10"
        >
          <div className="flex flex-col items-center text-center space-y-6 w-full max-w-sm">
            
            <div className="relative p-6 bg-white rounded-full shadow-[6px_6px_0px_0px_#000000] border-4 border-black transform transition-transform hover:scale-110 hover:-rotate-6 duration-300">
              <ShieldCheck className="w-16 h-16 text-[#FF0000]" />
            </div>

            <div className="space-y-2">
              <span className="font-black inline-block px-4 py-1.5 bg-white border-2 border-black rounded-full text-sm uppercase">
                Khu vực Quản lý
              </span>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white uppercase drop-shadow-md">
                DÀNH CHO GIÁO VIÊN
              </h2>
            </div>

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
                  className="w-full inline-flex items-center justify-center space-x-3 px-8 py-5 bg-black text-white border-4 border-white rounded-3xl text-xl font-black uppercase shadow-[6px_6px_0px_0px_#FFFFFF] hover:bg-gray-900 transition-colors"
                >
                  <KeyRound className="w-6 h-6" />
                  <span>NHẬP MÃ PIN</span>
                </motion.button>
              ) : (
                <motion.form
                  key="pin-form"
                  onSubmit={handlePinSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full bg-white p-6 rounded-3xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black space-y-4"
                >
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-black text-black uppercase">MÃ BÍ MẬT CỦA CÔ LÀ GÌ?</label>
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
                      className={`w-full px-4 py-3 bg-gray-100 rounded-2xl font-mono font-black text-center text-3xl tracking-[0.5em] border-4 focus:outline-none transition-colors
                        ${error ? 'border-red-500 bg-red-50' : 'border-black focus:bg-[#FFFF00]'}`}
                      autoComplete="off"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center space-x-2 text-white bg-red-600 border-2 border-black py-2 px-4 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-black uppercase">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex space-x-3 pt-2">
                    <button type="button" onClick={() => { setShowPinForm(false); setPin(''); setError(''); }}
                      className="flex-1 px-4 py-3 bg-gray-300 text-black border-4 border-black rounded-2xl text-base font-black uppercase hover:bg-gray-400">
                      HUỶ
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-[2] inline-flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white border-4 border-black rounded-2xl text-base font-black uppercase shadow-[4px_4px_0px_0px_#FF0000] hover:bg-gray-900 disabled:opacity-50">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><span>XÁC NHẬN</span><ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
