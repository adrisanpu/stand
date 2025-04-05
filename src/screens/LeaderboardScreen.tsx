import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface Score {
  instagramHandle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}

type LeaderboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Leaderboard'>;

const getRankEmoji = (index: number): string => {
  switch (index) {
    case 0:
      return '👑';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return `${index + 1}`;
  }
};

const LeaderboardScreen = () => {
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();
  const [scores, setScores] = useState<Score[]>([]);
  const [showRaffleModal, setShowRaffleModal] = useState(false);
  const [topCount, setTopCount] = useState('3');

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const scoresStr = await AsyncStorage.getItem('scores');
      if (scoresStr) {
        const allScores: Score[] = JSON.parse(scoresStr);
        const sortedScores = allScores.sort((a, b) => {
          const scoreA = (a.score / a.totalQuestions) * 100;
          const scoreB = (b.score / b.totalQuestions) * 100;
          return scoreB - scoreA;
        });
        setScores(sortedScores);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    }
  };

  const startRaffle = () => {
    const count = parseInt(topCount);
    if (isNaN(count) || count < 1 || count > scores.length) {
      Alert.alert('Invalid Number', `Please enter a number between 1 and ${scores.length}`);
      return;
    }

    const topParticipants = scores.slice(0, count).map(s => s.instagramHandle);
    setShowRaffleModal(false);
    navigation.navigate('Raffle', { participants: topParticipants });
  };

  const RaffleModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showRaffleModal}
      onRequestClose={() => setShowRaffleModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowRaffleModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Raffle Settings</Text>
          <Text style={styles.modalText}>
            Select number of top players for the raffle:
          </Text>
          <TextInput
            style={styles.input}
            value={topCount}
            onChangeText={setTopCount}
            keyboardType="numeric"
            maxLength={2}
          />
          <CustomButton
            title="Start Raffle"
            onPress={startRaffle}
            style={styles.raffleButton}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.primary]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity
          style={styles.raffleIcon}
          onPress={() => setShowRaffleModal(true)}
        >
          <Ionicons name="gift-outline" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={scores}
        keyExtractor={(item) => `${item.instagramHandle}-${item.timestamp}`}
        renderItem={({ item, index }) => (
          <View style={[
            styles.scoreItem,
            index < 3 && styles.topThree,
            index === 0 && styles.firstPlace
          ]}>
            <View style={styles.rankContainer}>
              <Text style={[styles.rank, index < 3 && styles.topRank]}>
                {getRankEmoji(index)}
              </Text>
            </View>
            <View style={styles.usernameBucket}>
              <Text style={styles.username}>{item.instagramHandle}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.score, index < 3 && styles.topScore]}>
                {((item.score / item.totalQuestions) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        )}
      />

      <RaffleModal />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  backButton: {
    padding: SIZES.base,
  },
  title: {
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  raffleIcon: {
    padding: SIZES.base,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.base / 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.base,
  },
  topThree: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  firstPlace: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rank: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  topRank: {
    fontSize: SIZES.large,
  },
  usernameBucket: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.base,
    padding: SIZES.base / 2,
    marginHorizontal: SIZES.base,
  },
  username: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: '600',
  },
  scoreContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  score: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  topScore: {
    color: COLORS.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.padding * 2,
    minWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  modalTitle: {
    fontSize: SIZES.large,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  modalText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white + '10',
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.padding,
    fontSize: SIZES.large,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  raffleButton: {
    minWidth: 200,
  },
});

export default LeaderboardScreen; 