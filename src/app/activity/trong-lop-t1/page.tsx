"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Check, RefreshCcw, Dices, User, ArrowRight, ArrowDown, BookOpen, X } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const FRIDGE_ITEMS = [
  { id: 'sua-chua', name: 'Sữa chua', emoji: '🥛', color: 'bg-white text-black', image: '/images/sua-chua.jpg' },
  { id: 'dua-muoi', name: 'Dưa muối', emoji: '🥬', color: 'bg-[#00FF00] text-black', image: '/images/dua-muoi.jpg' },
  { id: 'kim-chi', name: 'Kim chi', emoji: '🌶️', color: 'bg-[#FF0000] text-white', image: '/images/kim-chi.jpg' },
  { id: 'sung-muoi', name: 'Sung muối', emoji: '🫒', color: 'bg-[#8FBC8F] text-black', image: '/images/sung-muoi.jpg' },
  { id: 'ca-muoi', name: 'Cà pháo muối', emoji: '🍆', color: 'bg-[#E6E6FA] text-black', image: '/images/ca-phao.png' },
];

const PICKLE_STEPS = [
  { id: 'p1', text: 'Rửa sạch, phơi héo rau củ', type: 'pickle' },
  { id: 'p2', text: 'Pha nước ấm pha muối và một chút đường', type: 'pickle' },
  { id: 'p3', text: 'Xếp vào hũ, nén chặt và đậy thật kín', type: 'pickle' },
  { id: 'p4', text: 'Vi khuẩn Lactic hoạt động tạo vị chua', type: 'pickle' }
];

const YOGURT_STEPS = [
  { id: 'y1', text: 'Pha sữa chua cái vào sữa tươi ấm', type: 'yogurt' },
  { id: 'y2', text: 'Múc vào hũ, đậy nắp thật kín', type: 'yogurt' },
  { id: 'y3', text: 'Ủ ấm (40-45°C) trong 6-8 tiếng', type: 'yogurt' },
  { id: 'y4', text: 'Vi khuẩn Lactic lên men tạo độ chua và sệt', type: 'yogurt' }
];

const getEmoji = (name: string) => {
  const map: Record<string, string> = {
    'sữa chua': '🥛',
    'dưa': '🥬',
    'kim chi': '🌶️',
    'sung': '🫒',
    'cà pháo': '🍆',
    'cà': '🍆'
  };
  const lowerName = name.toLowerCase();
  for (const key in map) {
    if (lowerName.includes(key)) return map[key];
  }
  return '🥣';
};

