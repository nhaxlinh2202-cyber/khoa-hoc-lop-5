"use client";
import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ClipboardList, CheckCircle, ShieldAlert, Maximize, Minimize, BookHeart, Video } from 'lucide-react';
import { INITIAL_DIARY_ENTRIES } from '../../../data';
import { AppleEmoji } from '../../../components/shared/AppleEmoji';

export default function ActivityOne() {
  const [entries, setEntries] = useState<any[]>(INITIAL_DIARY_ENTRIES);

  useEffect(() => {
    fetch('/api/diary')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.diaries.length > 0) setEntries(data.diaries);
      })
      .catch((err) => console.error(err));
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [startTime, setStartTime] = useState('');
  const [color, setColor] = useState('Trắng sữa');
  const [state, setState] = useState<'lỏng' | 'hơi_đặc' | 'đặc'>('đặc');
  const [taste, setTaste] = useState('');
  const [notes, setNotes] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [showSafetyModal, setShowSafetyModal] = useState(true);

  const tasteTags = ["Chua thanh 🍋", "Ngọt lịm 🍯", "Béo 🥛", "Hơi gắt 😖"];
  const notesTags = ["Nhiệt độ ấm 🌡️", "Ủ thùng xốp 📦", "Quấn chăn kín 🛌", "Nước nguội 🧊"];

  const handleAddTag = (setter: any, currentValue: string, tag: string) => {
    setter(currentValue ? `${currentValue}, ${tag}` : tag);
  };

  const handleSubmitDiary = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentGroup.trim() || !startTime.trim()) {
      setNotificationMsg('Thiếu thông tin rồi bé ơi!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentGroup, startTime, color, state, taste: taste || 'Chưa ghi nhận', notes }),
      });
      const data = await res.json();
      if (data.success) {
        setEntries([data.diary, ...entries]);
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepKey: 'hd1' }),
        });
        setStudentName(''); setStudentGroup(''); setStartTime(''); setTaste(''); setNotes('');
        setNotificationMsg('🎉 Nộp sổ tay thành công!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } else {
        setNotificationMsg(data.error || 'Có lỗi xảy ra!');
        setShowNotification(true);
      }
    } catch (err) {
      console.error(err);
      setNotificationMsg('Lỗi mạng! Hãy thử lại nha!');
      setShowNotification(true);
    }
  };

  return (
    <section id="hd1" className="min-h-screen w-full flex flex-col p-4 bg-[#00E5FF] font-sans">
      
      {/* HEADER (Compact) */}
      <header className="flex-none bg-white px-6 py-3 rounded-2xl shadow-[8px_8px_0px_0px_#000000] border-4 border-black mb-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#FF0000] text-white font-black text-lg uppercase border-2 border-black flex items-center gap-1">
            <AppleEmoji symbol="🌟" /> Chặng 1
          </div>
          <h2 className="font-display font-black text-2xl text-black uppercase">
            LÀM SỮA CHUA <span className="text-[#FF00FF]">TUYỆT NGON!</span>
          </h2>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        
        {/* LEFT — Video Player (50%) */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className={`flex-1 bg-[#FFFF00] rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-4 flex flex-col transition-all ${isFullscreen ? 'fixed inset-4 z-[100] bg-[#FFFF00]' : ''}`}>
            
            <div className="flex-none bg-black text-white px-4 py-2 rounded-full flex items-center justify-between mb-3 border-2 border-white">
              <span className="font-black text-lg uppercase flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FF0000]" /> TIVI KHOA HỌC
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-white text-black px-3 py-1 rounded-full font-black text-sm flex items-center gap-1 border-2 border-black uppercase"
              >
                {isFullscreen ? <><Minimize className="w-4 h-4"/> THU NHỎ</> : <><Maximize className="w-4 h-4"/> PHÓNG TO</>}
              </motion.button>
            </div>

            <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border-4 border-black shadow-inner flex items-center justify-center">
              <video
                className="w-full h-full object-contain outline-none"
                controls
                preload="metadata"
                src="/models/huong-dan-lam-sua-chua.mp4"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSafetyModal(true)}
            className="flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#FF0000] text-white border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_#000000]"
          >
            <ShieldAlert className="w-6 h-6 text-[#FFFF00]" /> Cẩm nang an toàn ⚠
          </motion.button>
        </div>

        {/* RIGHT — Kid Friendly Diary Form (50%) */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_#FF00FF] flex flex-col overflow-hidden">
            
            <div className="flex-none bg-[#FF00FF] text-white px-6 py-4 flex items-center gap-3 border-b-4 border-black">
              <div className="p-2 bg-white border-2 border-black rounded-full">
                <BookHeart className="w-5 h-5 text-[#FF00FF]" />
              </div>
              <span className="font-black text-xl uppercase flex items-center gap-2">SỔ TAY MA THUẬT <AppleEmoji symbol="📝" /></span>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F0F8FF] custom-scrollbar">
              <form onSubmit={handleSubmitDiary} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-sm text-black uppercase mb-1">Tên nhà KH *</label>
                    <input type="text" required placeholder="Tên bé..." value={studentName} onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white border-2 border-black focus:bg-[#FFFF00] font-bold text-base outline-none" />
                  </div>
                  <div>
                    <label className="block font-black text-sm text-black uppercase mb-1">Nhóm/Lớp *</label>
                    <input type="text" required placeholder="Ví dụ: Tổ 1" value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white border-2 border-black focus:bg-[#FFFF00] font-bold text-base outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-sm text-black uppercase mb-1">Giờ ủ sữa *</label>
                    <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white border-2 border-black focus:bg-[#FFFF00] font-bold text-base outline-none" />
                  </div>
                  <div>
                    <label className="block font-black text-sm text-black uppercase mb-1">Màu sắc</label>
                    <select value={color} onChange={(e) => setColor(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white border-2 border-black focus:bg-[#FFFF00] font-bold text-base outline-none cursor-pointer">
                      <option value="Trắng sữa">🥛 Trắng sữa mịn</option>
                      <option value="Hơi vàng ngà">🟡 Hơi vàng ngà</option>
                      <option value="Có mốc trắng">⚠️ Có mốc lạ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-sm text-black uppercase mb-2">ĐỘ ĐẶC</label>
                  <div className="flex bg-white rounded-xl p-1 border-2 border-black">
                    {[
                      { val: 'lỏng' as const, label: 'Lỏng 💧' },
                      { val: 'hơi_đặc' as const, label: 'Hơi Sệt 🥣' },
                      { val: 'đặc' as const, label: 'Đặc ⭐' },
                    ].map((st) => (
                      <button key={st.val} type="button" onClick={() => setState(st.val)}
                        className={`flex-1 py-2 font-bold text-sm uppercase rounded-lg transition-colors border-2 border-transparent
                          ${state === st.val ? 'bg-[#00FF00] border-black text-black' : 'text-gray-500 hover:bg-gray-100'}
                        `}>
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-black text-sm text-black uppercase mb-1">Mùi vị (Chạm thẻ)</label>
                  <input type="text" value={taste} onChange={(e) => setTaste(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white border-2 border-black focus:bg-[#FFFF00] font-bold text-base outline-none mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {tasteTags.map(tag => (
                      <button key={tag} type="button" onClick={() => handleAddTag(setTaste, taste, tag)}
                        className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black rounded-full font-bold text-sm hover:scale-105 transition-transform">
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-[#00FF00] text-black border-4 border-black font-black text-xl uppercase shadow-[4px_4px_0px_0px_#000000]">
                  <Send className="w-6 h-6" /> Nộp Sổ Tay
                </motion.button>
              </form>

              {/* Notification */}
              <AnimatePresence>
                {showNotification && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-xl bg-[#FFFF00] border-4 border-black text-black font-black text-base flex items-center justify-center gap-2 uppercase shadow-lg">
                    <CheckCircle className="w-6 h-6 text-[#00FF00] bg-black rounded-full" /> {notificationMsg}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

      </div>

      {/* ── SAFETY MODAL ── */}
      <AnimatePresence>
        {showSafetyModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSafetyModal(false)} />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#FF0000] z-10 overflow-hidden"
            >
              <div className="bg-[#FF0000] p-4 text-center border-b-4 border-black">
                <h3 className="font-black text-xl text-white uppercase flex justify-center items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-[#FFFF00]" /> LƯU Ý AN TOÀN!
                </h3>
              </div>

              <div className="p-6 space-y-4 bg-[#FFFF00]">
                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border-2 border-black">
                  <AppleEmoji symbol="🔥" className="w-8 h-8 mt-1" />
                  <div>
                    <p className="font-black text-lg text-black uppercase mb-1">Cần người lớn!</p>
                    <p className="text-sm font-bold text-gray-700">Tuyệt đối không tự đun nước sôi. Hãy nhờ ba mẹ chuẩn bị nước ấm giúp nhé!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border-2 border-black">
                  <AppleEmoji symbol="🧼" className="w-8 h-8 mt-1" />
                  <div>
                    <p className="font-black text-lg text-black uppercase mb-1">Vệ sinh sạch sẽ!</p>
                    <p className="text-sm font-bold text-gray-700">Rửa tay và tráng hũ thủy tinh bằng nước sôi để vi khuẩn xấu không lọt vào sữa.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t-4 border-black">
                <motion.button onClick={() => setShowSafetyModal(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-[#00FF00] text-black border-2 border-black rounded-xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_#000000]">
                  Bé nhớ rồi! 👍
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
