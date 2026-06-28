"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Lightbulb, Maximize, Minimize, Loader2, Gamepad2, BookOpenCheck, ShieldAlert, ThermometerSnowflake, Edit3, Check, X, Send, Heart, Smile, Frown, Meh, Star } from 'lucide-react';
import { AppleEmoji } from '../../../components/shared/AppleEmoji';

interface AccordionItem { id: string; icon: React.ReactNode; question: string; context: string; hints: string[]; answer: string; }

const situationalQuestions: AccordionItem[] = [
  {
    id: 'q-preserve', icon: <ShieldAlert className="w-6 h-6 text-[#FF0000]" />,
    question: 'Tại sao sữa chua phải để tủ lạnh?',
    context: 'Bạn An làm sữa chua rất ngon nhưng quên không cất tủ lạnh 2 ngày. Mở ra thấy sữa bị chảy nước và chua lè.',
    hints: ['Vi khuẩn Lactic ở ngoài trời ấm sẽ tiếp tục sinh sôi và tạo ra quá nhiều axit.', 'Tủ lạnh (2-5°C) giúp vi khuẩn ngủ đông, sữa không bị chua thêm.'],
    answer: 'Tủ lạnh làm chậm sự phát triển của vi khuẩn Lactic, giữ cho sữa chua có vị thanh vừa phải và không bị hỏng.',
  },
  {
    id: 'q-fail', icon: <ThermometerSnowflake className="w-6 h-6 text-[#0000FF]" />,
    question: 'Tại sao mẻ sữa lại lỏng như nước?',
    context: 'Nhóm bạn Bình ủ sữa chua 8 tiếng nhưng mở ra vẫn lỏng toẹt, không hề đông đặc.',
    hints: ['Nếu hòa sữa mồi lúc nước quá nóng (>50°C), vi khuẩn sẽ bị chết bỏng.', 'Nếu ủ bằng nước quá nguội, vi khuẩn sẽ không có đủ độ ấm để sinh sôi.'],
    answer: 'Có thể do nước pha sữa quá nóng làm chết vi khuẩn, hoặc nước ủ quá nguội làm vi khuẩn không hoạt động được.',
  },
];

const DEFAULT_EMBED_URL = 'https://wayground.com/join?gc=10925705&source=liveDashboard';

