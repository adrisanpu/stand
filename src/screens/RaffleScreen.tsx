import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants/zoco/theme';
import CustomButton from '../components/CustomButton';

type RaffleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Raffle'>;

interface RaffleScreenParams {
  participants: string[];
}

interface RaffleData {
  date: string;
  participants: string[];
  winner: string;
}

const RaffleScreen = () => {
  const navigation = useNavigation<RaffleScreenNavigationProp>();
  const route = useRoute();
  const { participants } = route.params as RaffleScreenParams;
  
  const [winner, setWinner] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState<string>(participants[0]);
  const [isRaffling, setIsRaffling] = useState(true);
  const [eligibleParticipants, setEligibleParticipants] = useState<string[]>([]);
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkEligibleParticipants();
  }, []);

  const checkEligibleParticipants = async () => {
    try {
      // Get previous winners
      const raffleHistoryStr = await AsyncStorage.getItem('raffleHistory');
      const raffleHistory: RaffleData[] = raffleHistoryStr ? JSON.parse(raffleHistoryStr) : [];
      const previousWinners = new Set(raffleHistory.map(raffle => raffle.winner));

      // Filter out previous winners
      const eligible = participants.filter(p => !previousWinners.has(p));
      
      if (eligible.length === 0) {
        Alert.alert(
          'No Eligible Participants',
          'All selected participants have already won in previous raffles. Please select different participants.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      setEligibleParticipants(eligible);
      setCurrentName(eligible[0]);
      startRaffleAnimation(eligible);
    } catch (error) {
      console.error('Error checking eligible participants:', error);
      Alert.alert('Error', 'Failed to start raffle. Please try again.');
      navigation.goBack();
    }
  };

  const saveRaffleResult = async (winner: string) => {
    try {
      const raffleHistoryStr = await AsyncStorage.getItem('raffleHistory');
      const raffleHistory: RaffleData[] = raffleHistoryStr ? JSON.parse(raffleHistoryStr) : [];
      
      const newRaffle: RaffleData = {
        date: new Date().toISOString(),
        participants,
        winner
      };

      raffleHistory.push(newRaffle);
      await AsyncStorage.setItem('raffleHistory', JSON.stringify(raffleHistory));
    } catch (error) {
      console.error('Error saving raffle result:', error);
    }
  };

  const animateNumber = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const startRaffleAnimation = (eligible: string[]) => {
    let cycles = 0;
    const maxCycles = 15;

    const cycleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligible.length);
      setCurrentName(eligible[randomIndex]);
      animateNumber();
      cycles++;

      if (cycles >= maxCycles) {
        clearInterval(cycleInterval);
        const finalIndex = Math.floor(Math.random() * eligible.length);
        const finalWinner = eligible[finalIndex];
        setCurrentName(finalWinner);
        setWinner(finalWinner);
        setIsRaffling(false);
        saveRaffleResult(finalWinner);

        Animated.sequence([
          Animated.spring(scaleAnimation, {
            toValue: 1.5,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          })
        ]).start();
      }
    }, 200);
  };

  return (
    <ImageBackground
      source={require('../../assets/metal_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isRaffling ? "Selecting winner..." : "Winner!"}
        </Text>
        
        <Animated.View
          style={[
            styles.winnerContainer,
            {
              transform: [{ scale: scaleAnimation }]
            }
          ]}
        >
          <Animated.Text 
            style={[
              styles.nameText,
              isRaffling ? styles.rafflingText : styles.winnerText
            ]}
          >
            {currentName}
          </Animated.Text>
        </Animated.View>

        {!isRaffling && (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Back to Leaderboard"
              onPress={() => navigation.goBack()}
              style={styles.button}
            />
          </View>
        )}
      </View>
    </ImageBackground>
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
    padding: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
  },
  winnerContainer: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.background + '80',
    borderRadius: SIZES.base * 2,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
    minWidth: 300,
  },
  nameText: {
    fontSize: SIZES.extraLarge * 1.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rafflingText: {
    color: COLORS.accent,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  winnerText: {
    color: COLORS.white,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  buttonContainer: {
    marginTop: SIZES.padding * 2,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    minWidth: 200,
  },
});

export default RaffleScreen; 