export default function TrongLopT1Page() {
  const router = useRouter();
  
  // X-Ray State
  const [showXRay, setShowXRay] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // Random Picker State
  const [diaries, setDiaries] = useState<any[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<any | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);

  const [currentActivity, setCurrentActivity] = useState<number>(1);
  const [showConclusion, setShowConclusion] = useState(false);

  useEffect(() => {
    // Tải thư viện 3D
    import('@google/model-viewer').catch(console.error);

    fetch('/api/pre-class-diary')
      .then(res => res.json())
      .then(data => {
        if (data.diaries && data.diaries.length > 0) {
          setDiaries(data.diaries);
        } else {
          // Fallback data
          setDiaries([
            { id: 'f1', studentName: 'Bạn Mẫu A', foodName: 'Sữa chua nha đam', type: 'THUC_TE', color: 'Trắng đục', state: 'Sền sệt' },
            { id: 'f2', studentName: 'Bạn Mẫu B', foodName: 'Dưa cải chua', type: 'TU_LANH', reason: 'Vì em thấy nó rất chua và giòn' },
            { id: 'f3', studentName: 'Bạn Mẫu C', foodName: 'Kim chi Hàn Quốc', type: 'THUC_TE', color: 'Đỏ cam', state: 'Mềm, nhiều nước' },
          ]);
        }
      });
      
    // Fix Hydration: Xáo trộn mảng ở Client-side sau khi giao diện đã dựng xong
    setPickleBank([...PICKLE_STEPS].sort(() => Math.random() - 0.5));
    setYogurtBank([...YOGURT_STEPS].sort(() => Math.random() - 0.5));
  }, []);

  const handleSpin = () => {
    if (diaries.length === 0) return;
    setIsSpinning(true);
    setShowXRay(false);
    setZoomed(false);
    
    let spins = 0;
    const maxSpins = 30; // Quay 3 giây
    const interval = setInterval(() => {
      setSpinIndex(Math.floor(Math.random() * diaries.length));
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const winner = diaries[Math.floor(Math.random() * diaries.length)];
        setSelectedDiary(winner);
      }
    }, 100);
  };

  // Drag Drop Muối Dưa & Sữa Chua State (Tabs)
  const [activeTab, setActiveTab] = useState<'pickle' | 'yogurt'>('pickle');
  const [pickleSlots, setPickleSlots] = useState<any[]>([null, null, null, null]);
  const [yogurtSlots, setYogurtSlots] = useState<any[]>([null, null, null, null]);
  const [pickleBank, setPickleBank] = useState<any[]>([]);
  const [yogurtBank, setYogurtBank] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<{ source: 'bank' | 'slot', index: number } | null>(null);
  
  // Drag Drop Dinh Dưỡng
  const NUTRITIONS = ['Canxi 🦴', 'Protein 💪', 'Đường Lactose 🍬', 'Lợi khuẩn Lactic 🦠'];
  const [milkNutrients, setMilkNutrients] = useState<string[]>([]);
  const [yogurtNutrients, setYogurtNutrients] = useState<string[]>([]);
  const [draggedNutrient, setDraggedNutrient] = useState<string | null>(null);

  const handleDragStart = (source: 'bank' | 'slot', index: number) => {
    setDraggedItem({ source, index });
  };

  const handleDropOnSlot = (slotIndex: number) => {
    if (!draggedItem) return;
    
    const isPickle = activeTab === 'pickle';
    const slots = isPickle ? [...pickleSlots] : [...yogurtSlots];
    const bank = isPickle ? [...pickleBank] : [...yogurtBank];

    if (draggedItem.source === 'bank') {
      const item = bank[draggedItem.index];
      if (slots[slotIndex]) {
        bank[draggedItem.index] = slots[slotIndex]!;
      } else {
        bank.splice(draggedItem.index, 1);
      }
      slots[slotIndex] = item;
    } else if (draggedItem.source === 'slot') {
      const temp = slots[slotIndex];
      slots[slotIndex] = slots[draggedItem.index];
      slots[draggedItem.index] = temp;
    }
    
    if (isPickle) {
      setPickleSlots(slots);
      setPickleBank(bank);
    } else {
      setYogurtSlots(slots);
      setYogurtBank(bank);
    }
    setDraggedItem(null);
  };

  const handleDropOnBank = () => {
    if (!draggedItem || draggedItem.source === 'bank') return;
    
    const isPickle = activeTab === 'pickle';
    const slots = isPickle ? [...pickleSlots] : [...yogurtSlots];
    const bank = isPickle ? [...pickleBank] : [...yogurtBank];
    
    const item = slots[draggedItem.index];
    if (item) {
      bank.push(item);
      slots[draggedItem.index] = null;
    }
    
    if (isPickle) {
      setPickleSlots(slots);
      setPickleBank(bank);
    } else {
      setYogurtSlots(slots);
      setYogurtBank(bank);
    }
    setDraggedItem(null);
  };
  
  const checkProcesses = () => {
    const isPickle = activeTab === 'pickle';
    const slots = isPickle ? pickleSlots : yogurtSlots;
    
    if (slots.includes(null)) return alert('Hãy điền kín các ô trống trong sơ đồ trước nhé! 🧩');
    
    const prefix = isPickle ? 'p' : 'y';
    const isCorrect = slots.every((step, idx) => step?.id === `${prefix}${idx + 1}`);
    
    if (isCorrect) alert(`Hoan hô! Sơ đồ ${isPickle ? 'Muối dưa' : 'Làm sữa chua'} chính xác 100% 🎉`);
    else alert('Chưa đúng rồi, hãy kiểm tra lại và thử đổi chỗ các thẻ nhé! 🤔');
  };

  const resetActivity2 = () => {
    if (activeTab === 'pickle') {
      setPickleBank([...PICKLE_STEPS].sort(() => Math.random() - 0.5));
      setPickleSlots([null, null, null, null]);
    } else {
      setYogurtBank([...YOGURT_STEPS].sort(() => Math.random() - 0.5));
      setYogurtSlots([null, null, null, null]);
    }
  };

  // Logic Năng lượng Bàn cân
  const getNutritionScore = (nutrient: string, type: 'milk' | 'yogurt') => {
    if (nutrient.includes('Canxi')) return type === 'milk' ? 4 : 4;
    if (nutrient.includes('Protein')) return type === 'milk' ? 4 : 4;
    if (nutrient.includes('Đường Lactose')) return type === 'milk' ? 5 : 1;
    if (nutrient.includes('Lợi khuẩn Lactic')) return type === 'milk' ? 0 : 5;
    if (nutrient.includes('Độ dễ tiêu hóa')) return type === 'milk' ? 2 : 5;
    return 0;
  };

  const renderEnergyBar = (score: number, max: number = 5, colorClass: string) => (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div 
          key={i}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className={`h-4 flex-1 rounded-sm ${i < score ? colorClass : 'bg-gray-200 shadow-inner'}`}
          style={{ transformOrigin: 'left' }}
        />
      ))}
    </div>
  );

  const completeLesson = async () => {
    await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepKey: 'trong-lop-t1' })
    });
    router.push('/home');
  };

  // Tính tổng điểm để làm độ nghiêng bàn cân
  const milkScore = milkNutrients.reduce((acc, n) => acc + getNutritionScore(n, 'milk'), 0);
  const yogurtScore = yogurtNutrients.reduce((acc, n) => acc + getNutritionScore(n, 'yogurt'), 0);
  const diff = yogurtScore - milkScore; // Dương = Sữa chua nặng hơn
  const maxRotation = 20;
  const rotation = Math.max(-maxRotation, Math.min(maxRotation, diff * 5));

  return (
    <div className="w-full h-screen bg-[#FFFF00] flex items-center justify-center p-2 sm:p-4 font-display overflow-hidden">
      <div 
        className="w-full bg-white border-4 md:border-8 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col relative overflow-hidden"
        style={{ 
          aspectRatio: '16/9', 
          width: '100%',
          maxHeight: '90vh', 
          maxWidth: 'calc(90vh * 16 / 9)' 
        }}
      >
        {/* APP TOOLBAR */}
        <header className="flex-none p-3 md:p-6 border-b-4 border-black bg-gray-50 flex items-center justify-between z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/home')} className="w-10 h-10 md:w-12 md:h-12 bg-white border-4 border-black rounded-full flex items-center justify-center hover:scale-105 shadow-[4px_4px_0px_0px_#000000] shrink-0">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black uppercase text-black truncate hidden sm:block">GIAI ĐOẠN 2: TIẾT 1</h1>
          </div>
          
          {/* TABS CHUYỂN HOẠT ĐỘNG */}
          <div className="flex gap-2 md:gap-4">
            {[1, 2, 3].map(act => (
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
        <main className="flex-1 min-h-0 bg-gray-50 relative overflow-hidden flex flex-col">
          
          {/* HOẠT ĐỘNG 1: X-RAY */}
          {currentActivity === 1 && (
            <div className="flex-1 p-2 md:p-4 overflow-hidden w-full h-full flex flex-col">
              <div className="flex-none text-center mb-2 md:mb-4">
                <h2 className="text-xl md:text-3xl font-black uppercase text-[#FF00FF]">1. KÍNH HIỂN VI X-RAY 🔭</h2>
                <p className="font-bold text-gray-600 text-sm md:text-base hidden sm:block">Bấm nút để bốc thăm ngẫu nhiên một món ăn của học sinh.</p>
              </div>

              <div className="flex-1 flex flex-row gap-2 md:gap-4 min-h-0 w-full">
                
                {/* Panel Trái - Điều khiển */}
                <div className="flex-[1] flex flex-col gap-2 md:gap-3 h-full bg-white p-2 border-2 md:border-4 border-dashed border-gray-300 rounded-2xl">
                  <button onClick={handleSpin} disabled={isSpinning} className="flex-none px-2 py-2 md:py-3 min-h-[50px] md:min-h-[60px] bg-[#FF00FF] text-white font-black text-sm md:text-xl rounded-xl shadow-[2px_2px_0px_0px_#000000] flex flex-row items-center justify-center gap-2 hover:translate-y-1 hover:shadow-none mx-auto disabled:opacity-50 transition-all w-full border-2 md:border-4 border-black">
                    <Dices className={`w-5 h-5 md:w-8 md:h-8 ${isSpinning ? 'animate-spin' : ''}`} /> 
                    <span className="text-center truncate">{isSpinning ? 'ĐANG BỐC...' : 'BỐC THĂM MÓN ĂN'}</span>
                  </button>

                  <div className={`flex-1 border-4 border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center p-2 md:p-3 text-center shadow-inner overflow-y-auto ${!selectedDiary ? 'justify-center' : 'justify-start'}`}>
                    {!selectedDiary ? (
                      <>
                        <Search className="w-10 h-10 md:w-16 md:h-16 text-gray-300 mb-2" />
                        <p className="text-gray-400 font-bold text-sm md:text-lg">Khu vực điều khiển &<br/>Thông tin dữ liệu</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-start w-full animate-in fade-in zoom-in gap-3">
                         <h3 className="text-xl md:text-2xl font-black uppercase text-[#FF0000]">{selectedDiary.studentName}</h3>
                         <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-3 py-1 md:px-4 md:py-1.5 border-2 md:border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
                           {selectedDiary.foodName}
                         </p>
                         {selectedDiary.type === 'THUC_TE' ? (
                           <div className="flex flex-col gap-2 w-full mt-2">
                             <p className="text-gray-800 font-bold text-sm md:text-base bg-white/80 px-3 py-2 rounded-lg border-2 border-gray-300 truncate">🎨 Màu sắc: {selectedDiary.color}</p>
                             <p className="text-gray-800 font-bold text-sm md:text-base bg-white/80 px-3 py-2 rounded-lg border-2 border-gray-300 truncate">👁️ Trạng thái: {selectedDiary.state}</p>
                           </div>
                         ) : (
                           <div className="flex flex-col gap-2 w-full mt-2">
                             <p className="text-gray-800 font-bold text-sm md:text-base bg-white/80 px-3 py-2 rounded-lg border-2 border-gray-300 break-words">❓ Lý do: {selectedDiary.reason}</p>
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel Phải - Màn hình hiển thị */}
                <div className="flex-[2] flex flex-col min-h-0 relative h-full">
                  {!selectedDiary && !isSpinning && (
                    <div className="flex-1 flex items-center justify-center text-center p-8 text-gray-400 font-bold text-lg md:text-xl border-4 border-dashed border-gray-300 rounded-2xl bg-white h-full">
                      Giáo viên hãy bốc thăm để chọn ngẫu nhiên món ăn của một bạn học sinh nhé!
                    </div>
                  )}

                  {isSpinning && (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 gap-4 bg-[#E0F7FA] rounded-2xl border-4 border-black animate-pulse h-full">
                      <User className="w-16 h-16 text-[#00E5FF]" />
                      <h3 className="text-3xl md:text-4xl font-black text-black uppercase">{diaries[spinIndex]?.studentName}</h3>
                      <p className="text-xl md:text-2xl font-bold text-gray-600">Đang quét dữ liệu món ăn...</p>
                    </div>
                  )}

                  {!isSpinning && selectedDiary && !showXRay && (
                    <div className="flex-1 flex flex-col items-center justify-center py-4 px-4 gap-2 md:gap-4 bg-[#FFF9C4] rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#FF8C00] overflow-y-auto h-full">
                      <div className="text-center">
                         {selectedDiary.imageUrl ? (
                           <div onClick={() => { setShowXRay(true); setZoomed(true); }} className="relative inline-block cursor-pointer group mb-2 md:mb-4">
                             <img src={selectedDiary.imageUrl} alt={selectedDiary.foodName} className="w-24 h-24 md:w-48 md:h-48 object-cover rounded-full border-4 md:border-8 border-white shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-gray-200 transition-transform group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Search className="w-10 h-10 md:w-16 md:h-16 text-[#00FF00] animate-pulse" />
                             </div>
                           </div>
                         ) : (
                           <div onClick={() => { setShowXRay(true); setZoomed(true); }} className="relative inline-flex items-center justify-center w-24 h-24 md:w-48 md:h-48 bg-white rounded-full border-4 md:border-8 border-gray-200 shadow-[0_0_30px_rgba(0,0,0,0.3)] mb-2 md:mb-4 cursor-pointer group transition-transform hover:scale-105">
                             <span className="text-5xl md:text-8xl group-hover:scale-110 transition-transform">{getEmoji(selectedDiary.foodName)}</span>
                             <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Search className="w-10 h-10 md:w-16 md:h-16 text-[#00FF00] animate-pulse drop-shadow-md" />
                             </div>
                           </div>
                         )}
                         
                         <div className="w-full flex justify-center">
                            <p className="text-xs md:text-xl font-bold text-gray-500 animate-pulse bg-white/50 px-3 py-1 md:px-6 md:py-2 rounded-full border-2 border-dashed border-gray-400 mt-4">👆 Click vào hình để soi X-Ray 👆</p>
                         </div>
                      </div>
                    </div>
                  )}

                  {!isSpinning && selectedDiary && showXRay && (
                    <div className="flex-1 relative bg-black rounded-2xl border-4 md:border-8 border-gray-800 overflow-hidden flex items-center justify-center group shadow-[8px_8px_0px_0px_#000000] h-full">
                      
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 font-black text-xs md:text-base rounded-lg border-2 border-white transition-colors z-40 animate-pulse">
                        🔴 REC | ZOOM: 10,000,000X
                      </div>

                      {/* Mô hình 3D hiển thị */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute inset-0 flex items-center justify-center p-2 md:p-4 z-10"
                      >
                        <model-viewer 
                          src="/models/Meshy_AI_Rod_shaped_Bacteria_E_0606101028_texture.glb" 
                          auto-rotate 
                          camera-controls 
                          rotation-per-second="60deg"
                          style={{ width: '100%', height: '100%', minHeight: '100px' }}
                        ></model-viewer>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HOẠT ĐỘNG 2: KÉO THẢ QUY TRÌNH */}
          {currentActivity === 2 && (
            <div className="flex-1 p-2 md:p-4 overflow-hidden w-full h-full flex flex-col">
              <div className="flex-none text-center mb-2 md:mb-4">
                <h2 className="text-xl md:text-3xl font-black uppercase text-[#FF8C00]">2. SƠ ĐỒ LÊN MEN 🥬🥣</h2>
              </div>
              
              <div className="flex-1 flex flex-row gap-2 md:gap-4 min-h-0 w-full">
                
                {/* Panel Trái - Điều khiển */}
                <div className="w-24 md:w-40 flex-none flex flex-col gap-2 md:gap-4 h-full bg-white p-2 md:p-4 border-2 md:border-4 border-dashed border-gray-300 rounded-2xl justify-between">
                  {/* TAB SWITCHER */}
                  <div className="flex-none flex flex-col justify-center gap-2 md:gap-4 mt-2">
                    <button 
                      onClick={() => setActiveTab('pickle')}
                      className={`w-full py-3 md:py-4 rounded-xl font-black text-[10px] md:text-sm border-2 md:border-4 transition-transform ${activeTab === 'pickle' ? 'bg-[#00FF00] border-black shadow-[4px_4px_0px_0px_#000000] scale-105 z-10' : 'bg-white border-gray-300 text-gray-400 hover:scale-105'}`}
                    >
                      🥬 DƯA MUỐI
                    </button>
                    <button 
                      onClick={() => setActiveTab('yogurt')}
                      className={`w-full py-3 md:py-4 rounded-xl font-black text-[10px] md:text-sm border-2 md:border-4 transition-transform ${activeTab === 'yogurt' ? 'bg-[#FF00FF] text-white border-black shadow-[4px_4px_0px_0px_#000000] scale-105 z-10' : 'bg-white border-gray-300 text-gray-400 hover:scale-105'}`}
                    >
                      🥣 SỮA CHUA
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2 md:gap-4 mb-2">
                    <button onClick={resetActivity2} className="flex-none w-full py-2 bg-gray-200 text-gray-700 font-black rounded-xl text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 hover:bg-gray-300 shadow-[4px_4px_0px_0px_#9CA3AF] transition-transform hover:-translate-y-1">
                      <RefreshCcw className="w-4 h-4 md:w-6 md:h-6 text-gray-600" /> ĐẶT LẠI
                    </button>
                    <button onClick={checkProcesses} className="flex-none w-full py-3 md:py-4 bg-black text-white font-black rounded-xl text-xs md:text-base flex flex-col items-center justify-center gap-1 hover:bg-gray-800 shadow-[4px_4px_0px_0px_#FF8C00] transition-transform hover:-translate-y-1">
                      <Check className="w-5 h-5 md:w-8 md:h-8 text-[#00FF00]" /> KIỂM<br/>TRA
                    </button>
                  </div>
                </div>

                {/* Panel Phải - Màn hình Sơ đồ & Kho Thẻ */}
                <div className="flex-1 flex flex-col min-h-0 h-full gap-2 md:gap-4">
                  {/* SƠ ĐỒ ĐANG HOẠT ĐỘNG */}
                  {activeTab === 'pickle' ? (
                    <div className="flex-[2] min-h-0 bg-gradient-to-b from-green-50 to-white p-2 md:p-4 rounded-2xl border-4 border-green-200 shadow-sm animate-in fade-in flex items-center justify-center overflow-x-auto w-full relative">
                      <div className="flex flex-row items-center justify-start md:justify-center min-w-max h-full px-2 gap-2 md:gap-4">
                        {pickleSlots.map((step, idx) => (
                          <React.Fragment key={`p-slot-${idx}`}>
                            <div 
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDropOnSlot(idx)}
                              className={`flex-none w-28 md:w-40 p-2 md:p-4 rounded-2xl border-2 md:border-4 ${step ? 'border-green-700 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[4px_4px_0px_0px_#15803D] scale-105' : 'border-dashed border-gray-300 bg-gray-50/50 shadow-inner'} cursor-grab active:cursor-grabbing hover:-translate-y-1 font-bold text-[10px] md:text-sm text-center flex flex-col items-center justify-center gap-1 md:gap-2 transition-all min-h-0 h-full`}
                              draggable={!!step}
                              onDragStart={(e) => {
                                if (step) handleDragStart('slot', idx);
                                else e.preventDefault();
                              }}
                            >
                              <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-base md:text-xl font-black border-2 shadow-sm ${step ? 'bg-white text-green-700 border-green-700' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>
                                {idx + 1}
                              </div>
                              {step ? <p className="leading-tight">{step.text}</p> : <p className="text-gray-400 font-bold uppercase text-[9px] md:text-xs">Kéo thả</p>}
                            </div>
                            {idx < 3 && (
                              <div className="flex items-center justify-center shrink-0">
                                <ArrowRight className="w-5 h-5 md:w-8 md:h-8 text-green-500 animate-pulse" strokeWidth={4} />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-[2] min-h-0 bg-gradient-to-b from-pink-50 to-white p-2 md:p-4 rounded-2xl border-4 border-pink-200 shadow-sm animate-in fade-in flex items-center justify-center overflow-x-auto w-full relative">
                      <div className="flex flex-row items-center justify-start md:justify-center min-w-max h-full px-2 gap-2 md:gap-4">
                        {yogurtSlots.map((step, idx) => (
                          <React.Fragment key={`y-slot-${idx}`}>
                            <div 
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDropOnSlot(idx)}
                              className={`flex-none w-28 md:w-40 p-2 md:p-4 rounded-2xl border-2 md:border-4 ${step ? 'border-pink-700 bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-[4px_4px_0px_0px_#BE185D] scale-105' : 'border-dashed border-gray-300 bg-gray-50/50 shadow-inner'} cursor-grab active:cursor-grabbing hover:-translate-y-1 font-bold text-[10px] md:text-sm text-center flex flex-col items-center justify-center gap-1 md:gap-2 transition-all min-h-0 h-full`}
                              draggable={!!step}
                              onDragStart={(e) => {
                                if (step) handleDragStart('slot', idx);
                                else e.preventDefault();
                              }}
                            >
                              <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-base md:text-xl font-black border-2 shadow-sm ${step ? 'bg-white text-pink-700 border-pink-700' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>
                                {idx + 1}
                              </div>
                              {step ? <p className="leading-tight">{step.text}</p> : <p className="text-gray-400 font-bold uppercase text-[9px] md:text-xs">Kéo thả</p>}
                            </div>
                            {idx < 3 && (
                              <div className="flex items-center justify-center shrink-0">
                                <ArrowRight className="w-5 h-5 md:w-8 md:h-8 text-pink-500 animate-pulse" strokeWidth={4} />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KHO CHỨA THẺ ĐANG ACTIVE */}
                  <div className="flex-[1] min-h-0 flex flex-col bg-white rounded-2xl border-2 md:border-4 border-gray-200 shadow-sm overflow-hidden p-1 md:p-2">
                    <div 
                      className={`flex-1 min-h-0 overflow-y-auto p-2 md:p-4 rounded-xl border-2 border-dashed animate-in fade-in ${activeTab === 'pickle' ? 'border-green-200 bg-green-50/30' : 'border-pink-200 bg-pink-50/30'}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropOnBank}
                    >
                      {(activeTab === 'pickle' ? pickleBank : yogurtBank).length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-center text-gray-400 font-bold italic py-4">Kho thẻ trống</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 h-full items-center">
                          {(activeTab === 'pickle' ? pickleBank : yogurtBank).map((step, idx) => (
                            <div 
                              key={`bank-${step.id}`}
                              draggable
                              onDragStart={() => handleDragStart('bank', idx)}
                              className="w-[45%] md:w-[22%] p-2 md:p-3 rounded-xl bg-white text-gray-700 font-bold text-center cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform flex items-center justify-center text-[10px] md:text-sm shadow-[4px_4px_0px_0px_#D1D5DB] hover:shadow-[4px_4px_0px_0px_#9CA3AF] border-2 border-gray-400 hover:border-gray-500"
                            >
                              <p className="leading-tight">{step.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* HOẠT ĐỘNG 3: BÀN CÂN DINH DƯỠNG */}
          {currentActivity === 3 && (
            <div className="flex-1 p-2 md:p-4 overflow-hidden w-full h-full flex flex-col">
              <div className="flex-none text-center mb-2 md:mb-4">
                <h2 className="text-xl md:text-3xl font-black uppercase text-[#00E5FF]">3. BÀN CÂN DINH DƯỠNG ⚖️</h2>
              </div>
              
              <div className="flex-1 flex flex-row gap-2 md:gap-4 min-h-0 w-full">
                {/* Panel Trái - Dữ liệu & Công cụ */}
                <div className="w-32 md:w-48 flex-none flex flex-col gap-2 md:gap-4 h-full bg-white p-2 md:p-3 border-2 md:border-4 border-dashed border-gray-300 rounded-2xl justify-between">
                  <p className="font-bold text-gray-500 text-[9px] md:text-xs text-center mb-1 leading-tight mt-1">Kéo thả dinh dưỡng vào đĩa cân</p>
                  
                  {/* KHO DINH DƯỠNG */}
                  <div className="flex-1 min-h-0 bg-blue-50/50 rounded-xl border-2 border-gray-200 p-1.5 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-1.5 md:gap-2 items-center mt-1">
                      {NUTRITIONS.map(n => (
                        <div 
                          key={n} draggable onDragStart={() => setDraggedNutrient(n)}
                          className="bg-white border-2 border-black px-1.5 py-1.5 md:py-2 rounded-lg font-bold text-[9px] md:text-xs shadow-[2px_2px_0px_0px_#000000] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all w-full text-center leading-tight flex items-center justify-center min-h-[36px]"
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <button onClick={() => setShowConclusion(true)} className="flex-none w-full py-2 bg-green-200 border-2 md:border-3 border-black rounded-xl font-black text-[10px] md:text-xs flex flex-row items-center justify-center gap-1 hover:bg-green-300 shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-1 transition-transform">
                      <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" /> KẾT LUẬN
                    </button>
                    <button onClick={() => { setMilkNutrients([]); setYogurtNutrients([]); }} className="flex-none w-full py-2 bg-gray-200 border-2 md:border-3 border-black rounded-xl font-black text-[10px] md:text-xs flex flex-row items-center justify-center gap-1 hover:bg-gray-300 shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-1 transition-transform mb-1">
                      <RefreshCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> ĐẶT LẠI
                    </button>
                  </div>
                </div>

                {/* Panel Phải - Bàn cân */}
                <div className="flex-1 flex flex-col min-h-0 h-full bg-gradient-to-t from-blue-50 to-white rounded-2xl border-2 md:border-4 border-blue-100 relative overflow-hidden">
                  
                  {/* Cột trụ đỡ */}
                  <div className="absolute top-[15%] bottom-0 w-6 md:w-8 bg-gradient-to-b from-gray-600 to-gray-900 rounded-t-lg z-10 left-1/2 -translate-x-1/2 shadow-2xl"></div>
                  
                  {/* Trục xoay */}
                  <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#00E5FF] to-blue-600 rounded-full border-4 border-gray-900 shadow-[0_0_15px_rgba(0,229,255,0.8)] z-[30] flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>

                  {/* Đòn cân (Beam) */}
                  <motion.div 
                    animate={{ rotate: rotation }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    className="absolute top-[15%] left-1/2 w-[75%] md:w-[65%] h-4 md:h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full z-[20] shadow-xl border-y-2 border-gray-500"
                    style={{ x: '-50%', y: '-50%' }}
                  >
                    {/* Dây treo Trái */}
                    <motion.div 
                      animate={{ rotate: -rotation }} 
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      className="absolute left-[10%] md:left-[15%] top-1/2 w-1.5 md:w-2.5 h-[60px] md:h-[100px] bg-gray-500 origin-top z-[-1] rounded-b-full shadow-md" 
                    />
                    {/* Dây treo Phải */}
                    <motion.div 
                      animate={{ rotate: -rotation }} 
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      className="absolute right-[10%] md:right-[15%] top-1/2 w-1.5 md:w-2.5 h-[60px] md:h-[100px] bg-gray-500 origin-top z-[-1] rounded-b-full shadow-md" 
                    />
                  </motion.div>

                  {/* Container 2 Đĩa cân */}
                  <div className="absolute top-[20%] h-[35%] md:h-[40%] left-0 w-full flex justify-center gap-4 md:gap-10 px-2 md:px-4 z-[40] pointer-events-none">
                    
                    {/* Cân Sữa Tươi */}
                    <motion.div 
                      animate={{ y: rotation * -1.5 }}
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      className="w-[48%] md:w-[45%] max-w-[350px] h-full flex flex-col relative pointer-events-auto"
                    >
                      <div 
                        onDragOver={e => e.preventDefault()} 
                        onDrop={() => { if (draggedNutrient && !milkNutrients.includes(draggedNutrient)) setMilkNutrients([...milkNutrients, draggedNutrient]) }}
                        className="bg-blue-50 border-4 border-gray-300 rounded-b-[2rem] md:rounded-b-[3rem] rounded-t-xl p-2 md:p-3 shadow-[0_15px_0_0_#9CA3AF] flex flex-col items-center w-full flex-1 mt-6 md:mt-8 relative"
                      >
                        <div className="absolute -top-6 md:-top-8 bg-white border-4 border-black w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-[4px_4px_0px_0px_#000000] z-10">🥛</div>
                        <h3 className="font-black text-sm md:text-xl mb-1 mt-4 md:mt-6 text-blue-800">SỮA TƯƠI</h3>
                        
                        <div className="flex-1 w-full grid grid-cols-2 gap-1.5 md:gap-2 auto-rows-max content-start overflow-y-auto pr-1 pb-2 custom-scrollbar">
                          <AnimatePresence>
                            {milkNutrients.map(n => (
                               <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  key={n} 
                                  className="bg-white border-2 border-black p-1.5 md:p-2 rounded-md shadow-[2px_2px_0px_0px_#000000] flex flex-col justify-between"
                                >
                                  <p className="font-bold text-[9px] md:text-xs mb-1 text-black truncate" title={n}>{n}</p>
                                  {renderEnergyBar(getNutritionScore(n, 'milk'), 5, 'bg-blue-500 shadow-[0_0_2px_rgba(59,130,246,0.6)]')}
                               </motion.div>
                            ))}
                          </AnimatePresence>
                          {milkNutrients.length === 0 && (
                            <div className="col-span-2 h-[50px] md:h-[60px] flex flex-col justify-center items-center opacity-60 border-4 border-dashed border-blue-300 rounded-2xl p-2">
                              <p className="font-bold text-center text-blue-500 text-[10px] md:text-sm">Thả vào đây...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Cân Sữa Chua */}
                    <motion.div 
                      animate={{ y: rotation * 1.5 }}
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      className="w-[48%] md:w-[45%] max-w-[350px] h-full flex flex-col relative pointer-events-auto"
                    >
                      <div 
                        onDragOver={e => e.preventDefault()} 
                        onDrop={() => { if (draggedNutrient && !yogurtNutrients.includes(draggedNutrient)) setYogurtNutrients([...yogurtNutrients, draggedNutrient]) }}
                        className="bg-pink-50 border-4 border-gray-300 rounded-b-[2rem] md:rounded-b-[3rem] rounded-t-xl p-2 md:p-3 shadow-[0_15px_0_0_#9CA3AF] flex flex-col items-center w-full flex-1 mt-6 md:mt-8 relative"
                      >
                        <div className="absolute -top-6 md:-top-8 bg-white border-4 border-black w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-[4px_4px_0px_0px_#000000] z-10">🥣</div>
                        <h3 className="font-black text-sm md:text-xl mb-1 mt-4 md:mt-6 text-pink-800">SỮA CHUA</h3>
                        
                        <div className="flex-1 w-full grid grid-cols-2 gap-1.5 md:gap-2 auto-rows-max content-start overflow-y-auto pr-1 pb-2 custom-scrollbar">
                          <AnimatePresence>
                            {yogurtNutrients.map(n => (
                               <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  key={n} 
                                  className="bg-[#FF00FF] text-white border-2 border-black p-1.5 md:p-2 rounded-md shadow-[2px_2px_0px_0px_#000000] flex flex-col justify-between"
                                >
                                  {n === 'Protein 💪' ? (
                                    <div className="flex gap-1 mb-1 items-center flex-wrap">
                                      <span className="bg-white/30 border border-white/60 px-1 py-0.5 rounded-sm text-[9px] md:text-xs font-black shadow-sm transform -rotate-3">Pro</span>
                                      <span className="bg-white/30 border border-white/60 px-1 py-0.5 rounded-sm text-[9px] md:text-xs font-black shadow-sm transform translate-y-1">te</span>
                                      <span className="bg-white/30 border border-white/60 px-1 py-0.5 rounded-sm text-[9px] md:text-xs font-black shadow-sm transform rotate-6">in</span>
                                      <span className="text-[9px] md:text-xs">💪</span>
                                    </div>
                                  ) : (
                                    <p className="font-bold text-[9px] md:text-xs mb-1 truncate" title={n}>{n}</p>
                                  )}
                                  {renderEnergyBar(getNutritionScore(n, 'yogurt'), 5, 'bg-[#FFFF00] shadow-[0_0_2px_rgba(255,255,0,0.8)]')}
                               </motion.div>
                            ))}
                          </AnimatePresence>
                          {yogurtNutrients.length === 0 && (
                            <div className="col-span-2 h-[50px] md:h-[60px] flex flex-col justify-center items-center opacity-60 border-4 border-dashed border-pink-300 rounded-2xl p-2">
                              <p className="font-bold text-center text-pink-500 text-[10px] md:text-sm">Thả vào đây...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popup Kết Luận */}
          <AnimatePresence>
            {showConclusion && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setShowConclusion(false)}
              >
                <motion.div 
                  initial={{ scale: 0.5, y: 50 }} 
                  animate={{ scale: 1, y: 0 }} 
                  exit={{ scale: 0.5, y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-white border-4 md:border-8 border-[#00E5FF] rounded-[2rem] p-4 md:p-8 max-w-4xl w-full shadow-[8px_8px_0px_0px_#00E5FF] relative"
                >
                  <button 
                    onClick={() => setShowConclusion(false)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 bg-red-500 hover:bg-red-600 border-2 border-black rounded-full flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-1 transition-transform z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-6 text-center uppercase tracking-wider drop-shadow-md leading-tight">
                      GIÁ TRỊ VƯỢT TRỘI CỦA SỮA CHUA
                    </h2>
                    
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                      
                      {/* Thẻ 1 */}
                      <div className="bg-pink-100 border-4 border-black rounded-2xl p-4 md:p-6 flex flex-col items-center justify-start text-center shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-2 transition-transform min-h-[240px]">
                        <div className="text-5xl md:text-6xl mb-3">🦠</div>
                        <h3 className="font-black text-lg md:text-xl text-pink-700 uppercase mb-3 border-b-2 border-pink-300 pb-2 w-full">Lợi Khuẩn</h3>
                        <p className="font-bold text-base md:text-lg text-gray-800 leading-snug">Bổ sung hàng tỷ <span className="text-pink-600 font-black">Vi khuẩn Lactic</span> sống, giúp đường ruột vô cùng khỏe mạnh!</p>
                      </div>

                      {/* Thẻ 2 */}
                      <div className="bg-yellow-100 border-4 border-black rounded-2xl p-4 md:p-6 flex flex-col items-center justify-start text-center shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-2 transition-transform min-h-[240px]">
                        <div className="text-5xl md:text-6xl mb-3">🍬</div>
                        <h3 className="font-black text-lg md:text-xl text-yellow-700 uppercase mb-3 border-b-2 border-yellow-300 pb-2 w-full">Tiêu Hóa Đường</h3>
                        <p className="font-bold text-base md:text-lg text-gray-800 leading-snug">Vi khuẩn Lactic đã <span className="text-yellow-600 font-black">ăn bớt đường khó tiêu Lactose</span>, giúp bụng êm ái!</p>
                      </div>

                      {/* Thẻ 3 */}
                      <div className="bg-blue-100 border-4 border-black rounded-2xl p-4 md:p-6 flex flex-col items-center justify-start text-center shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-2 transition-transform min-h-[240px]">
                        <div className="text-5xl md:text-6xl mb-3 flex">💪</div>
                        <h3 className="font-black text-lg md:text-xl text-blue-700 uppercase mb-3 border-b-2 border-blue-300 pb-2 w-full">Dễ Hấp Thụ</h3>
                        <p className="font-bold text-base md:text-lg text-gray-800 leading-snug">Vi khuẩn Lactic <span className="text-blue-600 font-black">cắt nhỏ Protein</span> giúp cơ thể bé dễ hấp thụ hơn rất nhiều!</p>
                      </div>

                    </div>
                    
                    <button 
                      onClick={() => setShowConclusion(false)}
                      className="bg-[#00E5FF] hover:bg-blue-400 text-black font-black py-3 md:py-4 px-10 md:px-16 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-2 transition-transform text-lg md:text-2xl uppercase tracking-widest"
                    >
                      BÉ ĐÃ HIỂU RÕ! 🚀
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
