"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Heart, MessageCircle, Camera, Search, Loader2, X } from 'lucide-react';

const FRIDGE_ITEMS = [
  { id: 'sua-chua', name: 'Sữa chua', emoji: '🥛', color: 'bg-white text-black', image: '/images/sua-chua.jpg' },
  { id: 'dua-muoi', name: 'Dưa muối', emoji: '🥬', color: 'bg-[#00FF00] text-black', image: '/images/dua-muoi.jpg' },
  { id: 'kim-chi', name: 'Kim chi', emoji: '🌶️', color: 'bg-[#FF0000] text-white', image: '/images/kim-chi.jpg' },
  { id: 'sung-muoi', name: 'Sung muối', emoji: '🫒', color: 'bg-[#8FBC8F] text-black', image: '/images/sung-muoi.jpg' },
  { id: 'ca-muoi', name: 'Cà pháo muối', emoji: '🍆', color: 'bg-[#E6E6FA] text-black', image: '/images/ca-phao.png' },
];

export default function TruocLopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showFridge, setShowFridge] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingDiaryId, setEditingDiaryId] = useState<string | null>(null);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Branch A
  const [foodNameA, setFoodNameA] = useState('');
  const [colorA, setColorA] = useState('');
  const [stateA, setStateA] = useState('');
  const [tasteA, setTasteA] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Branch B
  const [selectedFoodB, setSelectedFoodB] = useState<any>(null);
  const [reasonB, setReasonB] = useState('');

  // Comment State
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  // Toggle View
  // Toggle View
  const [isViewingForum, setIsViewingForum] = useState(false);
  const [activeForm, setActiveForm] = useState<'none' | 'A' | 'B'>('none');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/pre-class-diary');
      if (res.ok) {
        const data = await res.json();
        setDiaries(data.diaries);
        setCurrentUser(data.currentUser);
        if (data.hasSubmitted && !editingDiaryId) {
          setHasSubmitted(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (branch: 'A' | 'B') => {
    if (branch === 'A' && (!foodNameA || !colorA || !stateA || !tasteA || !imageFile)) return alert('Hãy điền đủ thông tin món ăn (kể cả mùi vị) và tải ảnh lên nhé!');
    if (branch === 'B' && (!selectedFoodB || !reasonB)) return alert('Hãy chọn 1 món từ tủ lạnh và ghi lý do nhé!');

    setIsSubmitting(true);
    let uploadedUrl = '';
    
    if (branch === 'A' && imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      try {
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url;
        }
      } catch (err) {
        console.error("Lỗi upload ảnh", err);
      }
    }

    const payload = branch === 'A' 
      ? { id: editingDiaryId, type: 'THUC_TE', foodName: foodNameA, color: colorA, state: stateA, taste: tasteA, imageUrl: uploadedUrl || (editingDiaryId ? imagePreview : undefined) }
      : { id: editingDiaryId, type: 'TU_LANH', foodName: selectedFoodB.name, reason: reasonB, imageUrl: selectedFoodB.image };

    try {
      const res = await fetch('/api/pre-class-diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepKey: 'truoc-lop' })
        });
        setHasSubmitted(true);
        setEditingDiaryId(null);
        setIsViewingForum(true); // Tự động mở Diễn đàn sau khi nộp
        fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi nộp bài: ' + (err.error || 'Vui lòng đăng nhập từ trang chủ!'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (diaryId: string, emoji: string = '👍') => {
    try {
      const res = await fetch('/api/pre-class-diary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaryId, emoji })
      });
      if (res.ok) fetchData();
    } catch (e) {
      alert("Lỗi mạng!");
    }
  };

  const handleEdit = (diary: any) => {
    setEditingDiaryId(diary.id);
    if (diary.type === 'THUC_TE') {
      setFoodNameA(diary.foodName || '');
      setColorA(diary.color || '');
      setStateA(diary.state || '');
      setTasteA(diary.taste || '');
      if (diary.imageUrl) setImagePreview(diary.imageUrl);
    } else {
      const fridgeItem = FRIDGE_ITEMS.find(i => i.name === diary.foodName) || { name: diary.foodName, emoji: '💡', image: diary.imageUrl };
      setSelectedFoodB(fridgeItem);
      setReasonB(diary.reason || '');
    }
    setIsViewingForum(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài này không?')) return;
    try {
      const res = await fetch(`/api/pre-class-diary?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert("Lỗi khi xóa: " + err.error);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async (diaryId: string) => {
    if (!commentContent.trim()) return;
    const res = await fetch('/api/forum-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diaryId, content: commentContent })
    });
    if (res.ok) {
      setCommentContent('');
      fetchData();
    }
  };

  const completeLesson = async () => {
    await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepKey: 'truoc-lop' })
    });
    router.push('/home');
  };

  if (loading) return <div className="w-full h-screen flex justify-center items-center bg-[#FFFF00]"><Loader2 className="w-12 h-12 animate-spin" /></div>;

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
        {/* APP TOOLBAR (Yêu cầu của người dùng) */}
        <header className="flex-none p-3 md:p-6 border-b-4 border-black bg-gray-50 flex items-center justify-between z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/home')} className="w-10 h-10 md:w-14 md:h-14 bg-white border-4 border-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#000000] shrink-0">
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-black" />
            </button>
            <h1 className="text-xl md:text-3xl font-black font-sans uppercase text-black tracking-tight hidden sm:block">GIAI ĐOẠN 1: TRƯỚC LỚP</h1>
          </div>

          <button onClick={completeLesson} className="bg-[#00FF00] text-black px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-sm md:text-xl border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all uppercase whitespace-nowrap">
            Hoàn Thành
          </button>
        </header>

        {/* NỘI DUNG CŨ BÊN TRONG */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-[#FFFF00]">
          {!isViewingForum ? (
            <div className="max-w-6xl mx-auto pb-4 md:pb-8">
              {/* Banner dẫn vào Diễn đàn khi đang ở Form */}
              <div className="mb-4 md:mb-8 border-4 border-black rounded-3xl p-6 bg-[#00E5FF] shadow-[8px_8px_0px_0px_#FF00FF] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black uppercase text-black flex items-center gap-2">💬 DIỄN ĐÀN LỚP HỌC</h3>
                  <p className="font-bold text-gray-800">Em chưa có ý tưởng? Khám phá xem các bạn khác đã săn được món ăn gì nhé!</p>
                </div>
                <button onClick={() => setIsViewingForum(true)} className="bg-white border-4 border-black px-6 py-3 rounded-xl font-black text-lg hover:scale-105 transition-transform whitespace-nowrap">
                  VÀO XEM NGAY 🚀
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Nút chọn THỰC TẾ */}
                <div className="bg-white border-4 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group" onClick={() => setActiveForm('A')}>
                  <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-[#FF00FF] flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">THỰC TẾ 📷</h2>
                  <p className="text-base md:text-lg font-bold mb-6 text-center text-gray-700 flex-1">Hãy mở tủ lạnh hoặc xuống bếp tìm xem nhà mình có món ăn lên men nào không nhé!</p>
                  <button className="w-full py-3 md:py-4 bg-[#FF00FF] text-white font-black text-lg md:text-xl rounded-xl flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_#000000] group-hover:bg-pink-600 transition-colors">
                    <Send className="w-5 h-5 md:w-6 md:h-6" /> NỘP BÀI
                  </button>
                </div>

                {/* Nút chọn KHÁM PHÁ SỐ */}
                <div className="bg-white border-4 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group" onClick={() => setActiveForm('B')}>
                  <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-[#00FF00] flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">KHÁM PHÁ SỐ 💡</h2>
                  <p className="text-base md:text-lg font-bold mb-6 text-center text-gray-700 flex-1">Nhà em không có món nào ư? Không sao, hãy mở tủ lạnh phép thuật của lớp học!</p>
                  <button className="w-full py-3 md:py-4 bg-[#00FF00] text-black font-black text-lg md:text-xl rounded-xl flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_#000000] group-hover:bg-green-500 transition-colors">
                    <Send className="w-5 h-5 md:w-6 md:h-6" /> NỘP BÀI
                  </button>
                </div>
              </div>

              {activeForm !== 'none' && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setActiveForm('none'); }}>
                  {activeForm === 'A' && (
                    <div className="bg-white border-4 border-black p-4 md:p-6 rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                      {/* CỘT TRÁI: NHÁNH A */}
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <h2 className="text-xl md:text-2xl font-black uppercase text-[#FF00FF] flex items-center gap-2">THỰC TẾ 📷</h2>
                    <button onClick={() => setActiveForm('none')} className="text-sm font-bold bg-gray-200 px-3 py-1 rounded-lg border-2 border-black hover:bg-gray-300">◀ Quay lại</button>
                  </div>
                  <p className="text-sm md:text-base font-bold mb-2 md:mb-3 border-b-2 border-gray-200 pb-1 md:pb-2">Hãy mở tủ lạnh hoặc xuống bếp tìm xem nhà mình có món ăn lên men nào không nhé!</p>
                  
                  <div className="space-y-1.5 md:space-y-2 flex-1">
                    <input value={foodNameA} onChange={e => setFoodNameA(e.target.value)} placeholder="Tên món ăn em tìm thấy là gì?" className="w-full p-1.5 md:p-2 border-2 md:border-4 border-black rounded-xl font-bold text-sm md:text-base" />
                    <input value={colorA} onChange={e => setColorA(e.target.value)} placeholder="Màu sắc của nó như thế nào?" className="w-full p-1.5 md:p-2 border-2 md:border-4 border-black rounded-xl font-bold text-sm md:text-base" />
                    <input value={stateA} onChange={e => setStateA(e.target.value)} placeholder="Trạng thái (Đặc, lỏng, mềm, cứng...)?" className="w-full p-1.5 md:p-2 border-2 md:border-4 border-black rounded-xl font-bold text-sm md:text-base" />
                    <input value={tasteA} onChange={e => setTasteA(e.target.value)} placeholder="Mùi vị của món ăn ra sao (Chua, ngọt, mặn...)?" className="w-full p-1.5 md:p-2 border-2 md:border-4 border-black rounded-xl font-bold text-sm md:text-base" />
                    
                    {/* Khu vực tải ảnh */}
                    <div className="border-2 md:border-4 border-dashed border-black rounded-xl p-1.5 md:p-2 text-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {!imagePreview ? (
                        <div className="py-1 md:py-2 flex flex-col items-center gap-1">
                          <Camera className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                          <p className="font-bold text-xs md:text-sm text-gray-500">Bấm để chụp hoặc tải ảnh món ăn lên <span className="text-red-500">(Bắt buộc)</span></p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="max-h-20 md:max-h-24 mx-auto rounded-lg border-2 border-black shadow-sm" />
                          <button onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 md:p-2 rounded-full border-2 border-black hover:bg-red-600 z-20 transition-transform hover:scale-110">
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button disabled={isSubmitting} onClick={() => handleSubmit('A')} className="mt-2 md:mt-3 w-full py-1.5 md:py-2 bg-black text-white font-black text-base md:text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 md:w-5 md:h-5" /> NỘP BÀI</>}
                  </button>
                </div>
                  )}

                  {activeForm === 'B' && (
                    <div className="bg-white border-4 border-black p-4 md:p-6 rounded-3xl shadow-[8px_8px_0px_0px_#000000] flex flex-col w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                      {/* CỘT PHẢI: NHÁNH B */}
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <h2 className="text-xl md:text-2xl font-black uppercase text-[#00FF00] flex items-center gap-2">KHÁM PHÁ SỐ 💡</h2>
                    <button onClick={() => setActiveForm('none')} className="text-sm font-bold bg-gray-200 px-3 py-1 rounded-lg border-2 border-black hover:bg-gray-300">◀ Quay lại</button>
                  </div>
                  <p className="text-sm md:text-base font-bold mb-2 md:mb-3 border-b-2 border-gray-200 pb-1 md:pb-2">Nhà em không có món nào ư? Không sao, hãy mở tủ lạnh phép thuật của lớp học!</p>
                  
                  <div className="space-y-2 md:space-y-3 flex-1 flex flex-col justify-center">
                    <button onClick={() => setShowFridge(true)} className="w-full py-1.5 md:py-2 bg-[#00E5FF] border-2 md:border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] font-black text-base md:text-lg hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all flex justify-center items-center gap-2">
                      Mở Tủ Lạnh Phép Thuật ngay! 🧊
                    </button>

                    <div className="w-full p-1.5 md:p-2 border-2 md:border-4 border-dashed border-black rounded-xl font-bold text-sm md:text-base flex items-center justify-between bg-gray-50">
                      {selectedFoodB ? (
                         <span className="flex items-center gap-1 md:gap-2 text-lg md:text-xl">{selectedFoodB.emoji} Đã chọn: <span className="text-[#FF0000] uppercase font-black">{selectedFoodB.name}</span></span>
                      ) : (
                         <span className="text-gray-500 text-xs md:text-sm">Chưa chọn món nào từ Tủ Lạnh...</span>
                      )}
                      <button onClick={() => setShowFridge(true)} className="bg-black text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg font-black text-xs md:text-sm whitespace-nowrap ml-2"><Search className="w-3 h-3 md:w-4 md:h-4 inline" /> CHỌN LẠI</button>
                    </div>
                    <textarea value={reasonB} onChange={e => setReasonB(e.target.value)} placeholder="Vì sao em tò mò về món ăn này?" rows={3} className="w-full p-1.5 md:p-2 border-2 md:border-4 border-black rounded-xl font-bold text-sm md:text-base flex-1 min-h-[60px] md:min-h-[80px]" />
                  </div>

                      <button disabled={isSubmitting} onClick={() => handleSubmit('B')} className="mt-2 md:mt-3 w-full py-1.5 md:py-2 bg-black text-white font-black text-base md:text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 md:w-5 md:h-5" /> NỘP BÀI</>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto h-[calc(100vh-40px)] md:h-[calc(100vh-100px)] flex flex-col min-h-0 relative px-2 md:px-0">
              <button onClick={() => setIsViewingForum(false)} className="bg-white border-2 md:border-4 border-black text-black px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-black uppercase flex items-center gap-2 hover:bg-gray-100 w-fit shadow-[2px_2px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] mb-2 md:mb-4 text-xs md:text-base shrink-0">
                 ◀ QUAY LẠI TỦ LẠNH
              </button>

              <div className="bg-[#FFF8E1] border-4 border-black p-2 md:p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden flex flex-col min-h-0 flex-1">
                {/* Họa tiết lưới chấm bi chìm kiểu giấy note khổng lồ */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000000_2px,transparent_2px)] [background-size:24px_24px]"></div>
                
                <h2 className="text-lg md:text-2xl font-black uppercase mb-1 md:mb-2 text-[#FF00FF] flex items-center gap-2 relative z-10 shrink-0">📌 KHU TRƯNG BÀY NHẬT KÝ KHÁM PHÁ ({diaries.length})</h2>
                <div className="p-2 md:p-3 bg-white border-2 border-black rounded-xl mb-2 relative z-10 shrink-0 shadow-inner">
                  <p className="font-bold text-xs md:text-base">📌 <span className="text-[#FF0000]">Câu hỏi thảo luận chung:</span> Sau khi xem Nhật ký của các bạn, em thấy các món lên men nhà các bạn có điểm gì giống và khác nhà em? Có gì thắc mắc không?</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 relative z-10 overflow-y-auto custom-scrollbar flex-1 pb-10 pt-4 px-1 md:px-2 items-start">
                  {diaries.map((diary, idx) => {
                    const bgColors = ['bg-[#FFF9C4]', 'bg-[#F8BBD0]', 'bg-[#B2EBF2]', 'bg-[#C8E6C9]'];
                    const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1'];
                    const color = bgColors[idx % 4];
                    const rot = rotations[idx % 4];

                    return (
                    <div key={diary.id} className={`w-full border-2 md:border-4 border-black rounded-xl p-2 md:p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] relative transition-all duration-300 hover:scale-105 hover:z-20 hover:rotate-0 mb-1 ${color} ${rot}`}>
                      {/* Hành động: Xóa / Sửa */}
                      <div className="absolute -top-3 -right-2 flex flex-row gap-1 z-30">
                        {currentUser?.userId === diary.userId && (
                          <button onClick={() => handleEdit(diary)} className="bg-blue-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 border-black hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]" title="Sửa bài">
                            ✏️
                          </button>
                        )}
                        {currentUser?.role === 'teacher' && (
                          <button onClick={() => handleDelete(diary.id)} className="bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 border-black hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] font-black text-xs md:text-sm" title="Xóa bài">
                            X
                          </button>
                        )}
                      </div>

                      {/* Đinh ghim */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] z-10" />
                      
                      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-black text-white px-2 py-0.5 md:px-3 md:py-1 font-black rounded-full border-2 border-white rotate-[-10deg] shadow-md z-10 text-[10px] md:text-xs">
                        {diary.type === 'THUC_TE' ? 'THỰC TẾ 📸' : 'KHÁM PHÁ 💡'}
                      </div>
                      
                      {diary.imageUrl && (
                        <div className="mb-2 mt-4 md:mt-6 rounded-lg border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000000] bg-white cursor-pointer group">
                          <img src={diary.imageUrl} alt={diary.foodName} className="w-full h-24 md:h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      <h3 className="font-black text-sm md:text-base mb-0.5 flex items-center gap-1 mt-2">👤 {diary.studentName}</h3>
                      <p className="text-gray-600 font-bold text-[10px] mb-2 italic">{new Date(diary.createdAt).toLocaleString('vi-VN')}</p>
                      
                      <div className="bg-white/80 p-2 rounded-lg border-2 border-dashed border-black mb-2 space-y-1 shadow-inner">
                        <p className="font-bold text-xs text-[#FF0000] uppercase mb-1 line-clamp-1">{diary.foodName}</p>
                        {diary.type === 'THUC_TE' ? (
                          <>
                            <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">🎨 Màu:</span> {diary.color}</p>
                            <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">👁️ Dạng:</span> {diary.state}</p>
                            {diary.taste && <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">👅 Vị:</span> {diary.taste}</p>}
                          </>
                        ) : (
                          <p className="font-medium text-xs text-gray-800 line-clamp-2"><span className="font-black text-black">🤔 Lý do:</span> {diary.reason}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 border-t-2 border-dashed border-black pt-2">
                        <div className="relative group/reaction">
                          <button onClick={() => handleLike(diary.id, diary.userReaction || '👍')} className="flex items-center gap-1 font-black text-gray-700 hover:scale-110 transition-transform bg-white px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] text-xs">
                            <span className="text-sm">{diary.userReaction || '👍'}</span> {diary.likes}
                          </button>
                          <div className="absolute bottom-full left-0 pb-1 hidden group-hover/reaction:block z-50">
                            <div className="bg-white border-2 border-black rounded-full p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex gap-1">
                              {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                                <button key={emoji} onClick={() => handleLike(diary.id, emoji)} className="text-lg hover:scale-125 hover:-translate-y-1 transition-all origin-bottom">
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setCommentingId(commentingId === diary.id ? null : diary.id)} className="flex items-center gap-1 font-black text-blue-600 hover:scale-110 transition-transform bg-white px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] text-xs">
                          <MessageCircle className="w-4 h-4 fill-current" /> {diary.comments?.length || 0}
                        </button>
                      </div>

                      {commentingId === diary.id && (
                        <div className="mt-4 border-t-4 border-dashed border-black pt-3 space-y-3">
                          {diary.comments && diary.comments.length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                              {diary.comments.map((cmt: any) => (
                                <div key={cmt.id} className="bg-white p-2 rounded-xl border-2 border-black shadow-sm">
                                  <span className="font-black text-sm text-[#FF00FF]">{cmt.studentName}: </span>
                                  <span className="text-sm font-bold text-gray-800">{cmt.content}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 font-bold bg-white p-2 rounded-lg border-2 border-dashed border-gray-400 text-center">Chưa có bình luận nào. Mở bát đi nào! 🚀</p>
                          )}
                          
                          <div className="flex gap-2">
                            <input 
                              value={commentContent}
                              onChange={e => setCommentContent(e.target.value)}
                              placeholder="Viết bình luận..."
                              className="flex-1 px-3 py-2 border-2 border-black rounded-xl text-sm font-bold outline-none focus:bg-[#FFFF00] shadow-inner"
                              onKeyDown={e => e.key === 'Enter' && handleCommentSubmit(diary.id)}
                            />
                            <button onClick={() => handleCommentSubmit(diary.id)} className="bg-[#00E5FF] text-black border-2 border-black px-3 py-2 rounded-xl hover:bg-[#00FF00] hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_0px_#000000]">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL TỦ LẠNH */}
      <AnimatePresence>
        {showFridge && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-[#E0F7FA] border-8 border-gray-300 w-full max-w-2xl rounded-t-3xl rounded-b-md shadow-2xl relative overflow-hidden">
              <div className="bg-gray-300 h-6 w-full flex items-center justify-center">
                <div className="w-20 h-2 bg-gray-400 rounded-full" />
              </div>
              <button onClick={() => setShowFridge(false)} className="absolute top-8 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black z-10"><X className="w-6 h-6" /></button>
              
              <div className="p-8 pb-12">
                <h2 className="text-3xl font-black text-center mb-8 uppercase text-blue-800 drop-shadow-md">❄️ TỦ LẠNH PHÉP THUẬT ❄️</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {FRIDGE_ITEMS.map(item => (
                    <motion.button 
                      key={item.id}
                      whileHover={{ scale: 1.05, rotate: [-2, 2, -2, 0] }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedFoodB(item);
                        setShowFridge(false);
                      }}
                      className={`${item.color} border-4 border-black p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}
                    >
                      {item.image ? (
                        <div className="w-full h-32 rounded-xl overflow-hidden border-2 border-black">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-5xl">{item.emoji}</span>
                      )}
                      <span className="font-black text-center leading-tight">{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
