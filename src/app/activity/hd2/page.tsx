"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, BrainCircuit, X, ImageIcon, Award, Lightbulb } from 'lucide-react';
import { RUBRIC_CRITERIA } from '../../../data';

export default function ActivityTwo() {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('lactic_rubric_ratings') : null);
    return saved ? JSON.parse(saved) : {
      'do-dac': 5, 'vi-chua-ngot': 4, 'mau-sac': 5, 'mui-huong': 5, 'nhat-ky-onl': 4,
    };
  });

  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setActiveQuestion(null);
      }
    };
    if (isLightboxOpen || activeQuestion !== null) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeQuestion]);

  const reflections = [
    { q: 'Sữa chua và sữa trước khi ủ khác nhau chỗ nào nhỉ?', a: 'Sữa lỏng và ngọt. Còn sữa chua thì đặc quánh, chua ngọt thơm lừng!' },
    { q: 'Vì sao phải ủ sữa ở chỗ ấm (40°C)?', a: 'Vì vi khuẩn Lactic rất thích ấm áp! Lạnh quá thì ngủ nướng, nóng quá thì chết mất!' }
  ];

  const handleStarClick = (critId: string, starVal: number) => {
    const updated = { ...ratings, [critId]: starVal };
    setRatings(updated);
    if (typeof window !== 'undefined') localStorage.setItem('lactic_rubric_ratings', JSON.stringify(updated));
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd2' }) }).catch(console.error);
  };

  const totalPossible = Object.keys(ratings).length * 5;
  const currentTotal = (Object.values(ratings) as number[]).reduce((a, b) => a + b, 0);
  const scorePercent = Math.round((currentTotal / totalPossible) * 100);

  const getRubricVerdict = (percent: number) => {
    if (percent >= 90) return { title: <>XUẤT SẮC! 🏆</>, color: 'bg-[#FF1493] text-white border-white' };
    if (percent >= 70) return { title: <>RẤT TỐT! 👍</>, color: 'bg-[#00FF00] text-black border-black' };
    return { title: <>CỐ GẮNG LÊN! 🧪</>, color: 'bg-[#FF4500] text-white border-white' };
  };

  const verdict = getRubricVerdict(scorePercent);

  return (
    <section id="hd2" className="min-h-screen w-full flex flex-col p-4 md:p-6 bg-[#1E0078] font-sans relative">
      
      {/* HEADER */}
      <div className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#FFFF00] text-black font-black text-lg uppercase border-2 border-black flex items-center gap-1">
            ⭐ Chặng 2
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-black uppercase">
            CHẤM ĐIỂM <span className="text-[#FF00FF]">SỮA CHUA!</span>
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 pb-20">
        
        {/* Left Column: Rubric Panel (60%) */}
        <div className="w-full md:w-[60%] flex flex-col">
          <div className="flex-1 bg-[#00E5FF] border-4 border-black rounded-3xl p-4 shadow-[8px_8px_0px_0px_#FFFF00] flex flex-col relative overflow-hidden">
            
            <div className="flex-none flex items-center justify-between bg-white rounded-2xl p-3 border-2 border-black mb-4 shadow-inner">
              <h3 className="font-black text-xl text-black flex items-center gap-2">
                <Award className="w-6 h-6 text-[#FF00FF]" /> BẢNG PHONG THẦN
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-black text-2xl text-black">{currentTotal}/{totalPossible}</span>
                <div className={`px-3 py-1 rounded-xl border-2 font-black text-sm flex items-center gap-1 ${verdict.color}`}>
                  {verdict.title}
                </div>
              </div>
            </div>

            {/* Rubric rows */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {RUBRIC_CRITERIA.map((crit) => {
                const currentRating = ratings[crit.id] || 0;
                return (
                  <div key={crit.id} className="p-3 rounded-2xl bg-white border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-lg font-black text-black uppercase block">{crit.label}</span>
                      <span className="text-sm font-medium text-gray-600 block">{crit.description}</span>
                    </div>

                    <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-full border border-gray-300 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          key={star}
                          onClick={() => handleStarClick(crit.id, star)}
                          className="focus:outline-none p-0.5"
                        >
                          <Star
                            className={`w-6 h-6 sm:w-8 sm:h-8 transition-all ${
                              star <= currentRating
                                ? 'fill-[#FFFF00] text-[#FF8C00] drop-shadow-sm'
                                : 'fill-white text-gray-400'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Flashcards & Image (40%) */}
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          
          {/* Flashcards - Made flex-none so it only takes needed space */}
          <div className="flex-none bg-[#FF00FF] border-4 border-black rounded-3xl p-4 shadow-[8px_8px_0px_0px_#00E5FF] flex flex-col gap-3">
            <div className="bg-white rounded-full py-1.5 border-2 border-black shadow-inner flex items-center justify-center">
              <h3 className="font-black text-base md:text-lg text-black flex items-center gap-2 uppercase">
                <BrainCircuit className="w-5 h-5 text-[#00E5FF]" /> CÂU HỎI THƯỞNG!
              </h3>
            </div>

            <div className="space-y-2">
              {reflections.map((ref, idx) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => setActiveQuestion(idx)}
                  className="w-full text-left p-3 border-2 border-black rounded-xl bg-[#FFFF00] shadow-sm hover:bg-[#FFE600] flex justify-between items-center"
                >
                  <span className="text-sm font-black text-black leading-tight flex items-center gap-2">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </div>
                    {ref.q}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Image Showcase - Made flex-1 so it grows to fill all remaining vertical space */}
          <div className="flex-1 bg-white p-3 rounded-3xl shadow-[8px_8px_0px_0px_#FFFF00] border-4 border-black flex flex-col relative overflow-hidden group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
            <img
              src="/models/yogurt_comparison.png"
              alt="So sánh"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-[#FFFF00] text-black font-black text-sm px-3 py-1.5 rounded-full flex items-center gap-1 border-2 border-black uppercase">
                <ImageIcon className="w-4 h-4" /> Phóng to
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ── ANSWER POPUP MODAL ── */}
      <AnimatePresence>
        {activeQuestion !== null && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveQuestion(null)} />
            
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_#FF00FF] p-6 z-10 flex flex-col gap-4 text-center"
            >
              <div className="w-16 h-16 bg-[#00E5FF] rounded-full border-4 border-black flex items-center justify-center mx-auto -mt-12 mb-2 shadow-sm">
                <Lightbulb className="w-8 h-8 text-[#FFFF00] fill-[#FFFF00]" />
              </div>
              
              <h3 className="font-black text-lg text-black">{reflections[activeQuestion].q}</h3>
              
              <div className="bg-[#00FF00] p-4 rounded-2xl border-2 border-black shadow-inner">
                <p className="font-bold text-base text-black leading-relaxed">
                  {reflections[activeQuestion].a}
                </p>
              </div>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveQuestion(null)}
                className="mt-2 py-3 bg-black text-white font-black uppercase rounded-xl border-2 border-transparent hover:border-black hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center gap-2">ĐÃ HIỂU! 🚀</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-2 md:p-3 bg-red-600 rounded-full text-white border-2 border-white"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full text-center" onClick={(e) => e.stopPropagation()}
            >
              <img src="/models/yogurt_comparison.png" alt="So sánh" className="w-full h-auto rounded-3xl border-4 border-white shadow-2xl mb-4" />
              <p className="font-black text-lg md:text-2xl text-[#FFFF00] uppercase drop-shadow-md flex items-center justify-center gap-2">
                ⭐ TRÁI (Đặc) — GIỮA (Lỏng) — PHẢI (Hỏng)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