export default function Assessment() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const [embedUrl, setEmbedUrl] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('lactic_assessment_url') : null) || DEFAULT_EMBED_URL;
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(embedUrl);

  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionNote, setEmotionNote] = useState('');
  const [isSubmittingDiary, setIsSubmittingDiary] = useState(false);
  const [diarySuccess, setDiarySuccess] = useState(false);

  useEffect(() => {
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'assessment' }) }).catch(console.error);
    
    fetch('/api/assessment').then(r => r.json()).then(data => {
      if (data.success && data.submission) {
        const pastAns: Record<string, string> = {};
        const pastSub: Record<string, boolean> = {};
        data.submission.situationalAnswers?.forEach((ans: any) => {
          pastAns[ans.questionId] = ans.studentAnswer;
          pastSub[ans.questionId] = true;
        });
        setStudentAnswers(pastAns);
        setSubmittedAnswers(pastSub);
        if (data.submission.emotion) {
          setSelectedEmotion(data.submission.emotion);
          setEmotionNote(data.submission.emotionNote || '');
          setDiarySuccess(true);
        }
      }
    }).catch(console.error);
  }, []);

  const toggleAccordion = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const toggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const handleSaveUrl = () => {
    setEmbedUrl(tempUrl);
    if (typeof window !== 'undefined') localStorage.setItem('lactic_assessment_url', tempUrl);
    setIsEditingUrl(false); setIframeLoaded(false);
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const ans = studentAnswers[questionId];
    if (!ans || !ans.trim()) { alert("Bé phải nhập câu trả lời đã nhé!"); return; }
    
    setIsSubmittingTask(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situationalAnswers: [{ questionId, studentAnswer: ans }] }),
      });
      if (res.ok) setSubmittedAnswers(prev => ({ ...prev, [questionId]: true }));
    } catch (e) {
      alert("Lỗi mạng rùi, bé thử lại nghen!");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleDiarySubmit = async () => {
    if (!selectedEmotion) { alert("Bé chọn 1 biểu tượng cảm xúc đã nhé!"); return; }
    if (!emotionNote.trim()) { alert("Bé hãy viết vài dòng cảm nhận nữa nha!"); return; }
    
    setIsSubmittingDiary(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion: selectedEmotion, emotionNote }),
      });
      if (res.ok) {
        setDiarySuccess(true);
      }
    } catch (e) {
      alert("Lỗi mạng rùi, bé thử lại nghen!");
    } finally {
      setIsSubmittingDiary(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col p-4 md:p-6 bg-[#00E5FF] font-sans relative">
      
      {/* HEADER */}
      <div className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#FF00FF] text-white font-black text-lg uppercase border-2 border-black flex items-center gap-1">
            <AppleEmoji symbol="🎯" /> Chặng 5
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-black uppercase">
            TRÒ CHƠI <span className="text-[#FF0000]">ÔN TẬP!</span>
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 pb-20">
        
        {/* LEFT COLUMN: Situational Questions + Diary (40%) */}
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            
            {/* Situational Questions Block */}
            <div className="bg-[#FFFF00] border-4 border-black rounded-3xl p-4 shadow-[8px_8px_0px_0px_#FF0000] flex flex-col">
              <div className="flex-none bg-white px-4 py-3 rounded-2xl border-2 border-black mb-4 flex items-center justify-center gap-2 shadow-inner">
                <ShieldAlert className="w-6 h-6 text-[#FF00FF]" />
                <h3 className="font-black text-lg text-black uppercase">PHẢN BIỆN TÌNH HUỐNG</h3>
              </div>

              <div className="space-y-3">
                {situationalQuestions.map((q) => {
                  const isSubbed = submittedAnswers[q.id];
                  return (
                    <div key={q.id} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-sm">
                      <button onClick={() => toggleAccordion(q.id)} className="w-full p-3 flex items-center gap-3 text-left focus:outline-none hover:bg-gray-50">
                        <div className="bg-[#FFFF00] p-2 rounded-full border border-black shrink-0">
                          {isSubbed ? <Check className="w-6 h-6 text-[#00AA00]" /> : q.icon}
                        </div>
                        <div className="flex-1 font-black text-base text-black flex flex-col">
                          <span>{q.question}</span>
                          {isSubbed && <span className="text-xs text-[#00AA00] uppercase mt-1">Đã nộp bài</span>}
                        </div>
                        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openId === q.id ? 'rotate-180 text-[#FF0000]' : 'text-black'}`} />
                      </button>

                      <AnimatePresence>
                        {openId === q.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 pt-1">
                            <div className="border-t-2 border-black pt-3 space-y-3">
                              <p className="font-bold text-gray-700 text-sm leading-relaxed">{q.context}</p>
                              
                              {/* HINTS: Always visible now */}
                              <div className="bg-[#FF00FF] p-3 rounded-xl border-2 border-black text-white shadow-inner">
                                <h4 className="font-black flex items-center gap-1 text-sm mb-1"><Lightbulb className="w-4 h-4"/> GỢI Ý CỦA CÔ:</h4>
                                <ul className="font-bold text-sm list-disc pl-5 space-y-1">
                                  {q.hints.map((h, i) => <li key={i}>{h}</li>)}
                                </ul>
                              </div>

                              {/* Input Form for Student */}
                              <div className="space-y-2">
                                <textarea 
                                  disabled={isSubbed}
                                  placeholder="Theo em thì tại sao nhỉ? Gõ suy nghĩ của em vào đây nhé..."
                                  value={studentAnswers[q.id] || ''}
                                  onChange={(e) => setStudentAnswers({ ...studentAnswers, [q.id]: e.target.value })}
                                  className={`w-full p-3 rounded-xl border-2 font-bold text-sm outline-none resize-none h-24 transition-colors
                                    ${isSubbed ? 'bg-gray-100 border-gray-400 text-gray-600' : 'bg-white border-black focus:bg-[#FFFF00]'}`}
                                />
                                {!isSubbed && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswerSubmit(q.id)}
                                    disabled={isSubmittingTask}
                                    className="w-full py-2 bg-[#00FF00] text-black border-2 border-black rounded-xl font-black text-sm uppercase flex justify-center items-center gap-2 hover:bg-[#00CC00]"
                                  >
                                    {isSubmittingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> NỘP BÀI ĐỂ XEM ĐÁP ÁN</>}
                                  </motion.button>
                                )}
                              </div>

                              {/* Show Answers ONLY if submitted */}
                              {isSubbed && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-4">
                                  <div className="bg-[#00FF00] p-3 rounded-xl border-2 border-black text-black shadow-inner">
                                    <h4 className="font-black flex items-center gap-1 text-sm mb-1"><BookOpenCheck className="w-4 h-4"/> ĐÁP ÁN CHUẨN:</h4>
                                    <p className="font-black text-sm leading-relaxed">{q.answer}</p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MANDATORY DIARY BLOCK */}
            <div className={`border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col transition-all duration-500
              ${diarySuccess ? 'bg-[#00FF00]' : 'bg-[#FF00FF] shadow-[8px_8px_0px_0px_#FFFF00] animate-pulse-slow'}`}
            >
              <div className="bg-white px-4 py-3 rounded-2xl border-2 border-black mb-6 flex items-center justify-center gap-2 shadow-inner">
                <Heart className="w-6 h-6 text-[#FF0000] fill-[#FF0000]" />
                <h3 className="font-black text-lg text-black uppercase">NHẬT KÝ CUỐI BUỔI (BẮT BUỘC)</h3>
              </div>

              {diarySuccess ? (
                <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-black flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#00AA00]" />
                  </div>
                  <h4 className="font-black text-xl text-black uppercase flex items-center justify-center gap-2">ĐÃ GỬI LÊN MÂY! <AppleEmoji symbol="☁️" /></h4>
                  <p className="font-bold text-sm text-gray-800">Cảm ơn bé đã chia sẻ. Hẹn gặp lại nhé!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* EMOTION SELECTION */}
                  <div className="space-y-3">
                    <label className="block font-black text-sm text-white uppercase text-center drop-shadow-md">Bé cảm thấy thế nào sau buổi học?</label>
                    <div className="flex justify-center gap-3">
                      {[
                        { val: 'Vui vẻ', icon: <Smile className="w-8 h-8" />, color: 'bg-[#FFFF00]' },
                        { val: 'Bình thường', icon: <Meh className="w-8 h-8" />, color: 'bg-[#00E5FF]' },
                        { val: 'Khó hiểu', icon: <Frown className="w-8 h-8" />, color: 'bg-[#FF8C00]' },
                      ].map(emo => (
                        <motion.button
                          key={emo.val}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedEmotion(emo.val)}
                          className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-4 transition-colors shadow-sm
                            ${selectedEmotion === emo.val ? `${emo.color} border-black scale-110 shadow-md` : 'bg-white border-gray-300 text-gray-400'}`}
                        >
                          {emo.icon}
                          <span className="font-black text-[10px] uppercase mt-1">{emo.val}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* TEXT NOTE */}
                  <div className="space-y-2">
                    <label className="block font-black text-sm text-white uppercase drop-shadow-md">Viết vài lời nhắn cho Cô nhé:</label>
                    <textarea 
                      placeholder="Hôm nay em thích nhất là..."
                      value={emotionNote}
                      onChange={(e) => setEmotionNote(e.target.value)}
                      className="w-full p-4 rounded-2xl border-4 border-black bg-white focus:bg-[#FFFF00] font-bold text-sm outline-none resize-none h-24 transition-colors"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleDiarySubmit}
                    disabled={isSubmittingDiary}
                    className="w-full py-4 bg-[#FF0000] text-white border-4 border-black rounded-2xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center gap-2 hover:bg-[#CC0000]"
                  >
                    {isSubmittingDiary ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> GỬI LÊN MÂY <AppleEmoji symbol="☁️" /></>}
                  </motion.button>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Minigame iframe (60%) */}
        <div className="w-full md:w-[60%] flex flex-col min-h-[400px]">
          <div ref={gameContainerRef} className="flex-1 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_#0000FF] flex flex-col overflow-hidden">
            
            <div className="flex-none bg-[#FF0000] text-white px-4 py-3 flex items-center justify-between border-b-4 border-black">
              <div className="flex items-center gap-2 sm:gap-3">
                <Gamepad2 className="w-6 h-6 text-[#FFFF00]" />
                <h3 className="font-black text-sm md:text-lg uppercase tracking-widest line-clamp-1">ĐẤU TRƯỜNG WAYGROUND</h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:flex items-center gap-1.5 bg-black px-3 py-1.5 rounded-full border border-white">
                  <span className={`w-2 h-2 rounded-full ${iframeLoaded ? 'bg-[#00FF00]' : 'bg-[#FFFF00] animate-pulse'}`} />
                  <span className="font-black text-[10px] uppercase">{iframeLoaded ? 'SẴN SÀNG' : 'ĐANG TẢI...'}</span>
                </span>
                <button onClick={toggleFullscreen} className="bg-white text-black p-1.5 rounded-full border-2 border-black hover:bg-gray-200">
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-none bg-gray-200 px-4 py-2 border-b-2 border-black flex items-center justify-between">
              {isEditingUrl ? (
                <div className="flex w-full items-center gap-2">
                  <input type="url" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)}
                    className="flex-1 font-bold text-sm px-3 py-1.5 rounded-lg border-2 border-black focus:outline-none focus:bg-[#FFFF00]" />
                  <button onClick={handleSaveUrl} className="bg-[#00FF00] p-1.5 rounded-lg border-2 border-black"><Check className="w-4 h-4" /></button>
                  <button onClick={() => { setTempUrl(embedUrl); setIsEditingUrl(false); }} className="bg-white p-1.5 rounded-lg border-2 border-black"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold text-xs text-gray-600 truncate mr-2">🔗 {embedUrl}</span>
                  <button onClick={() => setIsEditingUrl(true)} className="shrink-0 flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg font-bold uppercase text-[10px] border border-black">
                    <Edit3 className="w-3 h-3" /> Đổi Game
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-black relative flex flex-col">
              <AnimatePresence>
                {!iframeLoaded && (
                  <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-4">
                    <Loader2 className="w-10 h-10 text-[#00FF00] animate-spin" />
                    <p className="font-black text-sm md:text-xl text-white uppercase tracking-widest">Đang tải trò chơi...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <iframe src={embedUrl} title="Wayground Game" className="w-full h-full border-0" allowFullScreen onLoad={() => setIframeLoaded(true)} />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
