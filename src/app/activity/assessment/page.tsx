"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Lightbulb,
  Maximize,
  Minimize,
  Loader2,
  Gamepad2,
  BookOpenCheck,
  HelpCircle,
  ThermometerSnowflake,
  ShieldAlert,
} from 'lucide-react';

/* ── Accordion data ── */
interface AccordionItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  context: string;
  hints: string[];
  answer: string;
}

const situationalQuestions: AccordionItem[] = [
  {
    id: 'q-preserve',
    icon: <ShieldAlert className="w-5 h-5" />,
    question: 'Tại sao sữa chua phải bảo quản trong tủ lạnh (2–5 °C)?',
    context:
      'Tình huống: Bạn An làm xong mẻ sữa chua rất ngon nhưng quên không bỏ vào tủ lạnh, để nguyên trên bàn bếp suốt 2 ngày. Khi mở ra, sữa chua bị chua gắt, có mùi lạ và chảy nước.',
    hints: [
      'Vi khuẩn Lactobacillus vẫn tiếp tục lên men ở nhiệt độ phòng → pH giảm quá mức → vị chua gắt.',
      'Nhiệt độ 2–5 °C ức chế hoạt động enzyme của vi khuẩn, "đóng băng" quá trình lên men ở mức vừa phải.',
      'Nếu để ngoài lâu, nấm mốc và vi khuẩn có hại từ môi trường có thể xâm nhập gây hỏng.',
    ],
    answer:
      'Bảo quản lạnh 2–5 °C giúp ức chế hoạt động vi khuẩn, giữ vị chua thanh vừa phải, ngăn ngừa nấm mốc xâm nhập và kéo dài thời hạn sử dụng từ 7–14 ngày.',
  },
  {
    id: 'q-fail',
    icon: <ThermometerSnowflake className="w-5 h-5" />,
    question: 'Mẻ sữa chua bị lỏng, không đông — nguyên nhân và cách khắc phục?',
    context:
      'Tình huống: Nhóm của bạn Bình ủ sữa chua đúng 8 tiếng nhưng khi mở ra vẫn thấy sữa lỏng như nước, không hề đông đặc. Cả nhóm rất bối rối vì đã làm theo đúng các bước.',
    hints: [
      'Kiểm tra nhiệt độ nước pha sữa: nếu > 50 °C, protein enzyme của vi khuẩn bị biến tính → chết → không lên men.',
      'Lượng men giống (sữa chua cái) quá ít so với lượng sữa → mật độ vi khuẩn không đủ.',
      'Thùng xốp ủ không kín hoặc nước ủ nguội quá nhanh → nhiệt độ giảm xuống < 30 °C → vi khuẩn hoạt động yếu.',
    ],
    answer:
      'Ba nguyên nhân phổ biến: (1) Nước quá nóng giết vi khuẩn, (2) Thiếu men giống, (3) Nhiệt độ ủ không đủ ấm. Khắc phục: kiểm tra nhiệt kế đạt 40–45 °C, tăng lượng sữa chua cái lên 1 hộp/500ml sữa, và đảm bảo thùng xốp kín khí.',
  },
];

