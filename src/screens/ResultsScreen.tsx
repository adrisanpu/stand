import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';

type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute();
  const { score, totalQuestions } = route.params as { score: number; totalQuestions: number };
  
  const [scaleAnim] = useState(new Animated.Value(0));
  const percentage = (score / totalQuestions) * 100;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    saveScore();
  }, []);

  const saveScore = async () => {
    try {
      const instagramHandle = await AsyncStorage.getItem('instagramHandle');
      if (instagramHandle) {
        const existingScoresStr = await AsyncStorage.getItem('scores');
        const existingScores = existingScoresStr ? JSON.parse(existingScoresStr) : [];
        
        const newScore = {
          instagramHandle,
          score,
          totalQuestions,
          timestamp: Date.now(),
        };
        
        const updatedScores = [...existingScores, newScore]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Keep only top 10 scores
        
        await AsyncStorage.setItem('scores', JSON.stringify(updatedScores));
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a Spicy Tamarind Expert! 🏆";
    if (percentage >= 80) return "Amazing! You really know your stuff! 🌶️";
    if (percentage >= 60) return "Good job! Keep learning! 📚";
    if (percentage >= 40) return "Not bad! Study up for next time! 💪";
    return "Keep practicing! You'll get better! 🎯";
  };

  const buttonStyle = (isNext: boolean): ViewStyle => ({
    marginBottom: SIZES.base,
    ...(isNext ? {
      backgroundColor: COLORS.accent + '20',
      borderWidth: 2,
      borderColor: COLORS.accent,
    } : {}),
  });

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.primary]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.scoreText}>
          {score} / {totalQuestions}
        </Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.message}>{getMessage()}</Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="View Leaderboard"
            onPress={() => navigation.replace('Leaderboard')}
            style={buttonStyle(false)}
          />
          <CustomButton
            title="Next Player"
            onPress={() => navigation.replace('Login')}
            style={buttonStyle(false)}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  scoreText: {
    fontSize: SIZES.extraLarge * 2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.base,
  },
  percentageText: {
    fontSize: SIZES.extraLarge,
    color: COLORS.accent,
    marginBottom: SIZES.padding,
  },
  message: {
    fontSize: SIZES.large,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.base,
  },
});

export default ResultsScreen; 