"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Play, Pause, RotateCcw, AlertTriangle, FileSearch, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

const WORDS = ['Lactic', 'Lactose', 'Axit Lactic', '40°C', '50°C'];

export default function TrongLopT2Page() {
  const router = useRouter();

  // Đục lỗ State
  const [blanks, setBlanks] = useState<string[]>(['', '', '', '', '']);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [showResultPopup, setShowResultPopup] = useState<'success' | 'error' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [answerPopup, setAnswerPopup] = useState<'suachua' | 'duamuoi' | null>(null);

  // Drag state cho Timer Popup
  const [timerPos, setTimerPos] = useState({ x: 0, y: 0 });
  const [isDraggingTimer, setIsDraggingTimer] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Drag state cho Timer Button tròn
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isDraggingBtn, setIsDraggingBtn] = useState(false);
  const [dragStartBtn, setDragStartBtn] = useState({ x: 0, y: 0 });
  const [hasMovedBtn, setHasMovedBtn] = useState(false);

  const checkAnswer = () => {
    if (blanks.some(b => !b)) {
      setShowResultPopup('error');
      return;
    }
    const isCorrect = blanks.every((b, i) => b === WORDS[i]);
    if (isCorrect) {
      setShowResultPopup('success');
      setShowConfetti(true);
    } else {
      setShowResultPopup('error');
    }
  };

  // Pagination State
  const [currentActivity, setCurrentActivity] = useState<number>(1);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here if needed
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(15 * 60); };
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDrop = (idx: number) => {
    if (draggedWord) {
      const newBlanks = [...blanks];
      newBlanks[idx] = draggedWord;
      setBlanks(newBlanks);
      setDraggedWord(null);
    }
  };

  const completeLesson = async () => {
    await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepKey: 'trong-lop-t2' })
    });
    router.push('/home');
  };

  return (
    <div className="w-full h-screen bg-[#FFFF00] flex items-center justify-center p-2 sm:p-4 font-display overflow-hidden">
      {showConfetti && <div className="fixed inset-0 z-[9999] pointer-events-none"><Confetti width={typeof window !== 'undefined' ? window.innerWidth : 1000} height={typeof window !== 'undefined' ? window.innerHeight : 1000} /></div>}
      
      {/* POPUP THÀNH CÔNG */}
      {showResultPopup === 'success' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border-8 border-green-500 rounded-[3rem] p-10 max-w-2xl w-full mx-4 flex flex-col items-center justify-center text-center shadow-[12px_12px_0px_0px_#22c55e] animate-in zoom-in-50 duration-500">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl md:text-5xl font-black text-green-600 mb-4 uppercase drop-shadow-md">Tuyệt Vời!</h2>
            <p className="text-2xl font-bold text-gray-700 mb-8">Bạn đã điền chính xác toàn bộ quy trình lên men sữa chua!</p>
            <button 
              onClick={() => { setShowResultPopup(null); setShowConfetti(false); }} 
              className="px-10 py-4 bg-green-500 text-white border-4 border-black rounded-2xl font-black text-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-2 transition-transform"
            >
              TIẾP TỤC
            </button>
          </div>
        </div>
      )}

      {/* POPUP THẤT BẠI */}
      {showResultPopup === 'error' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border-8 border-red-500 rounded-[3rem] p-10 max-w-2xl w-full mx-4 flex flex-col items-center justify-center text-center shadow-[12px_12px_0px_0px_#ef4444] animate-pulse">
            <div className="text-8xl mb-6">🤔</div>
            <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4 uppercase drop-shadow-md">Chưa chính xác!</h2>
            <p className="text-2xl font-bold text-gray-700 mb-8">Hình như có chỗ nào đó bị nhầm hoặc chưa điền hết. Bạn kiểm tra lại nhé!</p>
            <button 
              onClick={() => setShowResultPopup(null)} 
              className="px-10 py-4 bg-red-500 text-white border-4 border-black rounded-2xl font-black text-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-2 transition-transform"
            >
              THỬ LẠI NÀO
            </button>
          </div>
        </div>
      )}

      {/* POPUP ĐÁP ÁN */}
      {answerPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${answerPopup === 'suachua' ? 'bg-[#FF3366]' : 'bg-[#4ade80]'} border-8 border-black rounded-[3rem] p-6 md:p-10 max-w-3xl w-full mx-4 flex flex-col shadow-[12px_12px_0px_0px_#000000] relative animate-in zoom-in-50 duration-500`}>
            <button 
              onClick={() => setAnswerPopup(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 border-4 border-black rounded-full flex items-center justify-center text-white font-black text-2xl hover:scale-110 shadow-[4px_4px_0px_0px_#000000]"
            >
              X
            </button>
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 flex items-center gap-2 text-white drop-shadow-md">
              {answerPopup === 'suachua' ? '🥛 ĐÁP ÁN: SỮA CHUA' : '🥒 ĐÁP ÁN: DƯA MUỐI'}
            </h2>
            
            <div className="bg-white border-4 border-black rounded-2xl p-6 text-sm md:text-xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              {answerPopup === 'suachua' ? (
                <>
                  <p className="flex items-start gap-2">🔥 <span><span className="text-red-600 font-black">Đổ men lúc đun sôi:</span> Vi khuẩn Lactic chết hết ➡️ Sữa không chua, thất bại.</span></p>
                  <p className="flex items-start gap-2">🥶 <span><span className="text-red-600 font-black">Quên ủ ấm:</span> Thiếu nhiệt độ lý tưởng (40-50°C) ➡️ Vi khuẩn sinh sôi rất chậm.</span></p>
                  <p className="flex items-start gap-2">❄️ <span><span className="text-blue-600 font-black">Mở rộng:</span> Bỏ tủ lạnh giúp kìm hãm vi khuẩn, sữa không bị chua thêm và bảo quản được lâu.</span></p>
                </>
              ) : (
                <>
                  <p className="flex items-start gap-2">🍬 <span><span className="text-green-700 font-black">Cho thêm đường:</span> Cung cấp thêm thức ăn ➡️ vi khuẩn tăng số lượng nhanh chóng, dưa mau chua.</span></p>
                  <p className="flex items-start gap-2">🔥 <span><span className="text-green-700 font-black">Nước ấm, gần bếp:</span> Tạo nhiệt độ ấm áp lý tưởng giúp vi khuẩn hoạt động mạnh trong mùa đông.</span></p>
                  <p className="flex items-start gap-2">🥗 <span><span className="text-green-700 font-black">Rau củ khác:</span> Có thể muối chua su hào, bắp cải, cải bẹ, rau cần, quả sung, cà rốt...</span></p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP TIMER ĐẾM NGƯỢC (DRAGGABLE) */}
      {showTimerPopup && (
        <div 
          className="fixed z-[1100] cursor-grab active:cursor-grabbing border-4 border-black rounded-[2rem] bg-[#00E5FF]/80 backdrop-blur-md p-4 md:p-6 flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] select-none"
          style={{ 
            top: '20px', 
            left: '50%', 
            transform: `translate(calc(-50% + ${timerPos.x}px), ${timerPos.y}px)`,
            touchAction: 'none'
          }}
          onPointerDown={(e) => {
            setIsDraggingTimer(true);
            setDragStart({ x: e.clientX - timerPos.x, y: e.clientY - timerPos.y });
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (isDraggingTimer) {
              setTimerPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
            }
          }}
          onPointerUp={(e) => {
            setIsDraggingTimer(false);
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={(e) => {
            setIsDraggingTimer(false);
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          }}
        >
          <button 
            onClick={() => setShowTimerPopup(false)}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-white font-black hover:scale-110 shadow-[2px_2px_0px_0px_#000000] z-50 cursor-pointer text-sm md:text-base"
          >
            X
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-black" />
            <span className="font-black text-black uppercase text-xs md:text-sm tracking-widest">Đếm ngược</span>
          </div>
          
          <div className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-white border-4 border-black px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000000] ${timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={toggleTimer} 
              onPointerDown={(e) => e.stopPropagation()}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-black flex items-center justify-center text-white ${isActive ? 'bg-[#FF00FF] hover:bg-pink-600' : 'bg-[#00FF00] hover:bg-green-600'} shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform`}
            >
              {isActive ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={resetTimer} 
              onPointerDown={(e) => e.stopPropagation()}
              className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full border-4 border-black flex items-center justify-center hover:bg-white shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform"
            >
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
          </div>
        </div>
      )}

      <div 
        className="w-full bg-white border-4 md:border-8 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col relative overflow-hidden"
        style={{ aspectRatio: '16/9', maxHeight: '100%', maxWidth: 'calc(100vh * 16 / 9)' }}
      >
        {/* APP TOOLBAR */}
        <header className="flex-none p-3 md:p-6 border-b-4 border-black bg-gray-50 flex items-center justify-between z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/home')} className="w-10 h-10 md:w-12 md:h-12 bg-white border-4 border-black rounded-full flex items-center justify-center hover:scale-105 shadow-[4px_4px_0px_0px_#000000] shrink-0">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black uppercase text-black truncate hidden sm:block">GIAI ĐOẠN 2: TIẾT 2 🥛</h1>
          </div>
          
          {/* TABS CHUYỂN HOẠT ĐỘNG */}
          <div className="flex gap-2 md:gap-4">
            {[1, 2].map(act => (
              <button 
                key={act}
                onClick={() => setCurrentActivity(act)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-4 font-black text-xl transition-transform flex items-center justify-center ${currentActivity === act ? 'bg-[#FF00FF] text-white border-black scale-110 shadow-[4px_4px_0px_0px_#000000]' : 'bg-gray-200 border-gray-400 text-gray-500 hover:scale-105'}`}
              >
                {act}
              </button>
            ))}
          </div>
          
          <button onClick={completeLesson} className="px-4 py-2 md:px-6 md:py-3 bg-[#00FF00] border-4 border-black rounded-xl font-black text-sm md:text-base shadow-[4px_4px_0px_0px_#000000] hover:translate-y-1 hover:shadow-none hidden lg:block shrink-0">
            HOÀN THÀNH
          </button>
        </header>

        {/* WORKSPACE - Khu vực nội dung sẽ chiếm trọn khoảng trống */}
        <main className="flex-1 min-h-0 bg-gray-50 relative overflow-hidden p-3 md:p-6">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
        
        {/* HOẠT ĐỘNG 1: ĐIỀN TỪ ĐỤC LỖ */}
        {currentActivity === 1 && (
        <section className="flex-1 bg-white border-4 md:border-8 border-black p-4 md:p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between max-h-full overflow-hidden">
          <div className="flex-none flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-3xl font-black uppercase text-[#FF00FF] drop-shadow-sm flex items-center gap-2">
                <span className="text-3xl md:text-4xl">🧩</span> ĐIỀN TỪ VÀO CHỖ TRỐNG
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={checkAnswer} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#00FF00] border-4 border-black rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> KIỂM TRA
              </button>
              <button onClick={() => { setBlanks(['', '', '', '', '']); setShowResultPopup(null); }} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#00E5FF] border-4 border-black rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform flex items-center gap-2">
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" /> LÀM LẠI
              </button>
            </div>
          </div>

          <div className="flex-none flex flex-wrap gap-2 md:gap-3 justify-center mb-3 md:mb-4 bg-gray-100 p-3 md:p-4 rounded-xl md:rounded-[2rem] border-4 border-dashed border-gray-400">
            {WORDS.filter(w => !blanks.includes(w)).map(word => (
              <div 
                key={word} draggable onDragStart={() => setDraggedWord(word)}
                className="bg-[#FFFF00] border-2 md:border-4 border-black px-4 md:px-6 py-1 md:py-2 rounded-xl md:rounded-2xl font-black text-lg md:text-xl cursor-grab active:cursor-grabbing shadow-[2px_2px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 md:hover:-translate-y-2 transition-transform"
              >
                {word}
              </div>
            ))}
            {WORDS.filter(w => !blanks.includes(w)).length === 0 && (
              <div className="text-base md:text-lg font-black text-gray-400 uppercase tracking-widest">Đã dùng hết thẻ từ!</div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center text-lg md:text-2xl lg:text-3xl leading-loose md:leading-[3.5rem] font-bold text-gray-800 bg-blue-50/50 p-4 md:p-6 rounded-xl md:rounded-[2rem] border-4 border-blue-200">
            <span>
              Vi khuẩn <span onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(0)} className={`inline-flex items-center justify-center min-w-[100px] md:min-w-[140px] h-8 md:h-12 align-middle mx-1 md:mx-2 rounded-lg md:rounded-xl border-4 ${blanks[0] ? 'border-black bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_#000000] font-black text-base md:text-2xl' : 'border-dashed border-gray-400 bg-gray-100'} text-center leading-none`}>{blanks[0]}</span> 
              phân giải đường <span onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(1)} className={`inline-flex items-center justify-center min-w-[100px] md:min-w-[140px] h-8 md:h-12 align-middle mx-1 md:mx-2 rounded-lg md:rounded-xl border-4 ${blanks[1] ? 'border-black bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_#000000] font-black text-base md:text-2xl' : 'border-dashed border-gray-400 bg-gray-100'} text-center leading-none`}>{blanks[1]}</span> 
              có trong sữa thành <span onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(2)} className={`inline-flex items-center justify-center min-w-[100px] md:min-w-[140px] h-8 md:h-12 align-middle mx-1 md:mx-2 rounded-lg md:rounded-xl border-4 ${blanks[2] ? 'border-black bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_#000000] font-black text-base md:text-2xl' : 'border-dashed border-gray-400 bg-gray-100'} text-center leading-none`}>{blanks[2]}</span>, 
              làm cho sữa chua có vị chua. Cần ủ sữa ở nhiệt độ từ <span onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(3)} className={`inline-flex items-center justify-center min-w-[70px] md:min-w-[90px] h-8 md:h-12 align-middle mx-1 md:mx-2 rounded-lg md:rounded-xl border-4 ${blanks[3] ? 'border-black bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_#000000] font-black text-base md:text-2xl' : 'border-dashed border-gray-400 bg-gray-100'} text-center leading-none`}>{blanks[3]}</span> 
              đến <span onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(4)} className={`inline-flex items-center justify-center min-w-[70px] md:min-w-[90px] h-8 md:h-12 align-middle mx-1 md:mx-2 rounded-lg md:rounded-xl border-4 ${blanks[4] ? 'border-black bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_#000000] font-black text-base md:text-2xl' : 'border-dashed border-gray-400 bg-gray-100'} text-center leading-none`}>{blanks[4]}</span> 
              để vi khuẩn phát triển tốt nhất.
            </span>
          </div>
        </section>
        )}

        {/* HOẠT ĐỘNG 2 - CHIA NHÓM THẢO LUẬN */}
        {currentActivity === 2 && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full min-h-0 max-h-full relative">
            
            {/* NHÓM 1 - SỮA CHUA */}
            <section className="bg-[#FF3366] text-white border-4 border-black p-4 md:p-6 rounded-[1.5rem] shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 opacity-20"><AlertTriangle className="w-48 h-48 md:w-64 md:h-64 text-black" /></div>
              
              <div className="relative z-10 flex flex-col gap-3 md:gap-5 flex-grow justify-center">
                <h2 className="text-lg md:text-xl font-black uppercase text-white drop-shadow-md flex items-center gap-1 md:gap-2">
                  <span className="text-2xl md:text-3xl">🥛</span> CẤP CỨU MẺ SỮA CHUA!
                </h2>
                
                <div className="bg-white text-black p-3 md:p-4 rounded-xl font-bold text-xs md:text-sm leading-relaxed border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_#000000]">
                  "Nam đun sôi sữa tươi rồi <span className="bg-red-200 px-1 rounded-lg text-red-700">đổ men vào ngay</span>. Nam để cốc sữa <span className="bg-red-200 px-1 rounded-lg text-red-700">mở nắp</span> trên bàn và <span className="bg-red-200 px-1 rounded-lg text-red-700">quên không ủ ấm</span>. Sữa chua hỏng!"
                </div>

                <div className="bg-[#FFFF00] border-2 md:border-4 border-black p-2 md:p-3 rounded-xl shadow-[2px_2px_0px_0px_#000000]">
                  <p className="font-black text-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-1 md:gap-2 text-center">
                    <span className="text-lg md:text-xl">🚨</span> NHIỆM VỤ: TÌM NGUYÊN NHÂN & CÁCH KHẮC PHỤC
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-4 md:mt-6">
                <div className="flex justify-between items-center mb-1.5 pl-1">
                  <h3 className="font-black text-white text-xs md:text-sm uppercase tracking-widest drop-shadow-md">💡 Câu hỏi gợi ý:</h3>
                  <button 
                    onClick={() => setAnswerPopup('suachua')} 
                    className="bg-white text-black px-2 py-1 rounded-lg text-[10px] md:text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-200 hover:-translate-y-0.5 transition-transform"
                  >
                    👁️ XEM ĐÁP ÁN
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                  <div className="bg-black/20 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">🔥</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Đun sôi sữa, bỏ men vào ngay thì vi khuẩn ra sao?</p>
                  </div>
                  <div className="bg-black/20 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">💨</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Để hở nắp cốc khiến không khí tràn vào gây hại gì?</p>
                  </div>
                  <div className="bg-black/20 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">🥶</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Quên ủ ấm (40-50°C), men có hoạt động được không?</p>
                  </div>
                </div>
              </div>
            </section>

            {/* NHÓM 2 - DƯA MUỐI */}
            <section className="bg-[#4ade80] text-black border-4 border-black p-4 md:p-6 rounded-[1.5rem] shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 opacity-20"><FileSearch className="w-48 h-48 md:w-64 md:h-64 text-black" /></div>
              
              <div className="relative z-10 flex flex-col gap-3 md:gap-5 flex-grow justify-center">
                <h2 className="text-lg md:text-xl font-black uppercase text-white drop-shadow-md flex items-center gap-1 md:gap-2">
                  <span className="text-2xl md:text-3xl">🥒</span> BÍ KÍP DƯA MUỐI BẤT BẠI
                </h2>
                
                <div className="bg-white text-black p-3 md:p-4 rounded-xl font-bold text-xs md:text-sm leading-relaxed border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_#000000]">
                  "Mẹ dạy Lan muối dưa. Mẹ pha nước ấm với muối, xúc thêm <span className="bg-green-200 px-1 rounded-lg text-green-700">thìa đường</span>. Xong xuôi, đem lọ dưa <span className="bg-green-200 px-1 rounded-lg text-green-700">đặt cẩn thận cạnh bếp lò</span>."
                </div>

                <div className="bg-[#FFFF00] border-2 md:border-4 border-black p-2 md:p-3 rounded-xl shadow-[2px_2px_0px_0px_#000000]">
                  <p className="font-black text-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-1 md:gap-2 text-center">
                    <span className="text-lg md:text-xl">🕵️</span> NHIỆM VỤ: GIẢI MÃ CÁC BƯỚC MUỐI DƯA
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-4 md:mt-6">
                <div className="flex justify-between items-center mb-1.5 pl-1">
                  <h3 className="font-black text-white text-xs md:text-sm uppercase tracking-widest drop-shadow-md">💡 Câu hỏi gợi ý:</h3>
                  <button 
                    onClick={() => setAnswerPopup('duamuoi')} 
                    className="bg-white text-black px-2 py-1 rounded-lg text-[10px] md:text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-200 hover:-translate-y-0.5 transition-transform"
                  >
                    👁️ XEM ĐÁP ÁN
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                  <div className="bg-white/40 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">🍬</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Vì sao mẹ lại cho thêm đường khi muối chua?</p>
                  </div>
                  <div className="bg-white/40 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">🔥</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Trời lạnh, để dưa gần bếp & dùng nước ấm để làm gì?</p>
                  </div>
                  <div className="bg-white/40 border-2 border-black rounded-xl p-1.5 md:p-2 flex flex-col items-center text-center justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="text-xl md:text-2xl mb-0.5">🥗</div>
                    <p className="font-bold text-[9px] md:text-[11px] leading-tight">Kể thêm các loại rau củ quả khác có thể muối chua?</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FLOATING TIMER BUTTON */}
            <button 
              onClick={() => {
                if (!hasMovedBtn) setShowTimerPopup(true);
              }}
              onPointerDown={(e) => {
                setIsDraggingBtn(true);
                setHasMovedBtn(false);
                setDragStartBtn({ x: e.clientX - btnPos.x, y: e.clientY - btnPos.y });
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (isDraggingBtn) {
                  // Chỉ coi là drag khi di chuyển một khoảng nhất định để tránh nhầm với click
                  if (Math.abs(e.clientX - dragStartBtn.x - btnPos.x) > 3 || Math.abs(e.clientY - dragStartBtn.y - btnPos.y) > 3) {
                    setHasMovedBtn(true);
                  }
                  setBtnPos({ x: e.clientX - dragStartBtn.x, y: e.clientY - dragStartBtn.y });
                }
              }}
              onPointerUp={(e) => {
                setIsDraggingBtn(false);
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }}
              onPointerCancel={(e) => {
                setIsDraggingBtn(false);
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }}
              style={{ 
                transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                touchAction: 'none'
              }}
              className={`absolute bottom-4 right-4 w-14 h-14 md:w-16 md:h-16 bg-[#00E5FF]/50 backdrop-blur-md border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-[100] group cursor-grab active:cursor-grabbing hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] ${hasMovedBtn || isDraggingBtn ? '' : 'hover:-translate-y-1 transition-all'}`}
            >
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-black group-hover:animate-spin" />
            </button>
          </div>
        )}

          </div>
        </main>
      </div>
    </div>
  );
}
