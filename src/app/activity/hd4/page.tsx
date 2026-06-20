"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, HelpCircle, Eye, BookOpen, Mail, Zap, AlarmClock, X } from 'lucide-react';

export default function ActivityFour() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowHint(false); setShowAnswer(false); }
    };
    if (showHint || showAnswer) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHint, showAnswer]);

  const handleStartPause = () => setTimerRunning(!timerRunning);
  const handleReset = () => { setTimerRunning(false); setTimeLeft(300); };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isDanger = timeLeft > 0 && timeLeft <= 60;
  const isZero = timeLeft === 0;

  return (
    <section id="hd4" className={`min-h-screen w-full flex flex-col p-4 md:p-6 font-sans transition-colors duration-500 ${isDanger ? 'bg-[#FF0000]' : 'bg-[#FF8C00]'}`}>
      
      {/* HEADER */}
      <div className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#FF4500] text-white font-black text-lg uppercase border-2 border-black">
            🚑 Chặng 4
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-black uppercase">
            ĐIỆP VỤ <span className="text-[#0000FF]">CỨU SỮA CHUA!</span>
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        
        {/* Left Column: Problem Case & Buttons (60%) */}
        <div className="w-full md:w-[60%] flex flex-col gap-4">
          <div className="flex-1 bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] relative flex flex-col">
            
            <div className="absolute top-0 left-0 w-full h-2 flex rounded-t-3xl overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#FF0000]' : 'bg-[#0000FF]'}`} />
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="p-2 bg-[#FFFF00] border-2 border-black rounded-full">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-xl md:text-2xl text-black uppercase">MẬT THƯ CẦU CỨU</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <div className="bg-[#FFFF00] p-4 rounded-2xl border-2 border-black">
                <p className="font-bold text-lg md:text-xl text-black leading-relaxed">
                  "Tớ đã đun sôi sữa, và cẩn thận đổ hộp sữa chua mồi vào <span className="text-[#FF0000] underline decoration-wavy font-black">NGAY LÚC SỮA ĐANG SÔI</span>. Tớ ủ ấm 8 tiếng, nhưng sữa vẫn lỏng như nước! Tại sao vậy? 😭"
                </p>
              </div>

              <div className="p-4 bg-[#0000FF] border-2 border-black rounded-2xl text-white shadow-inner">
                <h4 className="font-black text-lg uppercase mb-2 text-[#FFFF00]">🔥 NHIỆM VỤ NHÓM:</h4>
                <p className="font-bold text-base md:text-lg leading-relaxed">
                  Hãy giải thích vì sao bạn ấy thất bại và làm cách nào để cứu mẻ sữa này?
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex-none flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowHint(true); fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd4' }) }).catch(console.error); }}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xl uppercase border-4 border-black bg-[#00E5FF] text-black shadow-[6px_6px_0px_0px_#000000]"
            >
              <HelpCircle className="w-6 h-6" /> MỞ GỢI Ý
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowAnswer(true); fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd4' }) }).catch(console.error); }}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xl uppercase border-4 border-black bg-[#FF00FF] text-white shadow-[6px_6px_0px_0px_#000000]"
            >
              <Eye className="w-6 h-6" /> XEM ĐÁP ÁN
            </motion.button>
          </div>
        </div>

        {/* Right Column: Timer (40%) */}
        <div className="w-full md:w-[40%] bg-[#FFFF00] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-[#FF0000] rounded-full border-4 border-black flex items-center justify-center animate-bounce mb-4">
            <AlarmClock className="w-8 h-8 text-white" />
          </div>

          <h3 className="font-black text-xl md:text-2xl text-black mb-6 uppercase">ĐỒNG HỒ ĐẾM NGƯỢC</h3>

          <motion.div 
            animate={isDanger ? { rotate: [-2, 2, -2, 2, 0], scale: [1, 1.02, 1] } : {}}
            transition={isDanger ? { repeat: Infinity, duration: 0.3 } : {}}
            className={`py-6 w-full rounded-3xl border-4 mb-6 transition-colors duration-500 shadow-inner flex justify-center items-center ${
              isZero ? 'bg-gray-300 border-gray-500 text-gray-500' : isDanger ? 'bg-[#FF0000] border-black text-white' : 'bg-black border-gray-800 text-[#00FF00]'
            }`}
          >
            <div className="font-display font-black text-6xl md:text-7xl tracking-tighter leading-none drop-shadow-xl">
              {formatTime(timeLeft)}
            </div>
          </motion.div>

          <div className="w-full flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartPause}
              disabled={isZero}
              className={`w-full py-4 rounded-2xl font-black text-xl uppercase border-4 shadow-lg flex items-center justify-center gap-2 transition-colors ${
                isZero ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : timerRunning ? 'bg-[#FF00FF] text-white border-black' : 'bg-[#00FF00] text-black border-black'
              }`}
            >
              {timerRunning ? <><Pause className="w-6 h-6" /> TẠM DỪNG</> : <><Play className="w-6 h-6" /> BẮT ĐẦU</>}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full py-3 rounded-2xl font-bold text-base text-white bg-black border-2 border-gray-700 hover:bg-gray-800 uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> LÀM LẠI 5 PHÚT
            </motion.button>
          </div>
        </div>

      </div>

      {/* ── POPUP: HINT ── */}
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowHint(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black rounded-3xl p-6 max-w-2xl w-full shadow-[12px_12px_0px_0px_#00E5FF] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowHint(false)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full border-2 border-black hover:bg-red-500">
                <X className="w-6 h-6" />
              </button>
              
              <h4 className="font-black text-2xl md:text-3xl text-black flex items-center gap-3 uppercase mb-6 border-b-2 border-gray-200 pb-3">
                <BookOpen className="w-8 h-8 text-[#00E5FF]" /> TÚI GỢI Ý
              </h4>
              <ul className="space-y-4 text-black font-bold text-lg md:text-xl">
                <li className="flex items-start gap-3">
                  <span className="text-[#FF00FF] text-2xl">👉</span> Vi khuẩn lactic sẽ ra sao nếu nhảy vào nồi nước sôi sùng sục?
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF00FF] text-2xl">👉</span> Bạn nên đợi sữa nguội đến nhiệt độ nào rồi mới đưa "quân cứu viện" vào?
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── POPUP: ANSWER ── */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowAnswer(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFFF00] border-4 border-black rounded-3xl p-6 max-w-3xl w-full shadow-[12px_12px_0px_0px_#FF0000] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowAnswer(false)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full border-2 border-black hover:bg-red-500">
                <X className="w-6 h-6" />
              </button>

              <h4 className="font-black text-black flex items-center gap-3 text-2xl md:text-3xl uppercase mb-6 border-b-2 border-black pb-3">
                <Zap className="w-8 h-8 text-[#FF0000]" /> ĐÁP ÁN BÍ MẬT
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-black shadow-inner">
                  <h5 className="font-black text-xl text-[#FF0000] mb-2">🕵️ NGUYÊN NHÂN:</h5>
                  <p className="text-black font-bold text-lg leading-relaxed">
                    Nước sôi đã làm <span className="font-black">chết bỏng</span> toàn bộ vi khuẩn lactic! Chúng chỉ sống được ở mức ấm (30°C - 50°C).
                  </p>
                </div>
                  
                <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-black shadow-inner">
                  <h5 className="font-black text-xl text-[#00AA00] mb-2">🚑 CÁCH GIẢI CỨU:</h5>
                  <ul className="text-black font-bold text-lg space-y-2">
                    <li className="flex items-center gap-2"><span>1️⃣</span> Đợi bình sữa nguội bớt (như nước tắm em bé).</li>
                    <li className="flex items-center gap-2"><span>2️⃣</span> Đổ 1 hộp sữa chua mồi MỚI vào.</li>
                    <li className="flex items-center gap-2"><span>3️⃣</span> Ủ ấm lại 6 - 8 giờ là xong!</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
