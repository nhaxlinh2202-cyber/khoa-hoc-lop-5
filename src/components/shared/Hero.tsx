import { motion } from 'motion/react';
import { ArrowDown, Flame, Eye, Leaf, HelpCircle } from 'lucide-react';

interface HeroProps {
  onExploreClick: (id: string) => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  const activities = [
    {
      num: '01',
      id: 'hd1',
      name: 'TRẢI NGHIỆM TẠI NHÀ',
      desc: 'Xem video hướng dẫn quy trình, chuẩn bị vật liệu, tiến hành làm sữa chua thực tế và điền số liệu nhật ký online.',
      btn: 'KHÁM PHÁ HĐ1',
      icon: <Flame className="w-5 h-5 text-black" />
    },
    {
      num: '02',
      id: 'hd2',
      name: 'QUAN SÁT & PHẢN NGẪM',
      desc: 'Sử dụng tiêu chí đánh giá Rubric của lớp học để nhận xét chéo, đúc rút bài học và phân tích mẻ sữa sữa chua lỗi.',
      btn: 'KHÁM PHÁ HĐ2',
      icon: <Eye className="w-5 h-5 text-black" />
    },
    {
      num: '03',
      id: 'hd3',
      name: 'KIẾN THỨC CỐT LÕI',
      desc: 'Hệ thống hóa nguyên lý lên men lactic qua sơ đồ tư quy kỹ thuật số và tham gia minigame củng cố kiến thức.',
      btn: 'KHÁM PHÁ HĐ3',
      icon: <Leaf className="w-5 h-5 text-black" />
    },
    {
      num: '04',
      id: 'hd4',
      name: 'GIẢI QUYẾT VẤN ĐỀ',
      desc: 'Đóng vai kỹ sư công nghệ thực phẩm cải thiện quy trình ủ và thảo luận nhóm giải cứu mẻ sữa chua hỏng thực nghiệm.',
      btn: 'KHÁM PHÁ HĐ4',
      icon: <HelpCircle className="w-5 h-5 text-black" />
    }
  ];

  return (
    <header className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden border-b border-[#D9D9D9]">
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        {/* Topic Badge */}
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3 py-1 border border-black text-[10px] font-mono font-bold tracking-widest bg-white text-[#111111] mb-6 uppercase"
        >
          KHOA HỌC LỚP 5 • CHU TRÌNH HỌC TẬP TRẢI NGHIỆM
        </motion.span>

        {/* Primary Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#111111] uppercase leading-tight"
        >
          Vi khuẩn có lợi trong <br className="hidden sm:inline" />
          <span className="underline decoration-1 decoration-black underline-offset-12">chế biến thực phẩm</span>
        </motion.h1>

        {/* Short Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-xs md:text-sm text-[#444444] font-mono tracking-wide max-w-2xl mx-auto leading-relaxed border-t border-b border-dashed border-[#D9D9D9] py-4"
        >
          Hành trình nghiên cứu thông qua chu trình Kolb và lớp học đảo ngược: Quan sát, thực nghiệm tự chủ làm sữa chua và kiến tạo tri thức khoa học vi sinh.
        </motion.p>

        {/* Learning Circle Timeline Progress */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 max-w-xl mx-auto px-4"
        >
          <div className="text-center font-mono text-[9px] uppercase text-[#444444] font-bold tracking-widest mb-6">
            CHUYÊN ĐỀ HỌC TẬP ĐẢO NGƯỢC (KOLB PROCESS)
          </div>
          <div className="relative flex items-center justify-between">
            {/* Background progress bar line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-black -translate-y-1/2 z-0" />
            
            {/* Step badges */}
            {[
              { label: 'Trải nghiệm', sub: 'Làm sữa chua' },
              { label: 'Phản ngẫm', sub: 'Nhận xét chéo' },
              { label: 'Kiến thức', sub: 'Khuẩn Lactic' },
              { label: 'Vận dụng', sub: 'Giải quyết lỗi' }
            ].map((st, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-none border border-black bg-white flex items-center justify-center text-xs text-black font-mono font-bold">
                  0{idx + 1}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111111] bg-white border border-black px-2 py-0.5 mt-3 shadow-xs font-sans">
                  {st.label}
                </span>
                <span className="hidden sm:block text-[9px] font-mono text-[#444444] mt-1">
                  {st.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Grid view of 4 Activity Cards */}
      <div className="max-w-5xl mx-auto mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-[#D9D9D9] rounded-none p-8 flex flex-col justify-between hover:border-black transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-4xl font-light text-[#D9D9D9] group-hover:text-black transition-colors duration-300">
                    {act.num}
                  </span>
                  <div className="p-3 bg-white border border-black group-hover:bg-black group-hover:text-white [&_svg]:group-hover:text-white transition-all">
                    {act.icon}
                  </div>
                </div>
                <h3 className="font-mono font-bold text-sm tracking-widest text-[#111111] uppercase mb-3">
                  {act.name}
                </h3>
                <p className="text-xs text-[#444444] leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#F2F2F2]">
                <button
                  onClick={() => onExploreClick(act.id)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <span>{act.btn}</span>
                  <ArrowDown className="w-3 h-3 ml-2 animate-bounce" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}
