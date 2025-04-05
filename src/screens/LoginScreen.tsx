import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants/zoco/theme';
import CustomButton from '../components/CustomButton';
import Logo from '../components/Logo';
import { exportGameData } from '../utils/dataExport';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Gender = 'Male' | 'Female' | 'Not Specified';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Not Specified');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const checkUserPlayed = async (handle: string) => {
    try {
      const playedUsersStr = await AsyncStorage.getItem('playedUsers');
      const playedUsers = playedUsersStr ? JSON.parse(playedUsersStr) : [];
      return playedUsers.includes(handle);
    } catch (error) {
      console.error('Error checking played users:', error);
      return false;
    }
  };

  const addUserToPlayed = async (handle: string, userData: { age: number; gender: Gender }) => {
    try {
      // Save played users list
      const playedUsersStr = await AsyncStorage.getItem('playedUsers');
      const playedUsers = playedUsersStr ? JSON.parse(playedUsersStr) : [];
      playedUsers.push(handle);
      await AsyncStorage.setItem('playedUsers', JSON.stringify(playedUsers));

      // Save user metadata
      const userMetadataStr = await AsyncStorage.getItem('userMetadata');
      const userMetadata = userMetadataStr ? JSON.parse(userMetadataStr) : {};
      userMetadata[handle] = {
        ...userData,
        playedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('userMetadata', JSON.stringify(userMetadata));
    } catch (error) {
      console.error('Error adding user data:', error);
    }
  };

  const handleLogin = async () => {
    // Reset error
    setError('');

    // Validate username
    if (!username.trim()) {
      setError('Please enter your Instagram username');
      return;
    }

    if (!username.trim().match(/^[a-zA-Z0-9._]+$/)) {
      setError('Invalid Instagram username format');
      return;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError('Please enter a valid age (18-100)');
      return;
    }

    const cleanUsername = username.trim();
    const hasPlayed = await checkUserPlayed(cleanUsername);

    if (hasPlayed) {
      Alert.alert(
        'Already Played',
        'This user has already played the quiz. Each user can only play once!',
        [{ text: 'OK' }]
      );
      setUsername('');
      return;
    }

    try {
      await AsyncStorage.setItem('instagramHandle', cleanUsername);
      await addUserToPlayed(cleanUsername, { age: ageNum, gender });
      navigation.replace('Quiz');
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleExportData = async () => {
    try {
      await exportGameData();
      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const GenderButton = ({ value }: { value: Gender }) => (
    <TouchableOpacity
      style={[
        styles.genderButton,
        gender === value && styles.genderButtonSelected
      ]}
      onPress={() => setGender(value)}
    >
      <Text style={[
        styles.genderButtonText,
        gender === value && styles.genderButtonTextSelected
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  const SettingsModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showSettings}
      onRequestClose={() => setShowSettings(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSettings(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={async () => {
              try {
                await handleExportData();
              } finally {
                setShowSettings(false);
              }
            }}
          >
            <Ionicons name="download-outline" size={24} color={COLORS.white} />
            <Text style={styles.modalOptionText}>Export Game Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.modalOptionDanger]}
            onPress={() => {
              setShowSettings(false);
              Alert.alert(
                'End Game',
                'This will export all data and clear the game. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Yes, End Game', 
                    style: 'destructive', 
                    onPress: async () => {
                      try {
                        await handleExportData();
                        await AsyncStorage.clear();
                        Alert.alert(
                          'Game Ended',
                          'All data has been exported and cleared.',
                          [{ text: 'OK' }]
                        );
                      } catch (error) {
                        Alert.alert(
                          'Error',
                          'Failed to end game. Please try again.',
                          [{ text: 'OK' }]
                        );
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="power" size={24} color={COLORS.error} />
            <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>
              End Game
            </Text>
          </TouchableOpacity>
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
          style={styles.iconButton}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Ionicons name="trophy-outline" size={24} color={COLORS.white + '80'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.white + '80'} />
        </TouchableOpacity>
      </View>

      <SettingsModal />

      <View style={styles.content}>
        <Logo size={200} />
        <Text style={styles.title}>Zoco Salamandra Quiz</Text>
        <Text style={styles.subtitle}>Test your knowledge and win prizes!</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your Instagram username:</Text>
          <TextInput
            style={styles.input}
            placeholder="@username"
            placeholderTextColor={COLORS.white + '80'}
            value={username}
            onChangeText={(text) => {
              setUsername(text.startsWith('@') ? text.substring(1) : text);
              setError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor={COLORS.white + '80'}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Gender:</Text>
          <View style={styles.genderContainer}>
            <GenderButton value="Male" />
            <GenderButton value="Female" />
            <GenderButton value="Not Specified" />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Start Quiz"
            onPress={handleLogin}
            style={styles.button as ViewStyle}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  iconButton: {
    padding: SIZES.base,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginBottom: SIZES.base,
    marginTop: SIZES.padding,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white + '20',
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white + '40',
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginTop: SIZES.base,
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.base,
    marginTop: SIZES.padding,
  },
  button: {
    marginTop: 0,
    width: '100%',
  },
  leaderboardButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
    width: '100%',
  },
  leaderboardButtonText: {
    color: COLORS.accent,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.base,
  },
  genderButton: {
    flex: 1,
    padding: SIZES.base,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.white + '40',
    backgroundColor: COLORS.white + '10',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: COLORS.accent + '20',
    borderColor: COLORS.accent,
  },
  genderButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  genderButtonTextSelected: {
    color: COLORS.accent,
  },
  settingsButton: {
    position: 'absolute',
    top: SIZES.padding * 2,
    right: SIZES.padding,
    zIndex: 1,
    padding: SIZES.base,
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
    padding: SIZES.padding,
    minWidth: 250,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white + '10',
  },
  modalOptionDanger: {
    backgroundColor: COLORS.error + '10',
  },
  modalOptionText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    marginLeft: SIZES.base,
  },
  modalOptionTextDanger: {
    color: COLORS.error,
  },
});

export default LoginScreen; 