"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Award, CheckCircle, Table, BrainCircuit, X } from 'lucide-react';
import { RUBRIC_CRITERIA } from '../../../data';

export default function ActivityTwo() {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('lactic_rubric_ratings') : null);
    return saved ? JSON.parse(saved) : {
      'do-dac': 5,
      'vi-chua-ngot': 4,
      'mau-sac': 5,
      'mui-huong': 5,
      'nhat-ky-onl': 4,
    };
  });

  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  const reflections = [
    {
      q: 'Sữa chua và sữa trước khi ủ có những khác biệt gì về mùi, vị, độ đặc?',
      a: 'Sữa trước khi ủ có dạng lỏng, vị ngọt béo và mùi thơm của sữa. Sau khi ủ thành sữa chua, sản phẩm chuyển sang trạng thái đặc sánh (đông tụ), có vị chua dịu và mùi thơm nồng nhẹ đặc trưng do quá trình lên men của vi khuẩn Lactic.'
    },
    {
      q: 'Vì sao cần cho sữa chua vào sữa tươi (hoặc sữa đặc đã pha loãng)?',
      a: 'Đó chính là bước "cấy men giống"! Hộp sữa chua mồi đóng vai trò cung cấp hàng tỷ vi khuẩn Lactic sống. Khi được cho vào môi trường sữa nhiều dinh dưỡng, vi khuẩn Lactic sẽ bắt đầu "ăn" đường, sinh sôi nảy nở và lên men toàn bộ mẻ sữa.'
    },
    {
      q: 'Vì sao trong quá trình làm sữa chua cần ủ ấm sữa ở nhiệt độ khoảng 40°C đến 50°C?',
      a: 'Nhiệt độ 40°C - 50°C là điều kiện lý tưởng nhất để vi khuẩn Lactic hoạt động. Ở mức nhiệt này, chúng phát triển mạnh mẽ và lên men nhanh chóng. Nếu ủ lạnh quá vi khuẩn sẽ "ngủ đông", còn nếu nóng quá (>50°C) vi khuẩn sẽ bị biến tính và chết!'
    }
  ];

  const handleStarClick = (critId: string, starVal: number) => {
    const updated = {
      ...ratings,
      [critId]: starVal
    };
    setRatings(updated);
    if (typeof window !== 'undefined') localStorage.setItem('lactic_rubric_ratings', JSON.stringify(updated));
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd2' }) }).catch(console.error);
  };

  const totalPossible = Object.keys(ratings).length * 5;
  const currentTotal = (Object.values(ratings) as number[]).reduce((a, b) => a + b, 0);
  const scorePercent = Math.round((currentTotal / totalPossible) * 100);

  const getRubricVerdict = (percent: number) => {
    if (percent >= 90) return { title: 'HOÀN HẢO MỸ MÃN 🏆', msg: 'Một mẻ vi khuẩn Lactic phát triển tuyệt vời, sữa dẻo thơm, đặc sánh chín sữa mịn!', color: 'text-white bg-[#111111] border-science-dark' };
    if (percent >= 70) return { title: 'ĐẠT CHUẨN TỐT 👍', msg: 'Sữa đông ấm miệng, chua ngọt tròn vị, nhật trình viết tay khá đầy đủ. Cố gắng phát huy con nhé!', color: 'text-science-dark bg-white border-2 border-science-dark' };
    return { title: 'CẦN CẢI THIỆN THÊM 🧪', msg: 'Sữa chua có thể chưa đủ ẩm hoặc chưa chuẩn thời gian ủ mồi. Em hãy mở HĐ4 tham khảo mẹo cứu nhé!', color: 'text-white bg-[#B00020] border-[#B00020]' };
  };

  const verdict = getRubricVerdict(scorePercent);

  return (
    <section id="hd2" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-science-bg border-b border-science-dark/20">
      <div className="max-w-7xl mx-auto">

        {/* Step Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-mono text-5xl md:text-6xl font-bold text-[#D9D9D9] leading-none">02</span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-science-dark/70 block">Bước 2: Cùng xem lại &amp; Đánh giá (Kolb - Phản ngẫm)</span>
              <h2 className="font-display font-medium text-2xl md:text-3xl text-science-dark tracking-tight">
                HĐ2 — Cùng chấm điểm Rubric &amp; Thảo luận
              </h2>
            </div>
          </div>
          <p className="text-sm md:text-base text-science-dark/70 max-w-3xl leading-relaxed mt-2">
            Học sinh mang sản phẩm sữa chua tự làm tới lớp. Thầy cô và cả lớp đóng vai những chuyên gia ẩm thực nhí để chấm điểm chéo các hũ sữa chua và cùng trả lời những câu hỏi khoa học thú vị nhé.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Interactive Star Rubric Selection Panel */}
          <div className="p-6 sm:p-8 bg-white border border-science-dark/20 rounded-none space-y-6">
            <div className="flex items-center justify-between border-b border-science-dark/20 pb-4">
              <div>
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-science-dark flex items-center space-x-2">
                  <Award className="w-5 h-5 text-science-dark" />
                  <span>Trình Chiếu Rubric Chữ Vàng</span>
                </h3>
                <p className="text-[11px] text-science-dark/70 mt-1">Click chấm sao chéo hũ của nhóm bạn em nhé!</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-science-dark/70 uppercase block tracking-wider font-bold">Điểm số</span>
                <span className="font-mono text-xl font-bold text-science-dark">{currentTotal} / {totalPossible}</span>
              </div>
            </div>

            {/* Rubric rows */}
            <div className="space-y-4">
              {RUBRIC_CRITERIA.map((crit) => {
                const currentRating = ratings[crit.id] || 0;
                return (
                  <div key={crit.id} className="space-y-1.5 p-4 rounded-none bg-science-bg border border-science-dark/20 hover:border-science-dark transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-science-dark font-mono uppercase tracking-wide">{crit.label}</span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-science-dark/70">Bậc {currentRating}/5</span>
                    </div>
                    <p className="text-xs text-science-dark/70 leading-relaxed pr-6">{crit.description}</p>

                    {/* Stars element */}
                    <div className="flex space-x-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(crit.id, star)}
                          className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= currentRating
                                ? 'fill-black text-science-dark'
                                : 'text-[#D9D9D9] hover:text-science-dark'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live calculated verdict */}
            <div className={`p-5 rounded-none border ${verdict.color} transition-all duration-300`}>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />
                <span>Kết Quả Đánh Giá: {verdict.title} ({scorePercent}%)</span>
              </h4>
              <p className="text-xs leading-relaxed opacity-95">{verdict.msg}</p>
            </div>
          </div>

          {/* Right side: Reflective Questions Cards & Classroom Dashboard Table */}
          <div className="space-y-8">

            {/* Reflection Flashcards */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-science-dark" />
                <h3 className="font-mono font-bold text-xs tracking-widest text-science-dark uppercase">
                  GÓC ÔN TẬP PHẢN NGẪM SÂU
                </h3>
              </div>
              <p className="text-xs text-science-dark/70">Các em hãy bấm vào câu hỏi dưới đây xem trả lời khoa học nha!</p>

              <div className="space-y-3">
                {reflections.map((ref, idx) => {
                  const isOpen = activeQuestion === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-science-dark/20 rounded-none overflow-hidden bg-white transition-all duration-200"
                    >
                      <button
                        onClick={() => setActiveQuestion(isOpen ? null : idx)}
                        className="w-full text-left p-4 focus:outline-none flex justify-between items-center bg-science-bg hover:bg-[#F2F2F2] transition-colors"
                      >
                        <span className="text-xs font-mono font-bold text-science-dark uppercase tracking-wider leading-snug">
                          0{idx + 1}. {ref.q}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-science-dark shrink-0 ml-4">
                          {isOpen ? '[- THU GỌN]' : '[+ XEM TỰ LUẬN]'}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="p-4 border-t border-science-dark/20 bg-white text-xs text-science-dark/70 leading-relaxed font-sans">
                          {ref.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison of classroom teams - Image Showcase */}
            <div className="bg-white border border-science-dark/20 rounded-none p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-science-dark/20 pb-3">
                <Table className="w-4 h-4 text-science-dark" />
                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-science-dark">
                  Hình Ảnh Thực Nghiệm 3 Nhóm Mẫu
                </h4>
              </div>

              <div className="bg-white border-2 border-science-dark p-2 shadow-[4px_4px_0px_0px_var(--color-science-dark)]">
                {/* Clickable image — opens lightbox */}
                <div
                  className="aspect-video relative overflow-hidden bg-[#F2F2F2] border border-science-dark/20 group cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src="/models/yogurt_comparison.png"
                    alt="So sánh 3 trạng thái của sữa chua: Đặc hoàn hảo, Lỏng do thiếu men, và Tách nước do quá nóng"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-science-base/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-mono text-xs font-bold uppercase tracking-widest border border-white px-4 py-2">
                      🔍 Phóng to ảnh
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-3 px-2 pb-1 text-center">
                  <p className="text-xs text-science-dark/70 leading-relaxed">
                    <strong>Từ trái sang:</strong> Nhóm 1 (Đặc sánh mịn) — Nhóm 2 (Lỏng như nước) — Nhóm 3 (Bị tách nước, chua gắt).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image container — stop propagation so clicking image doesn't close modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/models/yogurt_comparison.png"
                alt="So sánh 3 trạng thái của sữa chua"
                className="w-full h-auto border-2 border-white/20 shadow-2xl"
              />
              <div className="mt-3 text-center">
                <p className="text-white/70 font-mono text-[11px] uppercase tracking-widest">
                  Từ trái sang: Nhóm 1 (Đặc sánh mịn) — Nhóm 2 (Lỏng như nước) — Nhóm 3 (Bị tách nước, chua gắt)
                </p>
                <p className="text-white/40 font-mono text-[10px] mt-1">Nhấn ESC hoặc click ra ngoài để đóng</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
