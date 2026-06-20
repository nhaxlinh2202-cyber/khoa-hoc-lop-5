"use client";
import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Send,
  ClipboardList,
  Clock,
  CheckCircle,
  ShieldAlert,
  X,
  FlaskConical,
  Pen,
  Maximize,
  Minimize,
} from 'lucide-react';
import { DiaryEntry } from '../../../types';
import { INITIAL_DIARY_ENTRIES } from '../../../data';

/* ═══════════════════════════════════════════════════════════
   HĐ1 — Trải nghiệm: Tự tay làm sữa chua
   Swiss Brutalist · THCS-friendly · Science Notebook Form
   ═══════════════════════════════════════════════════════════ */

export default function ActivityOne() {
  /* ── Diary persistence ── */
  const [entries, setEntries] = useState<any[]>(INITIAL_DIARY_ENTRIES);

  useEffect(() => {
    fetch('/api/diary')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.diaries.length > 0) {
          setEntries(data.diaries);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  /* ── Video State ── */
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ── Form state ── */
  const [studentName, setStudentName] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [startTime, setStartTime] = useState('');
  const [color, setColor] = useState('Trắng sữa');
  const [state, setState] = useState<'lỏng' | 'hơi_đặc' | 'đặc'>('đặc');
  const [taste, setTaste] = useState('');
  const [notes, setNotes] = useState('');

  /* ── Notifications ── */
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  /* ── Safety modal ── */
  const [showSafetyModal, setShowSafetyModal] = useState(true);

  // Force show on every mount (fixes Next.js client cache issues)
  useEffect(() => {
    setShowSafetyModal(true);
  }, [setShowSafetyModal]);

  /* ── Form submit ── */
  const handleSubmitDiary = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentGroup.trim() || !startTime.trim()) {
      setNotificationMsg(
        'Vui lòng điền đầy đủ các ô bắt buộc (*) trước khi gửi nhật ký!',
      );
      setShowNotification(true);
      return;
    }

    try {
      // 1. Submit diary
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentGroup,
          startTime,
          color,
          state,
          taste: taste || 'Chưa ghi nhận',
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEntries([data.diary, ...entries]);
        
        // 2. Update progress
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepKey: 'hd1' }),
        });

        setStudentName('');
        setStudentGroup('');
        setStartTime('');
        setTaste('');
        setNotes('');

        setNotificationMsg(
          '✓ Nhật ký thực hành đã được lưu thành công! Xem kết quả trong bảng tổng hợp bên dưới.',
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } else {
        setNotificationMsg(data.error || 'Có lỗi xảy ra.');
        setShowNotification(true);
      }
    } catch (err) {
      console.error(err);
      setNotificationMsg('Có lỗi xảy ra khi lưu nhật ký. Vui lòng thử lại!');
      setShowNotification(true);
    }
  };

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <section
      id="hd1"
      className="py-12 md:py-20 px-5 sm:px-8 lg:px-12 bg-science-bg"
    >
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <header className="mb-14">
          <div className="flex items-start gap-4 mb-3">
            <span className="font-mono text-6xl md:text-7xl font-black text-science-dark/[0.06] leading-none select-none shrink-0">
              01
            </span>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-science-dark/60 mb-1">
                Kolb — Concrete Experience · Bước tại nhà
              </span>
              <h2 className="font-display font-bold text-2xl md:text-4xl text-science-dark tracking-tight leading-tight">
                Tự tay làm sữa chua{' '}
                <span className="underline decoration-2 decoration-science-base underline-offset-4">
                  ngon lành
                </span>
              </h2>
            </div>
          </div>
          <p className="text-sm md:text-base text-science-dark/80 max-w-3xl leading-relaxed ml-0 md:ml-[calc(theme(spacing.4)+4rem)]">
            Tại nhà, em hãy xem video hướng dẫn chi tiết, tự tay thực hiện mẻ
            sữa chua đầu tiên dưới sự hỗ trợ của bố mẹ, sau đó điền nhật ký
            quan sát khoa học để ghi lại kết quả thí nghiệm.
          </p>
        </header>

        {/* ─── Main 2-column grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* ═══════ LEFT — Video Player ═══════ */}
          <div className="space-y-8">
            {/* Video Card — Brutalist shadow */}
            <div
              className={`bg-white border-2 border-science-dark overflow-hidden transition-all duration-300 ${
                isFullscreen ? 'fixed inset-4 z-[100] shadow-[12px_12px_0px_0px_var(--color-science-dark)] flex flex-col' : ''
              }`}
              style={{
                boxShadow: isFullscreen ? '12px 12px 0px 0px #000000' : '6px 6px 0px 0px #000000',
              }}
            >
              {/* Overlay backdrop when fullscreen */}
              {isFullscreen && (
                <div
                  className="fixed inset-0 bg-science-base/60 backdrop-blur-sm -z-10"
                  onClick={() => setIsFullscreen(false)}
                />
              )}

              {/* Top bar */}
              <div className="bg-science-base text-white px-5 py-3 flex items-center justify-between shrink-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  🎬 Video hướng dẫn làm sữa chua
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500" />
                  <span className="w-2.5 h-2.5 bg-yellow-400" />
                  <span className="w-2.5 h-2.5 bg-emerald-400" />
                </span>
              </div>

              {/* Video viewport */}
              <div className={`bg-[#0A0A0A] relative flex flex-col justify-center items-center overflow-hidden ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
                <video
                  className="w-full h-full object-contain outline-none"
                  controls
                  preload="metadata"
                  src="/models/huong-dan-lam-sua-chua.mp4"
                >
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              </div>

              {/* Controller bar */}
              <div className="p-4 bg-white border-t-2 border-science-dark flex items-center justify-end shrink-0">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-science-dark bg-white text-science-dark hover:bg-science-base hover:text-white transition-all cursor-pointer"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-3.5 h-3.5" />
                      <span>Thu nhỏ</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-3.5 h-3.5" />
                      <span>Phóng to</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── Safety Warning Button ── */}
            <button
              onClick={() => setShowSafetyModal(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-science-dark bg-[#FFF8E1] text-science-dark
                         font-mono text-xs font-bold uppercase tracking-widest
                         hover:bg-[#FFECB3] transition-colors cursor-pointer"
              style={{ boxShadow: '4px 4px 0px 0px var(--color-science-dark)' }}
            >
              <ShieldAlert className="w-5 h-5 text-[#E65100]" />
              <span>⚠ Lưu ý an toàn khi thực hành</span>
            </button>
          </div>

          {/* ═══════ RIGHT — Science Notebook Diary Form ═══════ */}
          <div
            className="bg-white border-2 border-science-dark overflow-hidden"
            style={{ boxShadow: '6px 6px 0px 0px var(--color-science-dark)' }}
          >
            {/* Notebook header */}
            <div className="bg-science-base text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest">
                  Sổ tay khoa học — Nhật ký thực hành
                </span>
              </div>
              <FlaskConical className="w-4 h-4 text-neutral-400" />
            </div>

            {/* Notebook body — lined background */}
            <div
              className="px-6 sm:px-8 py-8"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 31px, #E8E8E8 31px, #E8E8E8 32px)',
                backgroundSize: '100% 32px',
              }}
            >
              {/* Red margin line */}
              <div
                className="relative"
                style={{
                  borderLeft: '2px solid #FFCDD2',
                  paddingLeft: '20px',
                }}
              >
                <form onSubmit={handleSubmitDiary} className="space-y-6">
                  {/* Row 1: Name + Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                        <Pen className="w-3 h-3 text-neutral-400" />
                        Họ tên học sinh *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A..."
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white focus:border-science-dark transition-colors placeholder:text-[#CCCCCC]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                        Nhóm / Lớp *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nhóm 3 — Lớp 7A1"
                        value={studentGroup}
                        onChange={(e) => setStudentGroup(e.target.value)}
                        className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Time + Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        Giờ bắt đầu ủ *
                      </label>
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                        Màu sắc quan sát
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="Trắng sữa">🥛 Trắng sữa mịn</option>
                        <option value="Hơi vàng nhạt">🟡 Hơi vàng ngà</option>
                        <option value="Có chấm mốc trắng">
                          ⚠️ Có chấm lạ (cần kiểm tra)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: State (segmented control) */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-science-dark mb-3 uppercase tracking-widest">
                      Trạng thái đông đặc
                    </label>
                    <div className="grid grid-cols-3 gap-0 border-2 border-science-dark overflow-hidden">
                      {[
                        { val: 'lỏng' as const, label: '💧 Còn lỏng', sub: 'Chưa đạt' },
                        { val: 'hơi_đặc' as const, label: '🥣 Hơi sệt', sub: 'Tạm được' },
                        { val: 'đặc' as const, label: '⭐ Đặc mịn', sub: 'Thành công!' },
                      ].map((st, idx) => (
                        <button
                          key={st.val}
                          type="button"
                          onClick={() => setState(st.val)}
                          className={`py-3 px-2 text-center transition-all cursor-pointer ${
                            idx < 2 ? 'border-r-2 border-science-dark' : ''
                          } ${
                            state === st.val
                              ? 'bg-science-base text-white'
                              : 'bg-white text-science-dark/70 hover:bg-[#F5F5F5]'
                          }`}
                        >
                          <span className="block text-sm font-bold">{st.label}</span>
                          <span className={`block text-[9px] font-mono mt-0.5 ${
                            state === st.val ? 'text-neutral-300' : 'text-[#AAAAAA]'
                          }`}>
                            {st.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Taste */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                      Mùi vị cảm nhận
                    </label>
                    <input
                      type="text"
                      placeholder="Vd: Chua thanh nhẹ, hậu vị béo ngọt..."
                      value={taste}
                      onChange={(e) => setTaste(e.target.value)}
                      className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
                    />
                  </div>

                  {/* Row 5: Notes */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-science-dark mb-2 uppercase tracking-widest">
                      Ghi chú thêm
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả thêm về mẻ ủ: nhiệt độ phòng, thời gian thực tế..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-sm px-4 py-3 border-2 border-science-dark bg-science-bg focus:outline-none focus:bg-white transition-colors resize-none placeholder:text-[#CCCCCC]"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-science-base text-white text-[11px] font-mono font-bold uppercase tracking-widest
                               border-2 border-science-dark hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi nhật ký thực hành</span>
                  </button>
                </form>

                {/* ── Notification Toast ── */}
                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-[#F5F5F5] border-2 border-science-dark text-science-dark text-xs font-mono font-bold flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0 text-science-dark mt-0.5" />
                      <span className="leading-relaxed">{notificationMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Submitted Diary Table ═══════ */}
        <div
          className="mt-14 bg-white border-2 border-science-dark overflow-hidden"
          style={{ boxShadow: '6px 6px 0px 0px var(--color-science-dark)' }}
        >
          <div className="bg-science-base text-white px-6 py-3 flex items-center justify-between">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400" />
              Nhật ký thực hành của cả lớp
            </h3>
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">
              {entries.length} bản ghi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-science-dark bg-[#F5F5F5] text-science-dark">
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px]">
                    Tên
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px]">
                    Nhóm / Lớp
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px] text-center">
                    Giờ ủ
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px]">
                    Màu sắc
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px] text-center">
                    Đông đặc
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px]">
                    Mùi vị
                  </th>
                  <th className="p-4 font-mono uppercase tracking-wider font-extrabold text-[10px]">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {entries.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-science-bg transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-science-dark">
                      {item.studentName}
                    </td>
                    <td className="p-4 text-science-dark/80 font-medium">
                      {item.studentGroup}
                    </td>
                    <td className="p-4 text-science-dark/80 text-center font-mono">
                      {item.startTime}
                    </td>
                    <td className="p-4 text-science-dark/80 font-medium">
                      {item.color}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider border-2 ${
                          item.state === 'đặc'
                            ? 'bg-science-base text-white border-science-dark'
                            : item.state === 'hơi_đặc'
                              ? 'bg-[#F5F5F5] text-science-dark border-science-dark'
                              : 'bg-white text-red-600 border-red-600'
                        }`}
                      >
                        {item.state === 'đặc'
                          ? 'Đặc mịn ★'
                          : item.state === 'hơi_đặc'
                            ? 'Hơi sệt 🥣'
                            : 'Lỏng 💧'}
                      </span>
                    </td>
                    <td className="p-4 text-science-dark/80 font-medium">
                      {item.taste}
                    </td>
                    <td className="p-4 text-xs text-neutral-500 max-w-sm font-medium italic">
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════════════ Safety Modal Popup ═══════════════ */}
      <AnimatePresence>
        {showSafetyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-science-base/60 backdrop-blur-sm"
              onClick={() => setShowSafetyModal(false)}
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-[#FFF8E1] border-2 border-science-dark z-10"
              style={{ boxShadow: '8px 8px 0px 0px var(--color-science-dark)' }}
            >
              {/* Modal header */}
              <div className="bg-[#FFC107] border-b-2 border-science-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-science-dark" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-science-dark">
                    Cảnh báo an toàn
                  </span>
                </div>
                <button
                  onClick={() => setShowSafetyModal(false)}
                  className="p-1 hover:bg-science-base/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-science-dark" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E65100] text-white shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 text-sm text-science-dark leading-relaxed">
                    <p className="font-bold">
                      🔥 Sử dụng nước nóng — Bắt buộc có phụ huynh!
                    </p>
                    <p>
                      Quá trình chuẩn bị nước ấm (40–45 °C) để hòa sữa{' '}
                      <strong>
                        bắt buộc phải có sự hỗ trợ trực tiếp của bố mẹ hoặc
                        người lớn
                      </strong>
                      . Các em tuyệt đối không tự ý đun nước sôi hoặc sử dụng
                      nước nóng khi chưa có sự giám sát.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E65100] text-white shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 text-sm text-science-dark leading-relaxed">
                    <p className="font-bold">
                      🧫 Vệ sinh dụng cụ — Tiệt trùng hũ đựng!
                    </p>
                    <p>
                      Trước khi rót sữa, tất cả hũ thuỷ tinh và thìa khuấy
                      phải được{' '}
                      <strong>tráng qua nước sôi để diệt khuẩn có hại</strong>.
                      Điều này giúp vi khuẩn Lactobacillus có lợi không bị
                      cạnh tranh bởi tạp khuẩn.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#FFE082] border-2 border-science-dark text-xs font-mono text-science-dark leading-relaxed">
                  <strong>📋 Quy tắc vàng:</strong> Luôn rửa tay sạch bằng xà
                  phòng → Tiệt trùng dụng cụ → Có người lớn giám sát → Ghi
                  chú nhật ký khi ủ xong.
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t-2 border-science-dark bg-[#FFF8E1]">
                <button
                  onClick={() => setShowSafetyModal(false)}
                  className="w-full py-3 bg-science-base text-white font-mono text-[11px] font-bold uppercase tracking-widest
                             border-2 border-science-dark hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Tôi đã hiểu — Đóng cảnh báo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

