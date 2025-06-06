import { Question } from '../../types';

// Example "quiz" questions focused on gathering client preferences
export const quizQuestions: Question[] = [
  {
    id: 1,
    text: "How did you hear about Zoco Salamandra?",
    options: [
      "Friends / Word of Mouth",
      "Instagram",
      "TikTok",
      "Other"
    ],
    correctAnswer: 0  // For a survey, this can be arbitrary
  },
  {
    id: 2,
    text: "Which music genre do you enjoy most at Zoco Salamandra?",
    options: [
      "Reggaeton",
      "EDM",
      "Latin Pop",
      "Rock / Indie"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    text: "How often do you visit Zoco Salamandra?",
    options: [
      "Every weekend",
      "Once a month",
      "A few times a year",
      "This is my first time"
    ],
    correctAnswer: 0
  }
];
