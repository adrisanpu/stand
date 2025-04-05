import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants/zoco/theme';
import CustomButton from '../components/CustomButton';

type RouletteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Roulette'>;

interface RouletteOption {
  label: string;
  effect: (currentScore: number) => number;
  color: string;
  description: string;
}

const ROULETTE_OPTIONS: RouletteOption[] = [
  {
    label: '🎁',
    effect: (score) => Math.floor(score + 2),
    color: '#4CAF50',
    description: 'Score increased by 2!'
  },
  {
    label: '💀',
    effect: (score) => Math.floor(score * 0.75),
    color: '#f44336',
    description: 'Score decreased by 25%!'
  },
  {
    label: '🎯',
    effect: (score) => score * 2,
    color: '#2196F3',
    description: 'Double your score!'
  },
  {
    label: '🎨',
    effect: (score) => score,
    color: '#9C27B0',
    description: 'You won exclusive merch!'
  },
  {
    label: '🥃',
    effect: (score) => score,
    color: '#FF9800',
    description: 'You won a free shot!'
  },
];

const RouletteScreen = () => {
  const navigation = useNavigation<RouletteScreenNavigationProp>();
  const route = useRoute();
  const { score, totalQuestions } = route.params as { score: number; totalQuestions: number };
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RouletteOption | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [finalScore, setFinalScore] = useState(score);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const numberOfSpins = 5; // Number of full rotations
    const randomOption = Math.floor(Math.random() * ROULETTE_OPTIONS.length);
    const finalRotation = numberOfSpins + (randomOption / ROULETTE_OPTIONS.length);

    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: finalRotation,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedOption(ROULETTE_OPTIONS[randomOption]);
      const newScore = ROULETTE_OPTIONS[randomOption].effect(score);
      setFinalScore(newScore);
      setTimeout(() => {
        navigation.replace('Results', {
          score: newScore,
          totalQuestions,
        });
      }, 3500);
    });
  };

  const interpolatedSpin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.primary]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Spin & Win!</Text>
        <Text style={styles.subtitle}>Spin the wheel to modify your score</Text>
      </View>

      <View style={styles.wheelContainer}>
        <Animated.View
          style={[
            styles.wheel,
            {
              transform: [{ rotate: interpolatedSpin }],
            },
          ]}
        >
          {ROULETTE_OPTIONS.map((option, index) => {
            const startAngle = (index * 360) / ROULETTE_OPTIONS.length;
            return (
              <View
                key={index}
                style={[
                  styles.option,
                  {
                    transform: [
                      { rotate: `${startAngle}deg` }
                    ],
                    backgroundColor: option.color,
                  },
                ]}
              >
                <View style={styles.optionContent}>
                  <Text 
                    style={[
                      styles.optionText,
                      { transform: [{ rotate: `${-startAngle}deg` }] }
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </Animated.View>
        <View style={styles.pointer} />
      </View>

      {selectedOption ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{selectedOption.description}</Text>
          <Text style={styles.scoreText}>
            Final Score: {finalScore}
          </Text>
        </View>
      ) : (
        <CustomButton
          title={isSpinning ? "Spinning..." : "Spin the Wheel!"}
          onPress={spinWheel}
          disabled={isSpinning}
          style={styles.spinButton}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.white + '80',
  },
  wheelContainer: {
    width: Dimensions.get('window').width * 0.8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.padding * 2,
  },
  wheel: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'relative',
    overflow: 'hidden',
  },
  option: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: '0%',
    transformOrigin: '0% 100%',
  },
  optionContent: {
    position: 'absolute',
    left: '25%',
    top: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: COLORS.white,
    fontSize: SIZES.extraLarge * 1.5,
    textAlign: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.accent,
    zIndex: 1,
  },
  spinButton: {
    marginTop: SIZES.padding * 2,
    minWidth: 200,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: SIZES.padding * 2,
  },
  resultText: {
    fontSize: SIZES.large,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  scoreText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default RouletteScreen; 