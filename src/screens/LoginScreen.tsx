import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, Modal, ViewStyle, ImageBackground, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/zoco/theme';

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
    if (!username) {
      setError('Please enter your Instagram username');
      return;
    }

    if (!age) {
      setError('Please enter your age');
      return;
    }

    if (!gender) {
      setError('Please select your gender');
      return;
    }

    try {
      // Check if user has already played
      const hasPlayed = await AsyncStorage.getItem(`played_${username}`);
      if (hasPlayed === 'true') {
        Alert.alert(
          'Already Played',
          'You have already completed the quiz. Only one attempt is allowed per user.',
          [{ text: 'OK' }]
        );
        return;
      }

      await AsyncStorage.setItem('instagramHandle', username);
      await AsyncStorage.setItem('age', age);
      await AsyncStorage.setItem('gender', gender);
      navigation.replace('Quiz');
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Failed to save user data. Please try again.');
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
    <ImageBackground
      source={require('../../assets/metal_background.png')}
      style={styles.container}
      resizeMode="cover"
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
            keyboardType="number-pad"
            maxLength={3}
            returnKeyType="done"
            onSubmitEditing={() => {
              // Dismiss keyboard when done is pressed
              Keyboard.dismiss();
            }}
            blurOnSubmit={true}
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
    </ImageBackground>
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
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    color: COLORS.black,
    fontSize: SIZES.font,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.white,
    height: 40,
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
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.base / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    height: 40,
  },
  genderButtonSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  genderButtonText: {
    color: COLORS.black,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
  genderButtonTextSelected: {
    color: COLORS.white,
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