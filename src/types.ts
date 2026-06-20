export interface DiaryEntry {
  id: string;
  studentName: string;
  studentGroup: string;
  startTime: string;
  color: string;
  state: 'lỏng' | 'hơi_đặc' | 'đặc';
  taste: string;
  notes?: string;
  createdAt: string;
}

export interface RubricCriteria {
  id: string;
  label: string;
  description: string;
  maxStars: number;
}

export interface ComparisonGroup {
  id: string;
  name: string;
  thickness: string;
  taste: string;
  diaryStatus: string;
  rating: number;
}

export interface MindMapNode {
  id: string;
  title: string;
  description: string;
  children?: MindMapNode[];
}

export interface QuizQuestion {
  id: number;
  sentenceBefore: string;
  correctAnswer: string[]; // support alternative lowercase spellings if needed
  sentenceAfter: string;
  placeholder: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  emoji: string;
}

export interface ProjectCard {
  title: string;
  description: string;
  type: 'pedagogy' | 'feature';
  bullets?: string[];
}
