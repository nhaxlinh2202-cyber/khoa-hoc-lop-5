"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Sparkles, RefreshCcw, Map, X, GitMerge } from 'lucide-react';
import Script from 'next/script';

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
          <div className="px-4 py-1.5 rounded-full bg-[#00FF00] text-black font-black text-lg uppercase border-2 border-black">
            🦠 Chặng 3 
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-black uppercase hidden sm:block">
            SOI VI KHUẨN <span className="text-[#FF0000]">LACTIC!</span>
          </h2>
        </div>

        {/* MINDMAP BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMindmap(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF00FF] text-white border-4 border-black rounded-xl font-black text-sm md:text-base uppercase shadow-[4px_4px_0px_0px_#000000] hover:bg-[#CC00CC]"
        >
          <Map className="w-5 h-5 text-[#FFFF00]" /> SƠ ĐỒ TƯ DUY
        </motion.button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 pb-20">
        
        {/* Left Column: 3D Viewer (40%) */}
        <div className="w-full md:w-[40%] flex flex-col min-h-[300px]">
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
              <p className="text-sm font-black text-gray-500 uppercase mb-2 text-center">📦 KHO TỪ VỰNG (KÉO HOẶC CHẠM)</p>
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
                CHẤM ĐIỂM NGAY! 🎯
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
              className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] border-[6px] border-black shadow-[16px_16px_0px_0px_#FF00FF] z-10 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex-none bg-[#FFFF00] px-6 py-4 flex items-center justify-between border-b-[6px] border-black">
                <h3 className="font-black text-2xl md:text-3xl text-black flex items-center gap-3 uppercase">
                  <GitMerge className="w-8 h-8 text-[#FF0000]" /> SƠ ĐỒ TƯ DUY: LÀM SỮA CHUA
                </h3>
                <button onClick={() => setShowMindmap(false)} className="bg-white text-black p-2 rounded-full border-4 border-black hover:bg-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mindmap Canvas */}
              <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#00E5FF] relative custom-scrollbar flex items-center justify-center">
                
                {/* CSS Grid/Flex based Mindmap */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 min-w-max pb-8 pt-8">
                  
                  {/* CENTRAL NODE */}
                  <div className="relative z-10 bg-[#FF0000] text-white p-6 rounded-[3rem] border-[6px] border-black shadow-[8px_8px_0px_0px_#000000] max-w-[250px] text-center">
                    <h2 className="font-black text-3xl uppercase tracking-wider mb-2 drop-shadow-md">SỮA CHUA</h2>
                    <p className="font-bold text-sm bg-black/20 py-1 px-3 rounded-full">Sản phẩm lên men</p>
                  </div>

                  {/* BRANCHES CONTAINER */}
                  <div className="flex flex-col gap-8 md:gap-12 relative">
                    
                    {/* Connecting lines for desktop (hidden on mobile for simplicity) */}
                    <div className="hidden md:block absolute top-1/2 left-[-4rem] w-[4rem] h-[6px] bg-black -translate-y-1/2 z-0"></div>
                    <div className="hidden md:block absolute top-[15%] bottom-[15%] left-[-4rem] w-[6px] bg-black z-0"></div>
                    <div className="hidden md:block absolute top-[15%] left-[-4rem] w-[4rem] h-[6px] bg-black z-0"></div>
                    <div className="hidden md:block absolute bottom-[15%] left-[-4rem] w-[4rem] h-[6px] bg-black z-0"></div>

                    {/* TOP BRANCH: Nguyên liệu */}
                    <motion.div whileHover={{ scale: 1.05 }} className="relative z-10 flex items-center gap-4">
                      <div className="hidden md:block w-8 h-[6px] bg-black"></div>
                      <div className="bg-[#FFFF00] p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_#000000] w-[260px]">
                        <h4 className="font-black text-xl text-black uppercase border-b-4 border-black pb-2 mb-2 flex items-center gap-2">
                          🥛 NGUYÊN LIỆU
                        </h4>
                        <ul className="font-bold text-black text-sm space-y-2">
                          <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF00FF] rounded-full border-2 border-black" />Sữa bò tươi/đặc (Đường)</li>
                          <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF00FF] rounded-full border-2 border-black" />Sữa mồi (Vi khuẩn Lactic)</li>
                        </ul>
                      </div>
                    </motion.div>

                    {/* MIDDLE BRANCH: Quá trình */}
                    <motion.div whileHover={{ scale: 1.05 }} className="relative z-10 flex items-center gap-4">
                      <div className="hidden md:block w-8 h-[6px] bg-black"></div>
                      <div className="bg-[#FF00FF] p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_#000000] w-[260px] text-white">
                        <h4 className="font-black text-xl uppercase border-b-4 border-white pb-2 mb-2 flex items-center gap-2">
                          🔥 QUÁ TRÌNH Ủ
                        </h4>
                        <ul className="font-bold text-sm space-y-2">
                          <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFFF00] rounded-full border-2 border-black" />Nhiệt độ: 40-45°C (Ấm)</li>
                          <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFFF00] rounded-full border-2 border-black" />Thời gian: 6-8 tiếng</li>
                          <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFFF00] rounded-full border-2 border-black" />Tuyệt đối KHÔNG động đậy</li>
                        </ul>
                      </div>
                    </motion.div>

                    {/* BOTTOM BRANCH: Hiện tượng */}
                    <motion.div whileHover={{ scale: 1.05 }} className="relative z-10 flex items-center gap-4">
                      <div className="hidden md:block w-8 h-[6px] bg-black"></div>
                      <div className="bg-[#00FF00] p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_#000000] w-[260px] text-black">
                        <h4 className="font-black text-xl uppercase border-b-4 border-black pb-2 mb-2 flex items-center gap-2">
                          🧪 KẾT QUẢ CỦA LÊN MEN
                        </h4>
                        <ul className="font-bold text-sm space-y-2">
                          <li className="flex items-start gap-2 leading-tight"><div className="w-3 h-3 bg-[#0000FF] rounded-full border-2 border-black shrink-0 mt-0.5" />Vi khuẩn Lactic 'ăn' Đường sinh ra Axit</li>
                          <li className="flex items-start gap-2 leading-tight"><div className="w-3 h-3 bg-[#0000FF] rounded-full border-2 border-black shrink-0 mt-0.5" />Axit làm Protein bị đông tụ (đặc lại)</li>
                          <li className="flex items-start gap-2 leading-tight"><div className="w-3 h-3 bg-[#0000FF] rounded-full border-2 border-black shrink-0 mt-0.5" />Rất tốt cho hệ tiêu hóa (Lợi khuẩn)</li>
                        </ul>
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
