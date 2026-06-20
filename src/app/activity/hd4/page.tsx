"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, HelpCircle, Eye, EyeOff, BookOpen } from 'lucide-react';

export default function ActivityFour() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleStartPause = () => {
    setTimerRunning(!timerRunning);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="hd4" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-science-dark/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-mono text-5xl md:text-6xl font-bold text-[#D9D9D9] leading-none">04</span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-science-dark/70 block">Bước 4: Giải quyết vấn đề thực tế (Kolb - Vận dụng)</span>
              <h2 className="font-display font-medium text-2xl md:text-3xl text-science-dark tracking-tight">
                HĐ4 — Thử tài giải cứu mẻ sữa chua hỏng
              </h2>
            </div>
          </div>
          <p className="text-sm md:text-base text-science-dark/70 max-w-3xl leading-relaxed mt-2">
            Học đi đôi với hành! Các em hãy cùng chia nhóm thảo luận để giải cứu một mẻ sữa chua bị bỏ quên không ủ ấm. Bật đồng hồ đếm ngược 5 phút và bắt đầu tranh luận nhanh nhất nào.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Problem Case Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-science-dark/20 rounded-none p-6 sm:p-8 space-y-6 shadow-none">
              
              {/* Scenario Label Badge — score removed */}
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-none bg-science-base text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                  🔥 TÌNH HUỐNG THẢO LUẬN LỚP 5
                </span>
              </div>

              {/* The Case content — new content */}
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-lg md:text-xl text-science-dark leading-snug">
                  Đề: &ldquo;Một bạn đã thực hiện làm sữa chua ở nhà như sau: Đun sôi sữa, cho sữa chua vào khi sữa đang sôi, ủ ở nhiệt độ khoảng từ 40 °C đến 50 °C trong 8 giờ. Sau khi ủ, sữa đã không tạo thành sữa chua.&rdquo;
                </h3>

                <div className="p-5 bg-science-bg border-2 border-science-dark rounded-none text-xs leading-relaxed text-science-dark space-y-3">
                  <div className="font-mono font-bold uppercase tracking-wide">❓ CÂU HỎI:</div>
                  <p className="leading-relaxed">
                    Em hãy giải thích vì sao bạn làm sữa chua không thành công và đề xuất phương án để giải cứu mẻ sữa chua này
                  </p>
                </div>
              </div>

              {/* Buttons controls for Hint and Answer */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowHint(!showHint);
                    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd4' }) }).catch(console.error);
                  }}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    showHint 
                      ? 'bg-science-base text-white border border-science-dark' 
                      : 'bg-white text-science-dark border border-science-dark hover:bg-neutral-100'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? 'ẨN GỢI Ý' : 'XEM GỢI Ý'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowAnswer(!showAnswer);
                    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd4' }) }).catch(console.error);
                  }}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    showAnswer 
                      ? 'bg-science-base text-white border border-science-dark' 
                      : 'bg-science-base text-white hover:bg-neutral-800'
                  }`}
                >
                  {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showAnswer ? 'ẨN ĐÁP ÁN' : 'BẬT XEM ĐÁP ÁN'}</span>
                </button>
              </div>

              {/* Animated Hints Panel — new content */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-none bg-science-bg border border-science-dark text-xs space-y-2.5">
                      <h4 className="font-mono font-bold text-science-dark uppercase tracking-wider flex items-center text-[10px]">
                        <BookOpen className="w-4 h-4 mr-1.5 text-science-dark" /> GỢI Ý:
                      </h4>
                      <ul className="list-none space-y-2 text-science-dark/70 text-[11px]">
                        <li className="flex items-start">
                          <span className="text-science-dark font-mono mr-1.5 font-bold">-</span>
                          <span>Bạn nhỏ đã vội vàng ở bước nào?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-science-dark font-mono mr-1.5 font-bold">-</span>
                          <span>Vi khuẩn lactic gặp sữa đang sôi sẽ ra sao? (Nhớ lại nhiệt độ sống của chúng ở HĐ3 nhé)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-science-dark font-mono mr-1.5 font-bold">-</span>
                          <span>Làm sao để đưa &ldquo;đội quân&rdquo; vi khuẩn mới vào bình sữa?</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated Answer Panel — new content */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-none bg-[#111111] text-white border border-science-dark text-xs space-y-3.5">
                      <h4 className="font-mono font-bold uppercase tracking-widest flex items-center text-[10px] text-white">
                        ⚡ ĐÁP ÁN:
                      </h4>
                      <p className="leading-relaxed font-mono text-[10px] uppercase tracking-wider text-white">
                        NGUYÊN NHÂN:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-[#D9D9D9] text-[11px]">
                        <li>Cho men mồi vào khi sữa đang sôi làm chết toàn bộ vi khuẩn lactic.</li>
                        <li>Vi khuẩn này chỉ hoạt động tốt ở nhiệt độ ấm từ 30°C đến 50°C. Không còn vi khuẩn thì sữa không thể lên men.</li>
                      </ul>
                      <p className="leading-relaxed font-mono text-[10px] uppercase tracking-wider text-white">
                        GIẢI PHÁP
                      </p>
                      <ul className="list-none space-y-2 bg-transparent p-4 rounded-none border border-[#444444] text-[#D9D9D9] text-[11px]">
                        <li><strong>Bước 1:</strong> Đợi bình sữa nguội xuống mức ấm nhẹ (khoảng 40°C - 45°C).</li>
                        <li><strong>Bước 2:</strong> Khuấy thêm một hộp sữa chua mồi mới để bổ sung &ldquo;đội quân&rdquo; vi khuẩn khỏe mạnh.</li>
                        <li><strong>Bước 3:</strong> Đổ ra hũ và ủ ấm lại từ 6 - 8 giờ. Sữa chắc chắn sẽ đông đặc mịn!</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Right Column: Countdown Timer only (5 cols) — Kolb box removed */}
          <div className="lg:col-span-5 bg-white border border-science-dark/20 rounded-none p-6 sm:p-8 flex flex-col justify-center space-y-6">
            
            {/* Timer Screen Visual container */}
            <div className="space-y-4">
              <div className="border-b border-science-dark/20 pb-3 text-center">
                <h3 className="font-mono text-xs font-bold text-science-dark uppercase tracking-widest">
                  ⏰ ĐỒNG HỒ ĐẾM NGƯỢC THẢO LUẬN
                </h3>
                <p className="text-[10px] text-science-dark/70 mt-1">Canh giờ thảo luận của các nhóm thi đua với nhau:</p>
              </div>

              {/* Huge Timer Screen look */}
              <div className="p-8 bg-science-base text-white rounded-none border border-science-dark flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                
                {/* Simulated Digital LED screen backdrop grids */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:12px_12px]" />
                
                <span className="font-mono text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest tabular-nums relative z-10 select-none">
                  {formatTime(timeLeft)}
                </span>

                {/* Progress bar */}
                <div className="w-full bg-[#111111] h-1 rounded-none overflow-hidden relative z-10 border border-neutral-800">
                  <div 
                    className="h-full bg-white transition-all duration-1000"
                    style={{ width: `${(timeLeft / 300) * 100}%` }}
                  />
                </div>

                <span className="font-mono text-[9px] uppercase tracking-widest text-[#A3A3A3] relative z-10">
                  {timeLeft === 0 ? '🚫 Hết giờ thảo luận!' : timerRunning ? '⚡ ĐỒNG HỒ ĐANG CHẠY' : '⏸️ ĐANG TẠM DỪNG'}
                </span>
              </div>

              {/* Timer Control panel */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleStartPause}
                  className={`py-3 px-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    timerRunning
                      ? 'bg-[#B00020] text-white'
                      : 'bg-science-base text-white hover:bg-neutral-800'
                  }`}
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>TẠM DỪNG</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-white" />
                      <span>BẮT ĐẦU ĐẾM</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="py-3 px-4 bg-white text-science-dark border border-science-dark text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#F2F2F2] flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ĐẶT LẠI 5:00</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
