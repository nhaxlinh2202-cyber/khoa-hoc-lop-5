"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Send, Loader2, PlayCircle, Heart, MessageCircle, Gamepad2, Smile, Sparkles, Camera } from 'lucide-react';
import Confetti from 'react-confetti';

export default function SauLopPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  
  // Tab 1 Data
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isViewingForum, setIsViewingForum] = useState(false);
  
  // Tab 1 Form State (Sổ Tay Ma Thuật)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('');
  const [taste, setTaste] = useState('');
  const [state, setState] = useState('');
  const [editingDiaryId, setEditingDiaryId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Tab 1 Forum State
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  
  // Tab 3 Data
  const [hasReflected, setHasReflected] = useState(false);
  const [reflectionEmotion, setReflectionEmotion] = useState('');
  const [reflectionContent, setReflectionContent] = useState('');
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [isTeacher, setIsTeacher] = useState(false);
  const [allReflections, setAllReflections] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showClassDiary, setShowClassDiary] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  useEffect(() => {
    fetchData();
    fetchReflection();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/post-class-diary', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHasSubmitted(data.hasSubmitted);
        setDiaries(data.diaries);
        setCurrentUser(data.currentUser);
        if (data.hasSubmitted && !editingDiaryId) {
          setIsViewingForum(true);
          setShowWelcomePopup(false);
        }
      } else {
        const text = await res.text();
        alert("Lỗi tải diễn đàn: " + res.status + " - " + text);
      }
    } catch (err: any) {
      alert("Lỗi mạng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReflection = async () => {
    try {
      const resMe = await fetch('/api/auth/me');
      let isTeacherRole = false;
      if (resMe.ok) {
        const meData = await resMe.json();
        isTeacherRole = meData.user?.role === 'teacher';
        setIsTeacher(isTeacherRole);
      }

      if (isTeacherRole) {
         const resAll = await fetch('/api/lesson-reflection?all=true', { cache: 'no-store' });
         if (resAll.ok) {
            const dataAll = await resAll.json();
            setAllReflections(dataAll.reflections || []);
         }
      } else {
        const res = await fetch('/api/lesson-reflection', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setHasReflected(data.hasSubmitted);
          if (data.reflection) {
            setReflectionEmotion(data.reflection.emotion);
            setReflectionContent(data.reflection.content);
          }
        }
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setImageUrl(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!color || !state || !taste) {
      return alert('Vui lòng điền đầy đủ Sổ Tay nhé!');
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/post-class-diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingDiaryId,
          timeTaken: 'N/A', 
          color, 
          taste, 
          state, 
          imageUrl,
          rating: 5
        })
      });
      if (res.ok) {
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepKey: 'sau-lop' })
        });
        setHasSubmitted(true);
        setEditingDiaryId(null);
        setIsViewingForum(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        fetchData();
      } else {
        const err = await res.json();
        alert('Có lỗi xảy ra: ' + (err.error || 'Vui lòng thử lại!'));
      }
    } catch (error) {
      alert('Không thể kết nối đến máy chủ. Ảnh của bạn có thể quá lớn!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (diary: any) => {
    setEditingDiaryId(diary.id);
    setImageUrl(diary.imageUrl || '');
    setColor(diary.color || '');
    setState(diary.state || '');
    setTaste(diary.taste || '');
    setIsViewingForum(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài này không?')) return;
    try {
      const res = await fetch(`/api/post-class-diary?id=${id}`, { method: 'DELETE' });
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

  const handleLike = async (diaryId: string, emoji: string = '👍') => {
    try {
      const res = await fetch('/api/post-class-diary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaryId, emoji })
      });
      if (res.ok) fetchData();
    } catch (e) {
      alert("Lỗi mạng!");
    }
  };

  const handleCommentSubmit = async (diaryId: string) => {
    if (!commentContent.trim()) return;
    const res = await fetch('/api/post-forum-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diaryId, content: commentContent })
    });
    if (res.ok) {
      setCommentContent('');
      fetchData();
    }
  };

  const handleReflectionSubmit = async () => {
    if (!reflectionEmotion || !reflectionContent) {
      return alert('Hãy chọn cảm xúc và chia sẻ cảm nhận nhé!');
    }
    setIsSubmittingReflection(true);
    try {
      const res = await fetch('/api/lesson-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion: reflectionEmotion, content: reflectionContent })
      });
      if (res.ok) {
        setHasReflected(true);
        setShowConfetti(true);
        setShowNotification(true);
        fetchReflection();
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        const data = await res.json();
        alert('Lỗi nộp nhật ký: ' + data.error);
      }
    } catch(err: any) {
      alert('Lỗi kết nối: ' + err.message);
      console.error(err);
    } finally {
      setIsSubmittingReflection(false);
    }
  };

  if (loading) return <div className="w-full h-screen flex justify-center items-center bg-[#FFFF00]"><Loader2 className="w-16 h-16 animate-spin text-[#FF00FF]" /></div>;

  return (
    <div className="w-full h-screen bg-[#FFFF00] flex items-center justify-center p-2 sm:p-4 font-display overflow-hidden relative">
      {showConfetti && <div className="fixed inset-0 z-[9999] pointer-events-none"><Confetti width={typeof window !== 'undefined' ? window.innerWidth : 1000} height={typeof window !== 'undefined' ? window.innerHeight : 1000} /></div>}

      {/* POPUP THÔNG BÁO ĐÃ NỘP NHẬT KÝ */}
      {showNotification && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white border-4 md:border-8 border-black rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_#00FF00] max-w-sm w-full animate-in zoom-in-50 duration-500">
            <span className="text-6xl md:text-7xl mb-4 animate-bounce">🎉</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-black mb-3">ĐÃ NỘP!</h3>
            <p className="font-bold text-gray-700 mb-6 text-base md:text-lg">Cảm ơn em đã chia sẻ cảm nghĩ về bài học hôm nay nhé! 🥰</p>
            <button onClick={() => setShowNotification(false)} className="w-full bg-[#00FF00] text-black font-black text-xl uppercase border-4 border-black rounded-xl py-3 shadow-[4px_4px_0px_0px_#000000] hover:translate-y-1 hover:shadow-none active:translate-y-2 transition-all">ĐÓNG</button>
          </div>
        </div>
      )}
      
      {/* MODAL CLASS DIARY */}
      {showClassDiary && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white border-4 md:border-8 border-black rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-[8px_8px_0px_0px_#FF00FF]">
            <div className="bg-[#FF00FF] p-4 border-b-4 md:border-b-8 border-black flex justify-between items-center shrink-0">
              <h2 className="text-white font-black text-xl md:text-2xl uppercase">NHẬT KÝ CỦA LỚP</h2>
              <button onClick={() => setShowClassDiary(false)} className="w-8 h-8 bg-white border-4 border-black rounded-full flex items-center justify-center hover:scale-110 font-black">X</button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F5FBFF]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allReflections.map((ref: any) => (
                  <div key={ref.id} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                      <span className="font-black uppercase text-lg text-[#FF00FF]">{ref.studentName || 'Học sinh ẩn danh'}</span>
                      <span className="text-3xl">
                        {ref.emotion === 'tuyet-voi' ? '🤩' : ref.emotion === 'vui-ve' ? '😊' : ref.emotion === 'to-mo' ? '🤔' : ref.emotion === 'hoi-met' ? '😴' : '🙂'}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm italic">"{ref.content}"</p>
                  </div>
                ))}
                {allReflections.length === 0 && (
                   <div className="col-span-full text-center font-black text-gray-500 py-8">CHƯA CÓ BÉ NÀO NỘP NHẬT KÝ!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* POPUP CHÀO MỪNG */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="border-4 md:border-8 border-black rounded-3xl w-full max-w-md shadow-[8px_8px_0px_0px_#FF0000] animate-in zoom-in-50 duration-500 overflow-hidden flex flex-col">
            
            {/* HEADER */}
            <div className="bg-[#FF0000] py-3 flex items-center justify-center gap-2 border-b-4 md:border-b-8 border-black shrink-0">
              <span className="text-yellow-300 font-black text-xl">🛡️</span>
              <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-wider">LƯU Ý AN TOÀN!</h2>
            </div>
            
            {/* BODY */}
            <div className="bg-[#FFFF00] p-4 md:p-6 flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl border-2 md:border-4 border-black flex gap-3 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-transform">
                <div className="text-2xl shrink-0 mt-1">🔥</div>
                <div>
                  <h3 className="font-black text-sm md:text-base uppercase mb-1">CẦN NGƯỜI LỚN!</h3>
                  <p className="font-bold text-gray-700 text-xs md:text-sm leading-relaxed">Tuyệt đối không tự đun nước sôi. Hãy nhờ ba mẹ chuẩn bị nước ấm giúp nhé!</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-2 md:border-4 border-black flex gap-3 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-transform">
                <div className="text-2xl shrink-0 mt-1">🧼</div>
                <div>
                  <h3 className="font-black text-sm md:text-base uppercase mb-1">VỆ SINH SẠCH SẼ!</h3>
                  <p className="font-bold text-gray-700 text-xs md:text-sm leading-relaxed">Rửa tay và tráng hũ thủy tinh bằng nước sôi để vi khuẩn xấu không lọt vào sữa.</p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="bg-white p-4 md:p-5 border-t-4 md:border-t-8 border-black shrink-0 flex items-center justify-center">
              <button 
                onClick={() => setShowWelcomePopup(false)} 
                className="w-full py-3 bg-[#00FF00] text-black border-4 border-black rounded-xl font-black text-lg shadow-[4px_4px_0px_0px_#000000] hover:translate-y-1 hover:shadow-none active:translate-y-2 active:shadow-none transition-all uppercase"
              >
                BÉ NHỚ RỒI! 👍
              </button>
            </div>
            
          </div>
        </div>
      )}

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
        <header className="flex-none p-3 md:p-6 border-b-4 border-black bg-gradient-to-r from-pink-50 via-yellow-50 to-cyan-50 flex items-center justify-between z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/home')} className="w-10 h-10 md:w-12 md:h-12 bg-white border-4 border-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#000000] shrink-0 hover:bg-pink-100 group">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-black group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black font-sans uppercase text-black truncate hidden sm:block py-1 leading-relaxed">GIAI ĐOẠN 3: SAU LỚP</h1>
          </div>
          
          {/* TABS CHUYỂN HOẠT ĐỘNG */}
          <div className="flex gap-2 md:gap-4">
            {[
              { id: 1, color: 'bg-[#FF00FF]', icon: '🥣' },
              { id: 2, color: 'bg-[#FF8C00]', icon: '🎮' },
              { id: 3, color: 'bg-[#00E5FF]', icon: '🖊️' }
            ].map(act => (
              <button 
                key={act.id}
                onClick={() => setActiveTab(act.id)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-4 font-black text-xl transition-all duration-300 flex flex-col items-center justify-center group ${activeTab === act.id ? `${act.color} text-white border-black scale-110 shadow-[4px_4px_0px_0px_#000000] -translate-y-2` : 'bg-white border-gray-300 text-gray-400 hover:scale-110 hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1'}`}
              >
                <span className={`text-xl md:text-2xl ${activeTab === act.id ? 'animate-bounce' : 'group-hover:animate-bounce'}`}>{act.icon}</span>
              </button>
            ))}
          </div>
          
          <button onClick={() => router.push('/home')} className="px-4 py-2 md:px-6 md:py-3 bg-[#00FF00] border-4 border-black rounded-xl font-black text-sm md:text-base shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all hidden lg:flex items-center gap-2 text-black shrink-0">
            HOÀN THÀNH
          </button>
        </header>

        {/* WORKSPACE */}
        <main className="flex-1 min-h-0 bg-gray-50 relative overflow-hidden flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        
        {/* TAB 1: SỮA CHUA CỦA EM */}
        {activeTab === 1 && (
          <div className="w-full h-full flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
            {/* BÊN TRÁI: VIDEO (Chỉ hiển thị khi KHÔNG xem diễn đàn) */}
            {!isViewingForum && (
              <section className="flex-none lg:w-[40%] bg-gradient-to-b from-[#E0F7FA] to-white border-4 md:border-8 border-black p-3 md:p-4 rounded-[2rem] shadow-[6px_6px_0px_0px_#000000] flex flex-col min-h-0 max-h-full transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000]">
                <h2 className="text-lg md:text-xl font-black uppercase mb-2 text-[#FF00FF] flex items-center gap-2 shrink-0 drop-shadow-sm">
                  <PlayCircle className="shrink-0 w-6 h-6 md:w-8 md:h-8 animate-pulse text-[#FF00FF]" /> HƯỚNG DẪN
                </h2>
                <div className="bg-[#FF8C00] p-2 rounded-[2rem] border-4 border-black shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] overflow-hidden relative shrink-0 transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
                  <div className="bg-black rounded-xl overflow-hidden border-2 border-black flex items-center justify-center">
                    <video controls className="w-full object-cover aspect-video" src="/models/huong-dan-lam-sua-chua.mp4">
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                </div>
                <div className="mt-2 md:mt-4 p-2 md:p-3 bg-red-100 border-2 md:border-4 border-red-500 rounded-xl font-bold text-red-700 text-[11px] md:text-xs shadow-inner relative group shrink-0">
                  <div className="absolute top-1 right-1 text-xl md:text-2xl group-hover:animate-bounce">🚨</div>
                  <span className="font-black text-red-800 uppercase block mb-0.5">⚠️ Ghi nhớ:</span>
                  Hãy nhờ bố mẹ giám sát và giúp đỡ khi đun nước nóng hoặc đun sữa nhé! Tuyệt đối không tự làm một mình.
                </div>
              </section>
            )}

            {/* BÊN PHẢI: SỔ TAY / DIỄN ĐÀN */}
            <div className="flex-1 flex flex-col min-h-0 h-full">
              {!isViewingForum ? (
                <section className="bg-[#EAF6FF] border-4 border-black rounded-[2rem] shadow-[4px_4px_0px_0px_#000000] w-full flex flex-col min-h-0 overflow-hidden h-full">
                  {/* HEADER SỔ TAY */}
                  <div className="bg-[#FF00FF] p-3 md:p-4 border-b-4 border-black flex items-center justify-center gap-3 shrink-0 relative">
                    {hasSubmitted && (
                      <button onClick={() => setIsViewingForum(true)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1 rounded-xl font-black text-xs border-2 border-black hover:scale-110 shadow-[2px_2px_0px_0px_#000000]">
                        DIỄN ĐÀN 👉
                      </button>
                    )}
                    <h2 className="text-xl md:text-2xl font-black uppercase text-white drop-shadow-md tracking-wider">SỔ TAY MA THUẬT</h2>
                  </div>
                  
                  {/* FORM FIELDS */}
                  <div className="p-4 md:p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar flex-1 bg-[#F5FBFF]">
                    <div className="space-y-4">
                      {/* HÀNG 1: UPLOAD ẢNH */}
                      <div>
                        <label className="font-black text-[10px] md:text-xs block mb-1 uppercase text-gray-800">📸 ẢNH SỮA CHUA CỦA EM</label>
                        <div className="relative border-4 border-dashed border-black rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:bg-[#FFFF00] transition-colors cursor-pointer group min-h-[120px]">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          {imageUrl ? (
                            <img src={imageUrl} alt="Sữa chua" className="max-h-32 object-contain rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000]" />
                          ) : (
                            <>
                              <Camera className="w-8 h-8 md:w-10 md:h-10 text-gray-400 group-hover:text-black mb-2 animate-bounce" />
                              <span className="font-black text-[10px] md:text-xs text-gray-500 group-hover:text-black uppercase text-center">Bấm để tải ảnh lên nhé! 🌟</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* HÀNG 2: MÀU SẮC */}
                      <div>
                        <label className="font-black text-[10px] md:text-xs block mb-1 uppercase text-gray-800">MÀU SẮC</label>
                        <div className="relative">
                          <select value={color} onChange={e => setColor(e.target.value)} className="w-full border-2 border-black rounded-xl p-2 md:p-3 text-sm font-bold shadow-[2px_2px_0px_0px_#000000] outline-none focus:bg-[#FFFF00] appearance-none bg-white cursor-pointer text-[#008080]">
                            <option value="" disabled>-- Chọn màu --</option>
                            <option value="Trắng sữa mịn">🥛 Trắng sữa mịn</option>
                            <option value="Trắng ngà">Trắng ngà</option>
                            <option value="Có màu lạ">Có màu lạ</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#008080]">▼</div>
                        </div>
                      </div>

                      {/* HÀNG 3: ĐỘ ĐẶC */}
                      <div>
                        <label className="font-black text-[10px] md:text-xs block mb-1 uppercase text-gray-800">ĐỘ ĐẶC</label>
                        <div className="flex border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] overflow-hidden bg-white">
                          <button onClick={() => setState('Lỏng')} className={`flex-1 py-2 text-sm font-black border-r-2 border-black ${state === 'Lỏng' ? 'bg-[#00FF00] text-black' : 'text-blue-500 hover:bg-gray-100'}`}>LỎNG 💧</button>
                          <button onClick={() => setState('Hơi sệt')} className={`flex-1 py-2 text-sm font-black border-r-2 border-black ${state === 'Hơi sệt' ? 'bg-[#00FF00] text-black' : 'text-blue-500 hover:bg-gray-100'}`}>HƠI SỆT 🥣</button>
                          <button onClick={() => setState('Đặc')} className={`flex-1 py-2 text-sm font-black ${state === 'Đặc' ? 'bg-[#00FF00] text-black' : 'text-black hover:bg-gray-100'}`}>ĐẶC ⭐</button>
                        </div>
                      </div>

                      {/* HÀNG 4: MÙI VỊ */}
                      <div>
                        <label className="font-black text-[10px] md:text-xs block mb-1 uppercase text-gray-800">MÙI VỊ (CHẠM THẺ HOẶC TỰ GÕ)</label>
                        <input value={taste} onChange={e => setTaste(e.target.value)} className="w-full border-2 border-black rounded-xl p-2 md:p-3 text-sm font-bold shadow-[2px_2px_0px_0px_#000000] outline-none bg-white mb-2 text-gray-800 placeholder-gray-400" placeholder="Gõ vào đây hoặc chọn thẻ bên dưới..." />
                        <div className="flex flex-wrap gap-2">
                          {['+ Chua thanh 🍋', '+ Ngọt lịm 🥧', '+ Béo 🥛', '+ Hơi gắt 😖'].map(t => {
                            const val = t.replace('+ ', '');
                            return (
                            <button key={t} onClick={() => setTaste(prev => prev ? (prev.includes(val) ? prev : prev + ', ' + val) : val)} className="bg-[#FFFF00] border-2 border-black rounded-xl px-3 py-1.5 text-[10px] md:text-xs font-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_#000000] active:translate-y-1 active:shadow-none transition-all">
                              {t}
                            </button>
                          )})}
                          <button onClick={() => setTaste('')} className="bg-gray-200 border-2 border-black rounded-xl px-3 py-1.5 text-[10px] md:text-xs font-black hover:bg-red-400 hover:text-white shadow-[2px_2px_0px_0px_#000000] active:translate-y-1 active:shadow-none transition-all ml-auto">
                            XÓA LẠI
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F5FBFF] border-t-2 border-black shrink-0">
                    <button disabled={isSubmitting} onClick={handleSubmit} className="w-full bg-[#00FF00] border-4 border-black rounded-xl py-3 font-black text-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:translate-y-1 hover:shadow-none transition-all text-black uppercase">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 -rotate-45" /> {editingDiaryId ? 'CẬP NHẬT SỔ TAY' : 'NỘP SỔ TAY'}</>}
                    </button>
                  </div>
                </section>
              ) : (
                <section className="w-full relative h-full flex flex-col min-h-0">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 relative z-10 gap-2 md:gap-4 flex-none">
                    <h2 className="text-lg md:text-xl font-black uppercase text-[#FF00FF] flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                      <span className="animate-bounce">📌</span> DIỄN ĐÀN LỚP HỌC ({diaries?.length || 0})
                    </h2>
                    <button onClick={() => setIsViewingForum(false)} className="bg-white border-2 md:border-4 border-black text-black px-3 py-1.5 rounded-lg md:rounded-xl font-black text-sm uppercase hover:bg-[#FFFF00] shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-1 transition-transform flex items-center gap-1">
                      ◀ VỀ SỔ TAY
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 relative z-10 overflow-y-auto custom-scrollbar flex-1 pb-10 pt-4 px-2 items-start">
                    {diaries.map((diary, idx) => {
                      const bgColors = ['bg-[#FFF9C4]', 'bg-[#F8BBD0]', 'bg-[#B2EBF2]', 'bg-[#C8E6C9]'];
                      const rotations = ['rotate-1', '-rotate-1', 'rotate-0', '-rotate-1'];
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

                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] z-10" />
                        
                        {diary.imageUrl && (
                          <div className="mb-2 rounded-lg border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000000] bg-white cursor-pointer group">
                            <img src={diary.imageUrl} alt="Sữa chua" className="w-full h-24 md:h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        )}
                        
                        <h3 className="font-black text-sm md:text-base mb-0.5 flex items-center gap-1">👤 {diary.studentName}</h3>
                        <p className="text-gray-600 font-bold text-[10px] mb-2 italic">{new Date(diary.createdAt).toLocaleString('vi-VN')}</p>
                        
                        <div className="bg-white/80 p-2 rounded-lg border-2 border-dashed border-black mb-2 space-y-1 shadow-inner">
                          <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">🎨 Màu:</span> {diary.color}</p>
                          <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">👁️ Dạng:</span> {diary.state}</p>
                          <p className="font-medium text-xs text-gray-800 line-clamp-1"><span className="font-black text-black">👅 Vị:</span> {diary.taste}</p>
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
                              <p className="text-xs text-gray-500 font-bold bg-white p-2 rounded-lg border-2 border-dashed border-gray-400 text-center">Chưa có bình luận. Mở bát đi nào! 🚀</p>
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
                </section>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRẮC NGHIỆM */}
        {activeTab === 2 && (
          <div className="w-full h-full flex flex-col min-h-0">
             <section className="flex-1 flex flex-col relative min-h-0 w-full h-full">
              <h2 className="text-xs md:text-sm font-black uppercase mb-1 md:mb-2 text-[#FF8C00] flex items-center gap-1.5 bg-white w-max px-2 py-1 md:px-3 md:py-1 rounded-lg md:rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] shrink-0 drop-shadow-sm">
                <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 animate-bounce text-black" /> TRẮC NGHIỆM TỔNG KẾT
              </h2>
              <div className="flex-1 bg-black border-4 md:border-8 border-gray-800 rounded-[2rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative min-h-0">
                <div className="absolute top-0 left-0 w-[133.33%] h-[133.33%] origin-top-left" style={{ transform: 'scale(0.75)' }}>
                  <iframe src="https://wayground.com/join?gc=10925705&source=liveDashboard" className="w-full h-full border-none" title="Wayground Game"></iframe>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: NHẬT KÝ & CẢM NHẬN */}
        {activeTab === 3 && (
          <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
             <section className="w-full relative shrink-0 flex-1 flex flex-col min-h-0 px-2 md:px-4 py-2">
              


              <div className="flex justify-between items-center mb-2 md:mb-3 relative shrink-0">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black drop-shadow-sm flex items-center gap-3 w-full justify-center">
                  NHẬT KÝ BÀI HỌC
                </h2>
                {isTeacher && (
                  <button 
                    onClick={() => { setShowClassDiary(true); fetchReflection(); }}
                    className="absolute right-0 bg-[#FF00FF] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all flex items-center gap-2"
                  >
                    👁️ XEM LỚP
                  </button>
                )}
              </div>
              
              <div className="max-w-5xl mx-auto w-full flex flex-col gap-2 md:gap-4 flex-1 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-stretch flex-1 min-h-0">
                  {/* BOX 1 */}
                  <div className="bg-[#F5FBFF] border-4 border-black rounded-3xl p-3 md:p-4 relative shadow-[4px_4px_0px_0px_#00E5FF] h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#FFFF00] rounded-full border-4 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000000]">1</div>
                    <label className="font-black text-base md:text-lg block mb-2 md:mb-3 text-black text-center uppercase shrink-0">
                      HÔM NAY EM CẢM THẤY THẾ NÀO?
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1">
                      {[
                        { emoji: '🤩', text: 'Tuyệt vời', value: 'tuyet-voi', color: 'bg-[#FFFF00]' },
                        { emoji: '😊', text: 'Vui vẻ', value: 'vui-ve', color: 'bg-[#00FF00]' },
                        { emoji: '🤔', text: 'Tò mò', value: 'to-mo', color: 'bg-[#00E5FF]' },
                        { emoji: '😴', text: 'Hơi mệt', value: 'hoi-met', color: 'bg-gray-300' }
                      ].map(item => (
                        <button 
                          key={item.value}
                          onClick={() => setReflectionEmotion(item.value)}
                          className={`flex flex-col items-center justify-center w-full h-full py-1 md:py-2 px-2 border-4 border-black rounded-2xl transition-all duration-300 group ${reflectionEmotion === item.value ? 'ring-4 ring-black scale-105 ' + item.color + ' -translate-y-1 shadow-[4px_4px_0px_0px_#000000]' : 'bg-white hover:scale-105 shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]'}`}
                        >
                          <span className="text-3xl md:text-4xl mb-1 group-hover:animate-bounce">{item.emoji}</span>
                          <span className="font-black uppercase text-[10px] md:text-xs">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BOX 2 */}
                  <div className="bg-[#FFF0F5] border-4 border-black rounded-3xl p-3 md:p-4 relative shadow-[4px_4px_0px_0px_#FF00FF] h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#00FF00] rounded-full border-4 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000000]">2</div>
                    <label className="font-black text-base md:text-lg block mb-2 md:mb-3 text-black text-center uppercase shrink-0">
                      EM ẤN TƯỢNG NHẤT ĐIỀU GÌ?
                    </label>
                    <textarea 
                      value={reflectionContent}
                      onChange={e => setReflectionContent(e.target.value)}
                      placeholder="Hãy viết vài dòng chia sẻ suy nghĩ của em nhé... ✍️"
                      className="w-full p-3 border-4 border-black rounded-2xl font-bold text-sm md:text-base flex-1 shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#FFFF00] transition-colors leading-relaxed resize-none min-h-[80px]"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmittingReflection} 
                  onClick={handleReflectionSubmit} 
                  className="w-full py-2.5 md:py-3 bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_#FF0000] font-black text-lg md:text-xl uppercase rounded-3xl flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FF0000] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#FF0000] transition-all disabled:opacity-50 shrink-0 mt-2"
                >
                  {isSubmittingReflection ? <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" /> : (hasReflected ? 'CẬP NHẬT NHẬT KÝ' : 'GỬI NHẬT KÝ')}
                </button>
              </div>
            </section>
          </div>
        )}

          </div>
        </main>
      </div>
    </div>
  );
}
