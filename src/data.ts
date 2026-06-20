import { ComparisonGroup, QuizQuestion, LeaderboardUser, ProjectCard, RubricCriteria } from './types';

export const INITIAL_DIARY_ENTRIES = [
  {
    id: 'diary-1',
    studentName: 'Nguyễn Văn An',
    studentGroup: 'Nhóm Lactic 1',
    startTime: '19:30',
    color: 'Trắng mịn',
    state: 'đặc' as const,
    taste: 'Chua thanh dịu, hơi ngọt',
    notes: 'Đã ủ ấm trong thùng xốp 8 tiếng với đun nước ấm 40 độ C.',
    createdAt: '01/06/2026',
  },
  {
    id: 'diary-2',
    studentName: 'Trần Thị Bình',
    studentGroup: 'Nhóm Sữa Chua 2',
    startTime: '20:15',
    color: 'Hơi vàng nhạt',
    state: 'hơi_đặc' as const,
    taste: 'Ngọt nhiều hơn chua',
    notes: 'Quên đổ nước nóng lần hai vào thùng ủ nên nhiệt độ giảm sớm.',
    createdAt: '01/06/2026',
  },
];

export const RUBRIC_CRITERIA: RubricCriteria[] = [
  {
    id: 'do-dac',
    label: 'Độ đông đặc',
    description: 'Sữa đông dẻo, mịn màng, khi nghiêng cốc không bị chảy loãng hay tách nước quá nhiều.',
    maxStars: 5,
  },
  {
    id: 'vi-chua-ngot',
    label: 'Vị chua / ngọt',
    description: 'Có sự hòa quyện hoàn hảo giữa vị ngọt sữa ông thọ và vị chua thanh do lên men lactic tự nhiên.',
    maxStars: 5,
  },
  {
    id: 'mau-sac',
    label: 'Màu sắc sản phẩm',
    description: 'Sữa chua có màu trắng sữa hoặc hơi ngà đồng đều, bề mặt láng mịn, bắt mắt.',
    maxStars: 5,
  },
  {
    id: 'mui-huong',
    label: 'Mùi hương đặc trưng',
    description: 'Mùi thơm dịu nhẹ ấm áp của sữa chín kết hợp hương men đặc trưng, không có mùi lạ.',
    maxStars: 5,
  },
  {
    id: 'nhat-ky-onl',
    label: 'Độ đầy đủ của nhật ký',
    description: 'Ghi nhật ký online đúng giờ, cung cấp đầy đủ thông số quan sát về màu sắc và trạng thái của sữa.',
    maxStars: 5,
  },
];

export const MOCK_COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    id: 'group-1',
    name: 'Nhóm 1 (Nhóm Lactic)',
    thickness: 'Sản phẩm đặc dẻo, mịn màng',
    taste: 'Vị chua dịu thanh mát, ngọt nhẹ',
    diaryStatus: 'Đầy đủ, ghi nhận đúng tiến độ',
    rating: 5,
  },
  {
    id: 'group-2',
    name: 'Nhóm 2 (Nhóm Sữa Chua)',
    thickness: 'Sản phẩm còn lỏng, chảy sệt',
    taste: 'Ngọt gắt, hầu như chưa có vị chua',
    diaryStatus: 'Ủ chưa đủ thời gian (mới 3 tiếng)',
    rating: 2,
  },
  {
    id: 'group-3',
    name: 'Nhóm 3 (Nhóm Dưa Muối)',
    thickness: 'Sản phẩm hơi đặc, có dăm đá',
    taste: 'Vị ngọt bùi, chua vừa ổn định',
    diaryStatus: 'Ghi chép đầy đủ nhưng thiếu phần ghi chú chi tiết',
    rating: 4,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    sentenceBefore: 'Vi khuẩn có lợi góp phần lên men sữa thành sữa chua thường là vi khuẩn ',
    correctAnswer: ['lactic', 'vi khuẩn lactic', 'lắc-tích'],
    sentenceAfter: '.',
    placeholder: 'Điền tên vi khuẩn...',
  },
  {
    id: 2,
    sentenceBefore: 'Quá trình chuyển đổi từ sữa lỏng sang sữa đông mịn liên quan đến hiện tượng ',
    correctAnswer: ['lên men', 'phản ứng lên men', 'lên men lactic'],
    sentenceAfter: ' chuyển hóa nguồn đường trong sữa thành axit hữu cơ.',
    placeholder: 'Hai từ, bắt đầu bằng chữ "l"...',
  },
  {
    id: 3,
    sentenceBefore: 'Nhiệt độ ủ lý tưởng từ 40°C - 45°C giúp vi khuẩn có lợi hoạt động ',
    correctAnswer: ['tốt nhất', 'mạnh nhất', 'hiệu quả nhất', 'tối ưu nhất'],
    sentenceAfter: ', sinh sôi nảy nở nhanh chóng.',
    placeholder: 'Ví dụ: tốt nhất...',
  },
  {
    id: 4,
    sentenceBefore: 'Nếu chúng ta quên ủ ấm (nhiệt độ lạnh ngắt), mẻ sữa chua có thể bị ',
    correctAnswer: ['lỏng', 'không đông', 'loãng', 'phỏng', 'hỏng'],
    sentenceAfter: ' vì vi khuẩn không thể hoạt động hiệu quả.',
    placeholder: 'Mẹo: lỏng hoặc không đông...',
  },
  {
    id: 5,
    sentenceBefore: 'Nhờ hoạt động chuyển hóa của loại khuẩn này mà thực phẩm có hương vị ',
    correctAnswer: ['chua ngọt', 'chua dịu', 'chua thanh', 'chua nhẹ', 'ngon', 'chua'],
    sentenceAfter: ' đặc trưng dễ chịu đồng thời bảo quản được lâu hơn.',
    placeholder: 'Vị gì kết hợp với chua...',
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Nhóm Lactic 🔬', score: 9850, emoji: '🥇' },
  { rank: 2, name: 'Nhóm Sữa Chua 🥛', score: 8900, emoji: '🥈' },
  { rank: 3, name: 'Nhóm Dưa Muối 🥬', score: 8240, emoji: '🥉' },
];

