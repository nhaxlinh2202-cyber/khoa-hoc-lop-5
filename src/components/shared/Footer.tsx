import { useState } from 'react';
import { Mail, GraduationCap, FileCode2, Landmark, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [showContactAlert, setShowContactAlert] = useState(false);
  const [showDocAlert, setShowDocAlert] = useState(false);

  const handleContactClick = () => {
    setShowContactAlert(true);
    setTimeout(() => setShowContactAlert(false), 3500);
  };

  const handleDocClick = () => {
    setShowDocAlert(true);
    setTimeout(() => setShowDocAlert(false), 3500);
  };

  return (
    <footer id="contact" className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Motto brand (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-none border border-white bg-transparent text-white flex items-center justify-center font-bold text-sm">
                🧫
              </div>
              <div>
                <span className="font-mono font-bold text-xs tracking-widest block text-white uppercase">
                  NHÓM LACTIC 5
                </span>
                <span className="font-mono text-[9px] text-[#A3A3A3] block uppercase tracking-wier">
                  Chuyên Đề Thiết Kế Trải Nghiệm Học Tập
                </span>
              </div>
            </div>
            
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Dự án số hóa tri thức lớp 5 hỗ trợ giáo án đảo ngược tự học sinh chủ động. Kết hợp giữa lý thuyết kiến tạo của Kolb và công nghệ thông tin truyền thông đổi mới sáng tạo giáo dục.
            </p>
          </div>

          {/* Development Team roles (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-mono text-[10px] uppercase text-[#A3A3A3] tracking-wider block">
              Thành viên thực hiện & Vai trò
            </span>
            
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-start justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-sans font-bold">Nhóm thiết kế học tập</span>
                <span className="font-mono text-[10px] text-white">Nội dung Sư phạm</span>
              </li>
              <li className="flex items-start justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-sans font-bold">Chuyên gia UX/UI</span>
                <span className="font-mono text-[10px] text-white">Trải nghiệm & Bố cục</span>
              </li>
              <li className="flex items-start justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-sans font-bold">Nhà phát triển Web</span>
                <span className="font-mono text-[10px] text-white">Lập trình Frontend</span>
              </li>
              <li className="flex items-center space-x-1.5 text-neutral-400 pt-1 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Liên hệ chính: <strong className="text-white">contact@example.com</strong></span>
              </li>
            </ul>
          </div>

          {/* Quick buttons interactions (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[10px] uppercase text-[#A3A3A3] tracking-wider block">
              Liên kết mở rộng
            </span>

            <div className="flex flex-col space-y-2.5">
              <button
                onClick={handleContactClick}
                className="w-full text-center py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors text-[10px] font-mono font-bold uppercase tracking-widest rounded-none border border-white cursor-pointer"
              >
                Liên hệ ngay
              </button>

              <button
                onClick={handleDocClick}
                className="w-full text-center py-2.5 bg-[#111111] border border-neutral-800 hover:border-neutral-500 hover:text-white transition-colors text-[10px] font-mono font-bold uppercase tracking-widest text-[#FAFAFA] rounded-none cursor-pointer"
              >
                Xem tài liệu dự án
              </button>
            </div>

            {/* Notification alert outputs */}
            {showContactAlert && (
              <div className="p-3 bg-neutral-900 border border-white rounded-none text-[10px] font-mono text-white text-center animate-fade-in leading-relaxed">
                ✓ THIẾT BỊ GỬI YÊU CẦU LIÊN KẾT THÀNH CÔNG!
              </div>
            )}
            {showDocAlert && (
              <div className="p-3 bg-neutral-900 border border-white rounded-none text-[10px] font-mono text-white text-center animate-fade-in leading-relaxed">
                ✓ ĐÃ TẢI GIÁO ÁN SƯ PHẠM LACTIC V1.0 CAO CẤP!
              </div>
            )}
          </div>

        </div>

        {/* Divider and copyright motto */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] space-y-4 sm:space-y-0">
          <div>
            <span>© {new Date().getFullYear()} Nhóm 4 thực hành • Ha Noi University of Science and Technology</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#111111] px-3.5 py-1.5 rounded-none border border-neutral-800">
            <span className="w-1.5 h-1.5 bg-white shrink-0" />
            <span className="font-mono uppercase tracking-widest text-[9px] text-[#FAFAFA] font-bold">
              Learning by Doing — Học qua trải nghiệm
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
