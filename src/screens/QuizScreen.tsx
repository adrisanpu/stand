import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { quizQuestions } from '../constants/zoco/quizData';
import { COLORS, SIZES, FONTS } from '../constants/zoco/theme';

type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

const QuizScreen = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: timeLeft / 30,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  useEffect(() => {
    if (shouldNavigate) {
      navigation.navigate('Roulette', {
        score,
        totalQuestions: quizQuestions.length,
      });
    }
  }, [shouldNavigate, score]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setShouldNavigate(true);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    setSelectedOption(selectedIndex);
    
    if (selectedIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setTimeLeft(30);
      }, 1000);
    } else {
      setTimeout(() => {
        setShouldNavigate(true);
      }, 1000);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/metal_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </Text>
        <View style={styles.timerContainer}>
          <View style={styles.timerBar}>
            <Animated.View
              style={[
                styles.timerProgress,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>
      
      <Text style={styles.questionText}>
        {quizQuestions[currentQuestionIndex].text}
      </Text>
      
      <View style={styles.optionsContainer}>
        {quizQuestions[currentQuestionIndex].options.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && 
                index === quizQuestions[currentQuestionIndex].correctAnswer && 
                { backgroundColor: COLORS.success },
              selectedOption === index && 
                index !== quizQuestions[currentQuestionIndex].correctAnswer && 
                { backgroundColor: COLORS.error },
            ]}
            onPress={() => handleAnswer(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  questionCount: {
    fontSize: SIZES.large,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  timerText: {
    fontSize: SIZES.font,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    marginTop: SIZES.base,
  },
  questionText: {
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    width: '100%',
    padding: SIZES.padding,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.secondary,
  },
  optionText: {
    fontSize: SIZES.font,
    color: COLORS.white,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
});

export default QuizScreen; 