export const PEDAGOGY_CARDS: ProjectCard[] = [
  {
    title: 'Mô hình Blended Learning',
    description: 'Hỗn hợp phương pháp truyền thống kết hợp công nghệ số hóa. Giúp tối đa hóa khả năng cá nhân hóa người học.',
    type: 'pedagogy',
    bullets: ['Học tập mọi lúc mọi nơi', 'Học sinh chủ động điều chỉnh tốc độ học', 'Tiết kiệm thời gian rảnh lớp'],
  },
  {
    title: 'Lớp học đảo ngược (Flipped Classroom)',
    description: 'Chuyển giao vai trò truyền đạt bài lý thuyết gốc từ trường về nhà thông qua tài liệu số hướng dẫn kỹ lưỡng.',
    type: 'pedagogy',
    bullets: ['Học lý thuyết trước ở nhà', 'Môi trường lớp dùng để thực hành rèn luyện chéo', 'Gia tăng tương tác thầy trò'],
  },
  {
    title: 'Chu trình học trải nghiệm của Kolb',
    description: 'Thầy cô dắt các em trải qua 4 bước phát triển logic, thẫm thấu kỹ năng vững chãi.',
    type: 'pedagogy',
    bullets: [
      'Trải nghiệm cụ thể (Làm sữa chua tuần tự)',
      'Phản ngẫm sâu (Xem tại sao đặc/lỏng)',
      'Khái quát hóa lý thuyết (Lý giải vi khuẩn Lactic)',
      'Áp dụng tích cực (Giải cứu mẻ hỏng)',
    ],
  },
  {
    title: 'Học thuyết Kiến Tạo & Nhân Văn',
    description: 'Trọng tâm xoay quanh việc học sinh tự xây dựng cấu trúc tư duy dựa trên kết quả nghiệm chứng thực thể.',
    type: 'pedagogy',
    bullets: ['Lấy cảm xúc người học làm mốc phát triển', 'Tự đúc kết kiến thức sau thực chứng', 'Bảo đảm an toàn thân thể'],
  },
];

export const FEATURE_CARDS: ProjectCard[] = [
  {
    title: 'Video 2D Hướng dẫn & Tiêu điểm an toàn',
    description: 'Trực quan hóa công thức dế mốc, cảnh báo đỏ lưu ý đun nước ấm có ba mẹ canh chừng.',
    type: 'feature',
  },
  {
    title: 'Nhật ký trực tuyến tương tác',
    description: 'Form thu thập nhật trình chuyển trạng thái sữa, tự động báo lưu tức thì không lo thất lạc.',
    type: 'feature',
  },
  {
    title: 'Thang điểm Rubric 5 Sao ảo',
    description: 'Học sinh thỏa thích làm giám khảo, chấm điểm sản phẩm sữa chua bạn bè một cách minh bạch dễ hiểu.',
    type: 'feature',
  },
  {
    title: 'Sơ đồ tư duy & Game đố chữ lôi cuốn',
    description: 'Bản đồ khái quát quá trình lên men, tạo động lực đua điểm qua hoạt động gamification nhẹ nhàng.',
    type: 'feature',
  },
  {
    title: 'Đồng hồ đếm ngược thảo luận nhóm',
    description: 'Tiết chế khoảng lặng thừa trên lớp, thôi thúc các em hăng say nảy kiến giải trong thời hạn vàng.',
    type: 'feature',
  },
  {
    title: 'Nhúng thách đấu ôn tập Kahoot',
    description: 'Đặt ngay đường dẫn ôn luyện lý thuyết dưa muối dầm, sữa lên men cùng bảng xếp hạng vinh danh.',
    type: 'feature',
  },
];
