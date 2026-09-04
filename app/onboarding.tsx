import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

type OnboardingStep = 'welcome' | 'choose-lock' | 'create-pin' | 'confirm-pin' | 'create-password' | 'confirm-password' | 'permissions';

export default function OnboardingScreen() {
  const colors = useThemeColor();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [lockType, setLockType] = useState<'pin' | 'password' | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);

  const handleGetStarted = () => {
    setStep('choose-lock');
  };

  const handleChooseLock = (type: 'pin' | 'password') => {
    setLockType(type);
    setStep(type === 'pin' ? 'create-pin' : 'create-password');
  };

  const handlePinSubmit = () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits.');
      return;
    }
    setStep('confirm-pin');
  };

  const handleConfirmPin = () => {
    if (pin !== confirmPin) {
      Alert.alert('Mismatch', 'PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }
    // Store PIN securely (will be implemented in Phase 2)
    setStep('permissions');
  };

  const handlePasswordSubmit = () => {
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    setStep('confirm-password');
  };

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match. Please try again.');
      setConfirmPassword('');
      return;
    }
    // Store password securely (will be implemented in Phase 2)
    setStep('permissions');
  };

  const handlePermissionsComplete = () => {
    // Store onboarding complete flag
    router.replace('/(tabs)');
  };

  if (step === 'welcome') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tintLight }]}>
            <Ionicons name="calendar" size={64} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Social Scheduler</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Schedule your social media activities from one place.
          </Text>
        </View>
        <Pressable
          onPress={handleGetStarted}
          style={[styles.button, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'choose-lock') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tintLight }]}>
            <Ionicons name="lock-closed" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Protect Your App</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create a PIN or password to protect your schedules and connected accounts.
          </Text>

          <View style={styles.optionsContainer}>
            <Pressable
              onPress={() => handleChooseLock('pin')}
              style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="keypad" size={32} color={colors.tint} />
              <Text style={[styles.optionTitle, { color: colors.text }]}>PIN</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                4-6 digit code
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleChooseLock('password')}
              style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="text" size={32} color={colors.tint} />
              <Text style={[styles.optionTitle, { color: colors.text }]}>Password</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                Alphanumeric
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'create-pin') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Create PIN</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter a 4-6 digit PIN to secure your app.
          </Text>

          <View style={styles.pinContainer}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: i < pin.length ? colors.tint : colors.surfaceElevated,
                    borderColor: i < pin.length ? colors.tint : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <TextInput
            style={[styles.hiddenInput]}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            secureTextEntry
          />

          <View style={styles.numpad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  if (num === 'del') {
                    setPin(pin.slice(0, -1));
                  } else if (num !== null && pin.length < 6) {
                    setPin(pin + num);
                  }
                }}
                style={[
                  styles.numpadKey,
                  {
                    backgroundColor: num !== null ? colors.surface : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                disabled={num === null}
              >
                {num === 'del' ? (
                  <Ionicons name="backspace" size={24} color={colors.text} />
                ) : num !== null ? (
                  <Text style={[styles.numpadText, { color: colors.text }]}>{num}</Text>
                ) : null}
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handlePinSubmit}
            style={[
              styles.button,
              { backgroundColor: pin.length >= 4 ? colors.tint : colors.surfaceElevated },
            ]}
            disabled={pin.length < 4}
          >
            <Text style={[
              styles.buttonText,
              { color: pin.length >= 4 ? '#FFFFFF' : colors.textMuted },
            ]}>
              Continue
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'confirm-pin') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Confirm PIN</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Re-enter your PIN to confirm.
          </Text>

          <View style={styles.pinContainer}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: i < confirmPin.length ? colors.tint : colors.surfaceElevated,
                    borderColor: i < confirmPin.length ? colors.tint : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <TextInput
            style={[styles.hiddenInput]}
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            secureTextEntry
          />

          <View style={styles.numpad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  if (num === 'del') {
                    setConfirmPin(confirmPin.slice(0, -1));
                  } else if (num !== null && confirmPin.length < 6) {
                    setConfirmPin(confirmPin + num);
                  }
                }}
                style={[
                  styles.numpadKey,
                  {
                    backgroundColor: num !== null ? colors.surface : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                disabled={num === null}
              >
                {num === 'del' ? (
                  <Ionicons name="backspace" size={24} color={colors.text} />
                ) : num !== null ? (
                  <Text style={[styles.numpadText, { color: colors.text }]}>{num}</Text>
                ) : null}
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleConfirmPin}
            style={[
              styles.button,
              { backgroundColor: confirmPin.length >= 4 ? colors.tint : colors.surfaceElevated },
            ]}
            disabled={confirmPin.length < 4}
          >
            <Text style={[
              styles.buttonText,
              { color: confirmPin.length >= 4 ? '#FFFFFF' : colors.textMuted },
            ]}>
              Confirm
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'create-password') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Create Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter a password with at least 6 characters.
            </Text>

            <TextInput
              style={[styles.input, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoFocus
            />

            <Pressable
              onPress={handlePasswordSubmit}
              style={[
                styles.button,
                { backgroundColor: password.length >= 6 ? colors.tint : colors.surfaceElevated },
              ]}
              disabled={password.length < 6}
            >
              <Text style={[
                styles.buttonText,
                { color: password.length >= 6 ? '#FFFFFF' : colors.textMuted },
              ]}>
                Continue
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'confirm-password') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Confirm Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Re-enter your password to confirm.
            </Text>

            <TextInput
              style={[styles.input, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoFocus
            />

            <Pressable
              onPress={handleConfirmPassword}
              style={[
                styles.button,
                { backgroundColor: confirmPassword.length >= 6 ? colors.tint : colors.surfaceElevated },
              ]}
              disabled={confirmPassword.length < 6}
            >
              <Text style={[
                styles.buttonText,
                { color: confirmPassword.length >= 6 ? '#FFFFFF' : colors.textMuted },
              ]}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'permissions') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tintLight }]}>
            <Ionicons name="notifications" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Stay Notified</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Allow notifications so we can remind you when a scheduled action is ready.
          </Text>

          <View style={styles.optionsContainer}>
            <Pressable
              onPress={() => {
                setNotificationsEnabled(true);
                handlePermissionsComplete();
              }}
              style={[styles.button, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.buttonText}>Allow Notifications</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setNotificationsEnabled(false);
                handlePermissionsComplete();
              }}
              style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Not Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  numpad: {
    width: '100%',
    maxWidth: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  numpadKey: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  numpadText: {
    fontSize: 28,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
