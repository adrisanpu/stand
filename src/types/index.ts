export interface User {
  instagramHandle: string;
  highScore: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  instagramHandle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Quiz: undefined;
  Results: { score: number; totalQuestions: number };
  Leaderboard: undefined;
  Raffle: { participants: string[] };
}; 