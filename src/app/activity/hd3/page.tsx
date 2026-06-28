"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Sparkles, RefreshCcw, Map, X, GitMerge } from 'lucide-react';
import Script from 'next/script';
import { AppleEmoji } from '../../../components/shared/AppleEmoji';

const QUIZ_QUESTIONS = [
  { q: "Sữa chua được tạo ra nhờ vi khuẩn tên là {input}", a: "Lactic" },
  { q: "Vi khuẩn 'ăn' đường tạo ra axit {input}", a: "Lactic" },
  { q: "Việc biến đổi đường thành axit gọi là {input}", a: "Lên men" },
  { q: "Axit làm cho protein bị {input} lại", a: "Đông tụ" },
  { q: "Vi khuẩn Lactic rất tốt cho bụng, được gọi là {input}", a: "Lợi khuẩn" }
];

const WORD_BANK = ["Lactic", "Lên men", "Đông tụ", "Lợi khuẩn"];

export default function ActivityThree() {
  const [quizAnswers, setQuizAnswers] = useState<string[]>(Array(QUIZ_QUESTIONS.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
  // Mindmap State
  const [showMindmap, setShowMindmap] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMindmap(false); };
    if (showMindmap) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMindmap]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = value;
    setQuizAnswers(newAnswers);
    setShowResults(false);
  };

  const submitQuiz = () => {
    let score = 0;
    quizAnswers.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === QUIZ_QUESTIONS[idx].a.toLowerCase()) score++;
    });
    setQuizScore(score);
    setShowResults(true);
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd3' }) }).catch(console.error);
  };

  const handleDragStart = (e: any, word: string) => { e.dataTransfer.setData("text/plain", word); setSelectedWord(word); };
  const handleDrop = (e: any, index: number) => { e.preventDefault(); const word = e.dataTransfer.getData("text/plain"); if (word) { handleAnswerChange(index, word); setSelectedWord(null); } };
  const handleDragOver = (e: any) => e.preventDefault();
  const handleBlankClick = (index: number) => { if (selectedWord) { handleAnswerChange(index, selectedWord); setSelectedWord(null); } else if (quizAnswers[index]) { handleAnswerChange(index, ''); } };

  return (
    <section id="hd3" className="min-h-screen w-full flex flex-col p-4 md:p-6 bg-[#00A300] font-sans relative">
      <Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" type="module" strategy="lazyOnload" />

      {/* HEADER */}
      <div className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#00FF00] text-black font-black text-lg uppercase border-2 border-black flex items-center gap-1">
            <AppleEmoji symbol="🦠" /> Chặng 3 
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-black uppercase">
            SOI VI KHUẨN <span className="text-[#FF0000]">LACTIC!</span>
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 pb-20">
        
        {/* Left Column: 3D Viewer & Mindmap Button (40%) */}
        <div className="w-full md:w-[40%] flex flex-col gap-4 min-h-[300px]">
          
          <div className="flex-1 bg-[#FFFF00] rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-4 flex flex-col relative">
            <div className="flex-none bg-black rounded-full px-4 py-2 flex justify-center items-center text-white mb-3 border-2 border-white">
              <span className="font-black text-lg uppercase flex items-center gap-2">
                <Microscope className="w-5 h-5 text-[#00FF00]" /> RADAR KÍNH HIỂN VI
              </span>
            </div>

            <div className="flex-1 bg-white rounded-2xl overflow-hidden relative border-4 border-black shadow-inner">
              <model-viewer
                src="/models/Meshy_AI_Rod_shaped_Bacteria_E_0606101028_texture.glb"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1.2"
                style={{ width: '100%', height: '100%', outline: 'none' }}
                interaction-prompt="none"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full border-2 border-white pointer-events-none">
                <span className="text-sm font-black flex items-center gap-2 uppercase whitespace-nowrap">
                  <RefreshCcw className="w-4 h-4 text-[#00FF00]" /> Chạm để xoay 3D!
                </span>
              </div>
            </div>
          </div>

          {/* GIANT MINDMAP BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMindmap(true)}
            className="flex-none w-full py-5 bg-[#FF00FF] text-white border-4 border-black rounded-3xl font-black text-xl lg:text-2xl uppercase shadow-[8px_8px_0px_0px_#FFFF00] flex justify-center items-center gap-3 hover:bg-[#CC00CC] animate-pulse-slow"
          >
            <Map className="w-8 h-8 text-[#FFFF00]" /> TỔNG KẾT SƠ ĐỒ TƯ DUY
          </motion.button>

        </div>

        {/* Right Column: Quiz (60%) */}
        <div className="w-full md:w-[60%] flex flex-col">
          <div className="flex-1 bg-white border-4 border-black rounded-3xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#00FF00] flex flex-col">
            
            <div className="flex-none flex items-center mb-4 bg-[#FF0000] rounded-2xl py-3 justify-center border-4 border-black shadow-inner">
              <h3 className="font-black text-xl md:text-2xl text-white flex items-center gap-2 uppercase">
                <Sparkles className="w-6 h-6 text-[#FFFF00]" />
                TRÒ CHƠI KÉO THẢ TỪ VỰNG
              </h3>
            </div>

            {/* Word Bank */}
            <div className="flex-none bg-gray-100 p-4 rounded-2xl border-2 border-gray-400 mb-4 flex flex-col justify-center">
              <p className="text-sm font-black text-gray-500 uppercase mb-2 text-center flex items-center justify-center gap-1"><AppleEmoji symbol="📦" /> KHO TỪ VỰNG (KÉO HOẶC CHẠM)</p>
              <div className="flex flex-wrap justify-center gap-3">
                {WORD_BANK.map((word) => (
                  <motion.div
                    key={word}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word)}
                    onClick={() => setSelectedWord(word === selectedWord ? null : word)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl font-black text-lg border-2 cursor-pointer select-none transition-all shadow-sm
                      ${selectedWord === word ? 'bg-[#FFFF00] border-black text-black scale-105 rotate-2' : 'bg-white border-gray-400 text-blue-700'}
                    `}
                  >
                    {word}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quiz Sentences */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {QUIZ_QUESTIONS.map((item, idx) => {
                const parts = item.q.split('{input}');
                const isCorrect = showResults && quizAnswers[idx].toLowerCase().trim() === item.a.toLowerCase();
                const isWrong = showResults && !isCorrect;

                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border-2 transition-colors ${
                      isCorrect ? 'bg-[#00FF00] border-[#006400]' : isWrong ? 'bg-[#FF0000] border-[#8B0000]' : 'bg-[#F0F8FF] border-blue-300'
                    }`}
                  >
                    <div className="text-base sm:text-lg font-bold text-black leading-snug flex flex-wrap items-center gap-2">
                      <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0 font-black">{idx + 1}</span>
                      <span>{parts[0]}</span>
                      
                      <motion.div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        onClick={() => handleBlankClick(idx)}
                        animate={quizAnswers[idx] ? { scale: [1, 1.05, 1] } : {}}
                        className={`min-w-[100px] min-h-[36px] px-3 py-1 flex items-center justify-center text-center font-black rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                          quizAnswers[idx] 
                            ? 'bg-[#FFFF00] border-black text-black border-solid' 
                            : selectedWord ? 'bg-yellow-100 border-yellow-400 animate-pulse' : 'bg-white border-gray-400 text-gray-400'
                        }`}
                      >
                        {quizAnswers[idx] || "???"}
                      </motion.div>
                      
                      <span>{parts[1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Action */}
            <div className="flex-none mt-4 pt-4 border-t-2 border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitQuiz}
                className="w-full sm:w-auto px-8 py-3 bg-[#0000FF] text-white rounded-2xl font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_#00E5FF] uppercase hover:bg-[#0000CC]"
              >
                <span className="flex items-center gap-2">CHẤM ĐIỂM NGAY! <AppleEmoji symbol="🎯" /></span>
              </motion.button>
              
              <AnimatePresence>
                {showResults && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#FFFF00] border-2 border-black px-4 py-2 rounded-xl text-center w-full sm:w-auto"
                  >
                    <span className="text-lg font-black text-black uppercase">
                      Đúng: <span className="text-2xl text-[#FF0000]">{quizScore}/{QUIZ_QUESTIONS.length}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>

      </div>

      {/* ── MINDMAP MODAL ── */}
      <AnimatePresence>
        {showMindmap && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0000FF]/90 backdrop-blur-md" onClick={() => setShowMindmap(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] border-[6px] border-black shadow-[16px_16px_0px_0px_#FF00FF] z-10 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex-none bg-[#FFFF00] px-6 py-4 flex items-center justify-between border-b-[6px] border-black">
                <h3 className="font-black text-2xl md:text-3xl text-black flex items-center gap-3 uppercase">
                  <GitMerge className="w-8 h-8 text-[#FF0000]" /> SƠ ĐỒ TƯ DUY: BÍ KÍP LÀM SỮA CHUA
                </h3>
                <button onClick={() => setShowMindmap(false)} className="bg-white text-black p-2 rounded-full border-4 border-black hover:bg-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mindmap Canvas */}
              <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#00E5FF] relative custom-scrollbar flex items-start justify-start md:justify-center">
                
                <div className="flex flex-col md:flex-row items-center gap-8 min-w-max pb-16 pt-8 px-4 md:px-16">
                  
                  {/* CENTRAL NODE */}
                  <motion.div 
                    animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4 }}
                    className="relative z-20 bg-[#FF0000] text-white rounded-full border-[8px] border-black shadow-[12px_12px_0px_0px_#000000] w-[220px] h-[220px] flex flex-col justify-center items-center text-center shrink-0"
                  >
                    <h2 className="font-black text-3xl uppercase tracking-wider mb-1 drop-shadow-md">SỮA CHUA</h2>
                    <p className="font-bold text-sm bg-black py-1 px-3 rounded-full border-2 border-white">Sản phẩm lên men</p>
                  </motion.div>

                  {/* RIGHT BRANCHES CONTAINER */}
                  <div className="flex flex-col gap-6 relative shrink-0">
                    
                    {/* Main vertical spine */}
                    <div className="hidden md:block absolute left-[-3rem] top-[10%] bottom-[10%] w-[8px] bg-black z-0"></div>
                    {/* Horizontal connector from center to spine */}
                    <div className="hidden md:block absolute left-[-6rem] top-1/2 w-[3rem] h-[8px] bg-black -translate-y-1/2 z-0"></div>

                    {/* BRANCH 1: NGUYÊN LIỆU */}
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 relative z-10">
                      <div className="hidden md:block absolute left-[-3rem] w-[3rem] h-[6px] bg-black top-1/2 -translate-y-1/2"></div>
                      <div className="bg-[#FFFF00] px-4 py-3 border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] font-black text-lg text-black w-[200px] shrink-0 text-center flex items-center justify-center gap-2">
                        <AppleEmoji symbol="🥛" /> NGUYÊN LIỆU
                      </div>
                      <div className="flex flex-col gap-3 relative">
                        <div className="hidden md:block absolute left-[-1rem] top-[20%] bottom-[20%] w-[4px] bg-black"></div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-100 transition-colors">Sữa tươi / Sữa đặc (Đường)</div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-100 transition-colors">Sữa chua mồi (Vi khuẩn Lactic)</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* BRANCH 2: ĐIỀU KIỆN Ủ */}
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 relative z-10">
                      <div className="hidden md:block absolute left-[-3rem] w-[3rem] h-[6px] bg-black top-1/2 -translate-y-1/2"></div>
                      <div className="bg-[#FF00FF] px-4 py-3 border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] font-black text-lg text-white w-[200px] shrink-0 text-center flex items-center justify-center gap-2">
                        <AppleEmoji symbol="🔥" /> ĐIỀU KIỆN Ủ
                      </div>
                      <div className="flex flex-col gap-3 relative">
                        <div className="hidden md:block absolute left-[-1rem] top-[15%] bottom-[15%] w-[4px] bg-black"></div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-fuchsia-100 transition-colors">Nhiệt độ ấm: 40°C - 45°C</div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-fuchsia-100 transition-colors">Thời gian: 6 đến 8 tiếng</div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-fuchsia-100 transition-colors">Tuyệt đối để yên, KHÔNG xê dịch</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* BRANCH 3: HIỆN TƯỢNG */}
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 relative z-10">
                      <div className="hidden md:block absolute left-[-3rem] w-[3rem] h-[6px] bg-black top-1/2 -translate-y-1/2"></div>
                      <div className="bg-[#00FF00] px-4 py-3 border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] font-black text-lg text-black w-[200px] shrink-0 text-center flex items-center justify-center gap-2">
                        <AppleEmoji symbol="🧪" /> CƠ CHẾ
                      </div>
                      <div className="flex flex-col gap-3 relative">
                        <div className="hidden md:block absolute left-[-1rem] top-[20%] bottom-[20%] w-[4px] bg-black"></div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-green-100 transition-colors">Lactic "ăn" đường ➡️ Axit Lactic</div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-green-100 transition-colors">Protein bị chua ➡️ Sữa đông tụ (đặc)</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* BRANCH 4: LỢI ÍCH */}
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 relative z-10">
                      <div className="hidden md:block absolute left-[-3rem] w-[3rem] h-[6px] bg-black top-1/2 -translate-y-1/2"></div>
                      <div className="bg-[#FF8C00] px-4 py-3 border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] font-black text-lg text-white w-[200px] shrink-0 text-center flex items-center justify-center gap-2">
                        <AppleEmoji symbol="⭐" /> LỢI ÍCH
                      </div>
                      <div className="flex flex-col gap-3 relative">
                        <div className="hidden md:block absolute left-[-1rem] top-[20%] bottom-[20%] w-[4px] bg-black"></div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-orange-100 transition-colors">Vị chua ngọt thơm ngon</div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="hidden md:block absolute left-[-1rem] w-[1rem] h-[4px] bg-black top-1/2 -translate-y-1/2"></div>
                          <div className="bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-sm hover:bg-orange-100 transition-colors">Bổ sung "Lợi khuẩn" bảo vệ đường ruột</div>
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
