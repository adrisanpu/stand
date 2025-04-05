export type RootStackParamList = {
  Login: undefined;
  Quiz: undefined;
  Results: {
    score: number;
    totalQuestions: number;
  };
  Leaderboard: undefined;
  Raffle: {
    participants: string[];
  };
  Roulette: {
    score: number;
    totalQuestions: number;
  };
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}; 