import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { quizQuestions } from '../constants/quizData';

interface Score {
  instagramHandle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  answers?: number[];
}

interface UserData {
  instagramHandle: string;
  age: number;
  gender: string;
  score: number;
  scorePercentage: number;
  playedAt: string;
}

interface QuestionData {
  questionText: string;
  options: {
    text: string;
    votes: number;
    isCorrect: boolean;
  }[];
  totalVotes: number;
}

interface RaffleData {
  date: string;
  participants: string[];
  winner: string | null;
}

export const exportGameData = async () => {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available on this platform');
    }

    // Fetch all data from AsyncStorage
    const [scoresStr, userMetadataStr, answersStr, raffleHistoryStr] = await Promise.all([
      AsyncStorage.getItem('scores'),
      AsyncStorage.getItem('userMetadata'),
      AsyncStorage.getItem('userAnswers'),
      AsyncStorage.getItem('raffleHistory'),
    ]);

    const scores: Score[] = scoresStr ? JSON.parse(scoresStr) : [];
    const userMetadata = userMetadataStr ? JSON.parse(userMetadataStr) : {};
    const userAnswers: Record<string, number[]> = answersStr ? JSON.parse(answersStr) : {};
    const raffleHistory: RaffleData[] = raffleHistoryStr ? JSON.parse(raffleHistoryStr) : [];

    // 1. Users section - combine user metadata with their scores
    const users: UserData[] = Object.entries(userMetadata).map(([handle, metadata]: [string, any]) => {
      const userScore = scores.find(s => s.instagramHandle === handle);
      return {
        instagramHandle: handle,
        age: metadata.age,
        gender: metadata.gender,
        score: userScore?.score || 0,
        scorePercentage: userScore ? (userScore.score / userScore.totalQuestions) * 100 : 0,
        playedAt: metadata.playedAt
      };
    }).sort((a, b) => b.scorePercentage - a.scorePercentage);

    // 2. Questions section - analyze votes for each option
    const questions: QuestionData[] = quizQuestions.map((question, qIndex: number) => {
      const optionVotes = question.options.map((optionText: string, oIndex: number) => {
        const votes = Object.values(userAnswers).filter(answers => 
          answers[qIndex] === oIndex
        ).length;

        return {
          text: optionText,
          votes,
          isCorrect: oIndex === question.correctAnswer,
        };
      });

      return {
        questionText: question.text,
        options: optionVotes,
        totalVotes: optionVotes.reduce((sum: number, opt: { votes: number }) => sum + opt.votes, 0),
      };
    });

    // 3. Create the export data object with the new structure
    const exportData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalParticipants: users.length,
        totalQuestions: quizQuestions.length,
        averageScore: users.length > 0
          ? users.reduce((sum, user) => sum + user.scorePercentage, 0) / users.length
          : 0,
        genderDistribution: Object.values(userMetadata).reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.gender] = (acc[curr.gender] || 0) + 1;
          return acc;
        }, {}),
        ageGroups: Object.values(userMetadata).reduce((acc: Record<string, number>, curr: any) => {
          const ageGroup = Math.floor(curr.age / 10) * 10;
          const key = `${ageGroup}-${ageGroup + 9}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}),
      },
      participants: users,
      questions: questions,
      raffleHistory: raffleHistory,
    };

    // Convert to JSON and create file
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `spicy-tamarind-quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Write file
    await FileSystem.writeAsStringAsync(filePath, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    });

    // Share file
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export Quiz Data',
      UTI: 'public.json'
    });

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}; 