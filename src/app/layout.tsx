import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chuyên đề Vi khuẩn Lactic | Khoa học Lớp 5',
  description: 'Hành trình khám phá vi khuẩn Lactic, mô phỏng quá trình lên men và thực hành làm sữa chua tại nhà.',
  openGraph: {
    title: 'Chuyên đề Vi khuẩn Lactic | Khoa học Lớp 5',
    description: 'Hành trình khám phá vi khuẩn Lactic, mô phỏng quá trình lên men và thực hành làm sữa chua tại nhà.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
