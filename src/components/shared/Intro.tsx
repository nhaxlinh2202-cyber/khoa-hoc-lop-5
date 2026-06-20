import { motion } from 'motion/react';
import { UserCheck, HelpCircle, Lightbulb, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Intro() {
  const roles = [
    {
      title: 'Học sinh lớp 5 🎒',
      desc: 'Là trung tâm của bài học. Các em chủ động xem video hướng dẫn từ xa, tự tay làm sữa chua, tự viết nhật ký quan sát trực tuyến, đánh giá chéo sản phẩm cùng bạn thân và tham gia minigame kịch tính trên lớp.',
      color: 'border-l-2 border-l-black bg-[#FAFAFA]',
      icon: <Users className="w-5 h-5 text-black" />
    },
    {
      title: 'Thầy cô giáo 🔬',
      desc: 'Không còn thuyết giảng một chiều. Thầy cô đóng vai trò xúc tác, sử dụng website để hướng dẫn chấm điểm Rubric, điều phối thảo luận gỡ lỗi kỹ thuật lên men sữa ấm và hệ thống hóa kiến thức cốt lõi.',
      color: 'border-l-2 border-l-black bg-[#FAFAFA]',
      icon: <UserCheck className="w-5 h-5 text-black" />
    },
    {
      title: 'Phụ huynh học sinh 🏡',
      desc: 'Người đồng hành tin cậy tại nhà. Đóng vai trò bảo hộ, giúp giám sát các hoạt động nấu ấm sữa chua, đun nước nóng an toàn cho con trẻ, đồng thời ghi nhận nỗ lực vượt bậc của con ngoài giờ lên lớp.',
      color: 'border-l-2 border-l-black bg-[#FAFAFA]',
      icon: <HeartHandshake className="w-5 h-5 text-black" />
    }
  ];

  return (
    <section id="intro" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#D9D9D9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Educational Strategy */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <span className="h-4 w-1 bg-black" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#444444]">
                Tổng Quan Sư Phạm
              </span>
            </div>

            <h2 className="font-mono font-bold text-lg text-[#111111] uppercase tracking-wider leading-snug">
              Chương trình Học qua Trải nghiệm
            </h2>

            {/* Problem Statement Card */}
            <div className="p-6 bg-[#FAFAFA] border border-[#D9D9D9] rounded-none space-y-3">
              <div className="flex items-center space-x-2 text-[#444444]">
                <HelpCircle className="w-5 h-5 text-black" />
                <span className="font-mono font-bold uppercase text-xs tracking-wider text-[#111111]">Câu hỏi thách thức</span>
              </div>
              <p className="text-xs text-[#444444] italic leading-relaxed font-mono">
                "Làm sao để biến một bài học vi sinh trùng kịch, vi khuẩn Lactic mắt thường không thấy được đầy khô khan thành một trải nghiệm thực tế sinh động, phù hợp và cực kỳ cuốn hút đối với học sinh lớp 5?"
              </p>
            </div>

            {/* The Solution */}
            <div className="space-y-3 p-4 border border-[#D9D9D9] rounded-none">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-black" />
                <span className="font-mono font-bold uppercase text-xs tracking-wider text-[#111111]">Giải pháp đột phá</span>
              </div>
              <p className="text-xs text-[#444444] leading-relaxed font-mono">
                Ứng dụng đồng bộ mô hình học tập kết hợp <strong className="text-[#111111] font-bold">Blended Learning</strong> (Lớp học đảo ngược - Flipped Classroom) gắn chặt với <strong className="text-[#111111] font-bold">Chu trình học tập trải nghiệm của Kolb</strong>. Qua đó kết nối hữu cơ không gian trường học và gia đình.
              </p>
            </div>

            {/* Theoretical Foundations */}
            <div className="pt-6 border-t border-[#D9D9D9]">
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#444444]">Nền tảng triết lý khoa học</span>
              </div>
              <p className="text-xs text-[#444444] leading-relaxed">
                Sự hòa quyện chặt chẽ giữa <strong>Lý thuyết Nhân văn</strong> (tôn trọng xúc cảm chân thành, khích lệ tự hoàn thiện năng lực bản thân) và <strong>Lý thuyết Kiến tạo</strong> (tự tay thực hiện, tự do đặt điều kiện biến đổi và tự phản ngẫm đúc rút bài học). Kiến tạo những giá trị hữu ích trong thực nghiệm.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Key Action Roles */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#444444]">
                Phân Nhiệm Ba Vai Trò Chủ Chốt
              </span>
            </div>

            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 bg-white border border-[#D9D9D9] rounded-none transition-all duration-300 hover:border-black flex items-start space-x-4 ${role.color}`}
                >
                  <div className="p-2 rounded-none bg-white border border-[#D9D9D9] mt-0.5">
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#111111] mb-2">
                      {role.title}
                    </h3>
                    <p className="text-xs text-[#444444] leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
