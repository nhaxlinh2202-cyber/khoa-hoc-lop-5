"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Share2, Award, Maximize, Minimize } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../../data';

const OPTIONS = [
  'lên men',
  'lỏng',
  'lactic',
  'chua ngọt',
  'tốt nhất',
];

const CORRECT_ANSWERS: Record<number, string> = {
  1: 'lactic',
  2: 'lên men',
  3: 'tốt nhất',
  4: 'lỏng',
  5: 'chua ngọt',
};

export default function ActivityThree() {
  useEffect(() => {
    import('@google/model-viewer').catch(console.error);
  }, []);

  /* ── Fullscreen state for 3D model ── */
  const [isModelFullscreen, setIsModelFullscreen] = useState(false);
  const modelContainerRef = useRef<HTMLDivElement>(null);

  /* ── Fill in the blanks state ── */
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('lactic_quiz_answers_new') : null);
    return saved ? JSON.parse(saved) : { 1: '', 2: '', 3: '', 4: '', 5: '' };
  });

  const [activeBlank, setActiveBlank] = useState<number | null>(1);

  const [quizSubmitted, setQuizSubmitted] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('lactic_quiz_submitted_new') : null) === 'true';
  });

  const [quizResults, setQuizResults] = useState<Record<number, boolean>>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('lactic_quiz_results_new') : null);
    return saved ? JSON.parse(saved) : {};
  });

  const [scoreCount, setScoreCount] = useState(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('lactic_quiz_score_new') : null);
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    if (quizSubmitted && scoreCount === 5) {
      fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: 'hd3' }) }).catch(console.error);
    }
  }, [quizSubmitted, scoreCount]);

  /* Monitor browser fullscreen state changes */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsModelFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleModelFullscreen = () => {
    if (!modelContainerRef.current) return;
    if (!document.fullscreenElement) {
      modelContainerRef.current
        .requestFullscreen()
        .then(() => setIsModelFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsModelFullscreen(false))
        .catch(() => {});
    }
  };

  const handleSelectOption = (option: string) => {
    if (quizSubmitted) return;

    let targetBlank = activeBlank;
    if (targetBlank === null) {
      targetBlank = [1, 2, 3, 4, 5].find((num) => !selectedAnswers[num]) || null;
    }

    if (targetBlank === null) return;

    const updated = { ...selectedAnswers };

    // Clear option if it was already selected in another blank
    Object.keys(updated).forEach((key) => {
      const k = Number(key);
      if (updated[k] === option) {
        updated[k] = '';
      }
    });

    updated[targetBlank] = option;
    setSelectedAnswers(updated);
    if (typeof window !== 'undefined') localStorage.setItem('lactic_quiz_answers_new', JSON.stringify(updated));

    // Auto-advance
    const nextEmpty = [1, 2, 3, 4, 5].find((num) => num !== targetBlank && !updated[num]);
    if (nextEmpty) {
      setActiveBlank(nextEmpty);
    } else {
      setActiveBlank(null);
    }
  };

  const handleClearBlank = (blankNum: number) => {
    if (quizSubmitted) return;
    const updated = { ...selectedAnswers, [blankNum]: '' };
    setSelectedAnswers(updated);
    if (typeof window !== 'undefined') localStorage.setItem('lactic_quiz_answers_new', JSON.stringify(updated));
    setActiveBlank(blankNum);
  };

  const handleBlankClick = (blankNum: number) => {
    if (quizSubmitted) return;
    setActiveBlank(blankNum);
  };

  const checkQuizAnswers = () => {
    let corrected: Record<number, boolean> = {};
    let count = 0;

    Object.entries(CORRECT_ANSWERS).forEach(([key, val]) => {
      const num = Number(key);
      const correct = selectedAnswers[num] === val;
      corrected[num] = correct;
      if (correct) {
        count++;
      }
    });

    setQuizResults(corrected);
    setScoreCount(count);
    setQuizSubmitted(true);

    if (typeof window !== 'undefined') localStorage.setItem('lactic_quiz_results_new', JSON.stringify(corrected));
    if (typeof window !== 'undefined') localStorage.setItem('lactic_quiz_score_new', count.toString());
    if (typeof window !== 'undefined') localStorage.setItem('lactic_quiz_submitted_new', 'true');
  };

  const resetQuiz = () => {
    const defaultAnswers = { 1: '', 2: '', 3: '', 4: '', 5: '' };
    setSelectedAnswers(defaultAnswers);
    setQuizResults({});
    setQuizSubmitted(false);
    setScoreCount(0);
    setActiveBlank(1);

    if (typeof window !== 'undefined') localStorage.removeItem('lactic_quiz_answers_new');
    if (typeof window !== 'undefined') localStorage.removeItem('lactic_quiz_results_new');
    if (typeof window !== 'undefined') localStorage.removeItem('lactic_quiz_score_new');
    if (typeof window !== 'undefined') localStorage.removeItem('lactic_quiz_submitted_new');
  };

  const renderBlank = (num: number) => {
    const value = selectedAnswers[num];
    const isFilled = !!value;
    const isActive = activeBlank === num;
    const correct = quizResults[num];

    let btnClass = 'inline-flex items-center justify-center px-2 py-0.5 font-mono font-bold text-[11px] mx-1 border transition-all rounded-none ';

    if (quizSubmitted) {
      if (correct) {
        btnClass += 'border-emerald-600 bg-emerald-50 text-emerald-800 cursor-default';
      } else {
        btnClass += 'border-red-600 bg-red-50 text-red-800 cursor-default';
      }
    } else {
      if (isActive) {
        btnClass += 'border-science-dark bg-yellow-300 text-science-dark shadow-[1px_1px_0px_0px_var(--color-science-dark)] scale-105';
      } else if (isFilled) {
        btnClass += 'border-science-dark bg-science-bg text-science-dark hover:bg-neutral-100 cursor-pointer';
      } else {
        btnClass += 'border-dashed border-neutral-400 bg-white text-neutral-400 hover:border-science-dark hover:text-science-dark cursor-pointer';
      }
    }

    return (
      <button
        type="button"
        onClick={() => {
          if (isFilled && !quizSubmitted) {
            handleClearBlank(num);
          } else {
            handleBlankClick(num);
          }
        }}
        className={btnClass}
        style={!quizSubmitted && isActive ? { transform: 'translateY(-0.5px)' } : undefined}
      >
        <span className="text-[8px] text-neutral-400 mr-1 font-mono">({num})</span>
        {isFilled ? value : '___________'}
        {isFilled && !quizSubmitted && (
          <span className="ml-1 text-neutral-400 hover:text-red-600 text-[9px] font-mono">×</span>
        )}
        {quizSubmitted && (
          <span className="ml-1 text-[10px] font-bold">
            {correct ? ' ✓' : ' ✗'}
          </span>
        )}
      </button>
    );
  };

  return (
    <section id="hd3" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-science-dark/20">
      <div className="max-w-7xl mx-auto">

        {/* Step Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-mono text-5xl md:text-6xl font-bold text-[#D9D9D9] leading-none">03</span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-science-dark/70 block">Bước 3: Khám phá thế giới vi sinh (Kolb - Khái niệm hóa)</span>
              <h2 className="font-display font-medium text-2xl md:text-3xl text-science-dark tracking-tight">
                HĐ3 — Quan sát vi sinh vật dưới kính hiển vi ảo
              </h2>
            </div>
          </div>
          <p className="text-sm md:text-base text-science-dark/70 max-w-3xl leading-relaxed mt-2">
            Chào mừng các em đến với phòng thí nghiệm sinh học lớp 5! Cùng tự tay xoay núm điều chỉnh kính hiển vi ảo để nhìn rõ nét cấu tạo vi khuẩn Lactic, và hoàn thành trò chơi điền từ vào ô trống củng cố bài học nhé.
          </p>
        </div>

        {/* 2-Columns layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

          {/* Column Left: Visualizer and Mindmap (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">

            {/* 3D Model Viewer */}
            <div
              ref={modelContainerRef}
              className="bg-white border-2 border-science-dark overflow-hidden flex flex-col"
              style={{
                boxShadow: isModelFullscreen ? 'none' : '6px 6px 0px 0px #000000',
                height: isModelFullscreen ? '100vh' : 'auto',
              }}
            >
              {/* Top bar */}
              <div className="bg-science-base text-white px-5 py-3 flex items-center justify-between">
                <h3 className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-400" />
                  Mô hình 3D — Vi khuẩn Lactobacillus
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleModelFullscreen}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-neutral-600 bg-neutral-900
                               text-[9px] font-mono font-bold uppercase tracking-widest text-white
                               hover:bg-neutral-700 transition-colors cursor-pointer"
                    title={isModelFullscreen ? 'Thu nhỏ' : 'Phóng to toàn màn hình'}
                  >
                    {isModelFullscreen ? (
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
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500" />
                    <span className="w-2.5 h-2.5 bg-yellow-400" />
                    <span className="w-2.5 h-2.5 bg-emerald-400" />
                  </span>
                </div>
              </div>

              {/* Model viewport */}
              <div className={`bg-[#111111] relative ${isModelFullscreen ? 'flex-1' : 'aspect-video'}`}>
                {/* @google/model-viewer web component */}
                <model-viewer
                  src="/models/Meshy_AI_Rod_shaped_Bacteria_E_0606101028_texture.glb"
                  alt="Mô hình 3D vi khuẩn Lactobacillus"
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  shadow-softness="1"
                  exposure="1"
                  camera-orbit="45deg 55deg 2.5m"
                  interaction-prompt="auto"
                  touch-action="pan-y"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#111111',
                    outline: 'none',
                  }}
                >
                  {/* Fallback content shown while .glb is loading */}
                  <div
                    slot="poster"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111] text-center px-6"
                  >
                    <div className="inline-flex p-4 border-2 border-dashed border-neutral-600 mb-4">
                      <svg className="w-10 h-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                      Đang tải mô hình 3D (~18 MB)...
                    </p>
                    <p className="font-mono text-[10px] text-neutral-600 mt-1">
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                </model-viewer>
              </div>

              {/* Bottom info strip */}
              <div className="border-t-2 border-science-dark bg-white px-5 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-science-dark/60 uppercase tracking-widest">
                  🖱️ Xoay · Zoom · Kéo để khám phá
                </span>
                <span className="font-mono text-[10px] text-[#CCCCCC]">
                  WebGL · Auto-rotate
                </span>
              </div>
            </div>

            {/* Mind Map Block representation */}
            <div className="bg-white border border-science-dark/20 rounded-none p-6">
              <h3 className="font-mono font-bold text-xs text-science-dark uppercase tracking-widest mb-4 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-science-dark" />
                <span>SƠ ĐỒ TƯ DUY KHÁI QUÁT HÓA 🗺️</span>
              </h3>

              {/* Grid Mind Map representation */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">

                {/* Node Center */}
                <div className="sm:col-span-4 p-4 bg-science-base text-white rounded-none border border-science-dark text-center">
                  <span className="font-mono font-bold text-xs block uppercase tracking-wider">VI KHUẨN LACTIC</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-80 mt-1 block">(Lợi Khuẩn Số Một)</span>
                </div>

                {/* Arrow connector */}
                <div className="hidden sm:block sm:col-span-1 text-center text-neutral-400">
                  <ChevronRight className="w-5 h-5 mx-auto" />
                </div>

                {/* Nodes children */}
                <div className="sm:col-span-7 space-y-2">
                  {[
                    { label: '🌾 Lên men đường', desc: 'Sử dụng bầu sữa bột/đường Lactose để dồi dào sinh khối.' },
                    { label: '🧪 Tạo vị Axit Lactic', desc: 'Tạo vị chua thanh đặc thù, tăng độ bền dưỡng chất.' },
                    { label: '🥛 Sữa đông dẻo', desc: 'Làm đông tụ protein trong môi trường nhiệt độ thích hợp.' },
                    { label: '🥒 Ứng dụng dưa muối', desc: 'Khống chế vi sinh vật gây thối và làm giòn dưa cải.' }
                  ].map((node, idx) => (
                    <div key={idx} className="p-2.5 bg-science-bg border border-science-dark/20 rounded-none text-left hover:border-science-dark transition-colors flex items-start space-x-2.5">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-none bg-science-base" />
                      <div>
                        <strong className="text-xs font-mono uppercase tracking-wide text-science-dark block">{node.label}</strong>
                        <span className="text-[10px] text-science-dark/70 leading-snug">{node.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Column Right: Interactive blanks game (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-science-dark/20 rounded-none p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-science-dark/20 pb-3">
                <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-science-dark flex items-center space-x-2">
                  <Award className="w-5 h-5 text-science-dark" />
                  <span>CỦNG CỐ KIẾN THỨC BẰNG MINIGAME</span>
                </h3>
                <p className="text-[11px] text-science-dark/70 mt-1 pr-4">
                  Thử tài lý thuyết bài học Lớp 5. Điền từ thích hợp vào từng chỗ trống:
                </p>
              </div>

              {/* Questions stack */}
              <div className="space-y-5 pt-2">
                {QUIZ_QUESTIONS.map((q) => {
                  return (
                    <div key={q.id} className="text-xs space-y-1.5 border-b border-[#F2F2F2] pb-3 last:border-b-0 last:pb-0">
                      <span className="font-mono text-[9px] text-science-dark/60 block font-bold tracking-wider">CÂU HỎI {q.id}</span>
                      <div className="text-neutral-800 leading-relaxed font-sans text-xs">
                        {q.sentenceBefore}
                        {renderBlank(q.id)}
                        {q.sentenceAfter}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selection Options panel */}
            {!quizSubmitted && (
              <div className="space-y-3 pt-4 border-t border-science-dark/20 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                    {activeBlank ? `👉 Đang chọn cho ô (${activeBlank})` : 'Chọn một ô trống ở trên'}
                  </span>
                  <span className="font-mono text-[8px] text-[#AAAAAA]">
                    Nhấn vào từ để chọn
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {OPTIONS.map((opt) => {
                    const used = Object.values(selectedAnswers).includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={used}
                        onClick={() => handleSelectOption(opt)}
                        className={`px-3 py-1.5 border-2 text-[11px] font-mono font-bold uppercase transition-all rounded-none cursor-pointer ${
                          used
                            ? 'border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                            : 'border-science-dark bg-white text-science-dark hover:bg-science-base hover:text-white shadow-[2px_2px_0px_0px_var(--color-science-dark)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quiz interactions control container */}
            <div className="pt-6 border-t border-science-dark/20 mt-6 space-y-4">
              {!quizSubmitted ? (
                <button
                  onClick={checkQuizAnswers}
                  disabled={!Object.values(selectedAnswers).every(val => val !== '')}
                  className={`w-full py-3 border-2 font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-none ${
                    Object.values(selectedAnswers).every(val => val !== '')
                      ? 'border-science-dark bg-science-base text-white hover:bg-neutral-800 cursor-pointer shadow-[3px_3px_0px_0px_#888888] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  NỘP BÀI KIỂM TRA LỚP 5
                </button>
              ) : (
                <div className="space-y-3">
                  <div className={`p-4 rounded-none border-2 border-science-dark text-center ${
                    scoreCount === 5 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    <span className="font-mono text-[9px] text-science-dark/70 uppercase block tracking-wider font-bold">KẾT QUẢ ĐẠT ĐƯỢC</span>
                    <span className="font-mono font-bold text-lg text-science-dark">{scoreCount} / 5 CÂU ĐÚNG</span>
                    <p className="text-[10px] text-science-dark/70 mt-1 font-sans">
                      {scoreCount === 5
                        ? '"Em đã hoàn thành xuất sắc thử thách khoa học về vi khuẩn Lactic rồi đó!"'
                        : '"Có một số từ khóa chưa đúng vị trí. Hãy thử lại để đạt kết quả tốt nhất nhé!"'}
                    </p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="w-full py-2.5 border border-science-dark bg-white text-science-dark text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#F2F2F2] transition-colors cursor-pointer rounded-none"
                  >
                    THỬ LẠI TỪ ĐẦU
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
