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
  },
  {
    id: 4,
    text: "Which night do you prefer to go out partying?",
    options: [
      "Thursday",
      "Friday",
      "Saturday",
      "Any night!"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    text: "What's your go-to drink at Zoco Salamandra?",
    options: [
      "Cocktails",
      "Beer",
      "Shots",
      "Non-alcoholic"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    text: "Do you usually come with friends or alone?",
    options: [
      "Always with friends",
      "Sometimes alone",
      "It depends",
      "I'm here to make new friends"
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    text: "What's your favorite aspect of Zoco Salamandra?",
    options: [
      "Music",
      "Ambience",
      "Drinks",
      "Staff"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    text: "Would you like to receive special offers or event notifications?",
    options: [
      "Yes, via Email",
      "Yes, via SMS",
      "Yes, via Social Media",
      "No, thank you"
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    text: "How likely are you to recommend Zoco Salamandra to a friend?",
    options: [
      "Definitely",
      "Probably",
      "Maybe",
      "Not likely"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    text: "Which upcoming event are you most excited about at Zoco Salamandra?",
    options: [
      "Live DJ Night",
      "Themed Parties",
      "Karaoke Sessions",
      "Not sure yet"
    ],
    correctAnswer: 0
  }
];