/* ── Accordion component ── */
function Accordion({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="bg-white border-2 border-science-dark overflow-hidden"
      style={{ boxShadow: '6px 6px 0px 0px var(--color-science-dark)' }}
    >
      {/* Header — clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 sm:p-8 text-left cursor-pointer
                   hover:bg-science-bg transition-colors focus:outline-none group"
        aria-expanded={isOpen}
      >
        {/* Icon badge */}
        <div className="p-2.5 bg-science-base text-white shrink-0 mt-0.5">
          {item.icon}
        </div>

        {/* Question text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl tracking-tight leading-snug text-science-dark">
            {item.question}
          </h3>
          <p className="mt-2 text-sm text-science-dark/70 leading-relaxed">
            {item.context}
          </p>
        </div>

        {/* Chevron */}
        <div
          className={`shrink-0 p-2 border-2 border-science-dark transition-transform duration-300 ${
            isOpen ? 'rotate-180 bg-science-base text-white' : 'bg-white text-science-dark'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-science-dark px-6 sm:px-8 py-6 space-y-5">
              {/* Hints section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-science-dark/60">
                    Gợi ý suy luận
                  </span>
                </div>
                <ul className="space-y-2.5 ml-1">
                  {item.hints.map((hint, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-5 h-5 shrink-0 border-2 border-science-dark bg-[#FFF8E1] font-mono text-[9px] font-black mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-science-dark/70 leading-relaxed">
                        {hint}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Answer reveal */}
              <div
                className="p-5 bg-[#E8F5E9] border-2 border-science-dark"
                style={{ boxShadow: '3px 3px 0px 0px var(--color-science-dark)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpenCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                    Đáp án tham khảo
                  </span>
                </div>
                <p className="text-sm text-[#333333] leading-relaxed font-medium">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/* ── Default embed URL ── */
const DEFAULT_EMBED_URL = 'https://wayground.com/join?gc=10925705&source=liveDashboard';

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function Assessment() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  /* ── Embed URL State ── */
  const [embedUrl, setEmbedUrl] = useState(() => {
    return (typeof window !== 'undefined' ? (typeof window !== 'undefined' ? (typeof window !== 'undefined' ? localStorage.getItem('lactic_assessment_url') : null) : null) : null) || DEFAULT_EMBED_URL;
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(embedUrl);

  useEffect(() => {
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'assessment' }) }).catch(console.error);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  /* ── Fullscreen API ── */
  const toggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;

    if (!document.fullscreenElement) {
      gameContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          /* Fullscreen not supported or blocked */
        });
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  const handleSaveUrl = () => {
    setEmbedUrl(tempUrl);
    if (typeof window !== 'undefined') if (typeof window !== 'undefined') if (typeof window !== 'undefined') localStorage.setItem('lactic_assessment_url', tempUrl);
    setIsEditingUrl(false);
    setIframeLoaded(false); // Reset loading state
  };

  return (
    <section className="py-12 md:py-20 px-5 sm:px-8 lg:px-12 bg-science-bg">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ═══════ PART 1 — Vận dụng: Câu hỏi tình huống ═══════ */}
        <div>
          <SectionLabel
            num="01"
            label="Vận dụng kiến thức"
            sub="Câu hỏi tình huống thực tế"
          />

          <p className="mt-4 mb-8 text-sm md:text-base text-science-dark/80 leading-relaxed ml-0 md:ml-[calc(theme(spacing.4)+4rem)] max-w-3xl">
            Bấm vào mỗi câu hỏi để mở gợi ý suy luận và đáp án tham khảo.
            Hãy thử suy nghĩ trước khi xem đáp án nhé!
          </p>

          <div className="space-y-6">
            {situationalQuestions.map((q) => (
              <Accordion
                key={q.id}
                item={q}
                isOpen={openId === q.id}
                onToggle={() => toggleAccordion(q.id)}
              />
            ))}
          </div>
        </div>

        {/* ═══════ PART 2 — Minigame Wayground ═══════ */}
        <div>
          <SectionLabel
            num="02"
            label="Minigame trắc nghiệm"
            sub="Wayground Interactive Quiz"
          />

          <p className="mt-4 mb-8 text-sm md:text-base text-science-dark/80 leading-relaxed ml-0 md:ml-[calc(theme(spacing.4)+4rem)] max-w-3xl">
            Thi đua trực tuyến cùng cả lớp trên nền tảng Wayground! Bấm nút "Toàn màn hình" để có trải nghiệm tốt nhất trên iPad hoặc màn hình máy chiếu.
          </p>

          {/* Wayground container */}
          <div
            ref={gameContainerRef}
            className="relative bg-white border-2 border-science-dark overflow-hidden"
            style={{ boxShadow: '6px 6px 0px 0px var(--color-science-dark)' }}
          >
            {/* Editable URL / Teacher controls */}
            <div className="bg-[#FFF8E1] border-b-2 border-science-dark px-5 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                {isEditingUrl ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="Nhập link nhúng (vd: https://quizizz.com/join)"
                      className="flex-1 text-xs px-3 py-1.5 border-2 border-science-dark focus:outline-none"
                    />
                    <button
                      onClick={handleSaveUrl}
                      className="px-3 py-1.5 bg-science-base text-white text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-science-dark hover:bg-neutral-800"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setTempUrl(embedUrl);
                        setIsEditingUrl(false);
                      }}
                      className="px-3 py-1.5 bg-white text-science-dark text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-science-dark hover:bg-neutral-100"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-science-dark uppercase tracking-widest truncate">
                      URL: {embedUrl}
                    </span>
                    <button
                      onClick={() => setIsEditingUrl(true)}
                      className="shrink-0 px-2.5 py-1 bg-white border border-science-dark text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-neutral-100"
                    >
                      Sửa Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Top bar */}
            <div className="bg-science-base text-white px-5 sm:px-6 py-3 flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-2.5">
                <Gamepad2 className="w-4 h-4" />
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest truncate">
                  Minigame — Trắc nghiệm vi khuẩn Lactic
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 ${
                      iframeLoaded ? 'bg-emerald-400' : 'bg-yellow-400 animate-pulse'
                    }`}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 hidden sm:inline">
                    {iframeLoaded ? 'Sẵn sàng' : 'Đang tải...'}
                  </span>
                </span>

                {/* Fullscreen button */}
                <button
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-600 bg-neutral-900
                             text-[9px] font-mono font-bold uppercase tracking-widest text-white
                             hover:bg-neutral-700 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Thoát toàn màn hình' : 'Chơi lớn toàn màn hình'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Thu nhỏ</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Toàn màn hình</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Iframe viewport — Wayground Embed Code */}
            <div className="relative bg-[#111111]">
              {/* Loading spinner overlay */}
              <AnimatePresence>
                {!iframeLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#111111] gap-4"
                  >
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <div className="text-center">
                      <p className="font-mono text-xs text-white font-bold uppercase tracking-widest">
                        Đang tải nội dung...
                      </p>
                      <p className="font-mono text-[10px] text-neutral-500 mt-1">
                        Vui lòng đợi hoặc kiểm tra lại đường link
                      </p>
                    </div>
                    {/* Animated progress bar */}
                    <div className="w-48 h-1 bg-neutral-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: 'linear',
                        }}
                        style={{ width: '50%' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Embed code provided by Wayground */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minHeight: '635px',
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                <iframe
                  src={embedUrl}
                  title=" - Wayground"
                  style={{ flex: 1, border: 0 }}
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                ></iframe>
                <a
                  href="https://wayground.com/admin?source=embedFrame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 text-xs font-mono text-center pb-2 hover:text-white transition-colors"
                >
                  Explore more at Wayground.
                </a>
              </div>
            </div>

            {/* Bottom info strip */}
            <div className="border-t-2 border-science-dark bg-white px-5 sm:px-6 py-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-science-dark/60 uppercase tracking-widest truncate">
                Truy cập link trên điện thoại hoặc nhập mã PIN để tham gia
              </span>
              <span className="font-mono text-[10px] text-[#CCCCCC] hidden sm:inline">
                Responsive · iPad · Projector
              </span>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}

/* ── Reusable section label ── */
function SectionLabel({
  num,
  label,
  sub,
}: {
  num: string;
  label: string;
  sub: string;
}) {
  return (
    <header className="flex items-start gap-4">
      <span className="font-mono text-6xl md:text-7xl font-black text-science-dark/[0.06] leading-none select-none shrink-0">
        {num}
      </span>
      <div>
        <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-science-dark/60 mb-1">
          {sub}
        </span>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-science-dark tracking-tight leading-tight uppercase">
          {label}
        </h2>
      </div>
    </header>
  );
}

