import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendDiaryNotification(studentName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Gửi về chính email của GV (email user)
      subject: `[SCIENCE.05] Học sinh ${studentName} vừa nộp nhật ký thực hành!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #000; background: #fafafa;">
          <h2 style="text-transform: uppercase;">Thông báo nộp bài mới</h2>
          <p>Học sinh <strong>${studentName}</strong> vừa nộp nhật ký thực hành ủ sữa chua thành công.</p>
          <p>Cô/Thầy vui lòng đăng nhập vào trang chủ bằng mã PIN Giáo viên để kiểm tra chi tiết nhé!</p>
          <hr style="border: 1px solid #000;" />
          <p style="font-size: 12px; color: #666;">Hệ thống EdTech Science.05</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for ${studentName}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
}
