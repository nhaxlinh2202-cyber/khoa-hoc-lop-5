import { motion } from 'motion/react';
import { BookMarked, GraduationCap, Laptop, Route, ShieldCheck, HeartPulse, Sparkles, SlidersHorizontal } from 'lucide-react';
import { PEDAGOGY_CARDS, FEATURE_CARDS } from '../../data';

export default function ProjectInfo() {
  return (
    <section id="project" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#D9D9D9]">
      <div className="max-w-7xl mx-auto">
        
        {/* Title structure */}
        <div className="border-b border-[#F2F2F2] pb-6 mb-12">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-black" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#111111]">
              Đúc Kết Học Thuật & Công Nghệ
            </span>
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-black mt-2 uppercase tracking-tight">
            Thông tin dự án thiết kế học tập
          </h2>
          <p className="text-xs md:text-sm text-[#444444] mt-2 max-w-2xl leading-relaxed">
            Xem phân tích chuyên sâu về mô hình khoa học sư phạm đằng sau cấu trúc website tĩnh một trang, đảm bảo tối đa hóa sự tiếp cận tri năng tự nhiên cho trẻ lớp 5.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Section 1: Pedagogical Framework (Mô hình sư phạm) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-21.5">
              <GraduationCap className="w-5 h-5 text-black" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-black">
                1. NỀN TẢNG MÔ HÌNH SƯ PHẠM
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PEDAGOGY_CARDS.map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-none bg-[#FAFAFA] border border-[#D9D9D9] hover:border-black transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold block uppercase">Mô hình 0{idx + 1}</span>
                    <h4 className="font-mono font-bold text-xs text-black uppercase tracking-wider">{card.title}</h4>
                    <p className="text-[11px] text-[#444444] leading-relaxed font-sans">{card.description}</p>
                  </div>
                  
                  {card.bullets && (
                    <ul className="mt-4 pt-3 border-t border-[#D9D9D9] list-none text-[10.5px] text-[#444444] space-y-1 font-sans">
                      {card.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start">
                          <span className="text-black font-bold mr-1.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 2: Technical & Interactive Features (Tính năng website) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="w-5 h-5 text-black" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-black">
                2. TOÀN BỘ TÍNH NĂNG GIẢI PHÁP SỐ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURE_CARDS.map((card, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white border border-[#D9D9D9] rounded-none flex items-start space-x-3 hover:border-black transition-colors"
                >
                  <div className="w-5 h-5 rounded-none border border-black bg-[#F2F2F2] flex items-center justify-center font-mono text-[9px] font-bold shrink-0 text-black mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-[11px] text-neutral-900 uppercase tracking-wider leading-tight mb-1">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-[#444444] leading-relaxed font-sans">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Extra micro-progress checklist info */}
              <div className="sm:col-span-2 p-4 bg-black text-white rounded-none flex items-center justify-between text-[11px] font-mono tracking-wide">
                <span>📚 CHUẨN ĐẦU RA KHOA HỌC: CHUYÊN ĐỀ VI KHUẨN LACTIC CO CÚC</span>
                <span className="text-white opacity-80 text-[10px] font-bold">100% HOÀN TẤT TRẢI NGHIỆM</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
