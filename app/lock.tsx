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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

type LockMode = 'enter' | 'forgot';

export default function AppLockScreen() {
  const colors = useThemeColor();
  const [mode, setMode] = useState<LockMode>('enter');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [lockType] = useState<'pin' | 'password'>('pin'); // Will come from SecureStore

  const handlePinDigit = (digit: string | 'del') => {
    if (digit === 'del') {
      setPin(pin.slice(0, -1));
    } else if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length >= 4) {
        // Verify PIN (will be implemented in Phase 2 with SecureStore)
        // For now, accept any 4+ digit PIN
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 200);
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (password.length >= 6) {
      // Verify password (will be implemented in Phase 2 with SecureStore)
      router.replace('/(tabs)');
    }
  };

  const handleForgot = () => {
    Alert.alert(
      'Forgot Password',
      'For security, you will need to reset your app lock. This will not affect your schedules.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => router.replace('/onboarding') },
      ]
    );
  };

  if (lockType === 'password') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tintLight }]}>
            <Ionicons name="lock-closed" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Enter Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your password to unlock Social Scheduler.
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
              Unlock
            </Text>
          </Pressable>

          <Pressable onPress={handleForgot} style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: colors.tint }]}>
              Forgot password?
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.tintLight }]}>
          <Ionicons name="lock-closed" size={48} color={colors.tint} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Enter PIN</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your PIN to unlock Social Scheduler.
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
          style={styles.hiddenInput}
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            if (text.length >= 4) {
              setTimeout(() => router.replace('/(tabs)'), 200);
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          secureTextEntry
        />

        <View style={styles.numpad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => (
            <Pressable
              key={i}
              onPress={() => handlePinDigit(num as string | 'del')}
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

        <View style={styles.bottomActions}>
          <Pressable onPress={handleForgot}>
            <Text style={[styles.forgotText, { color: colors.tint }]}>
              Forgot password?
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
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
  forgotButton: {
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomActions: {
    marginTop: 16,
  },
});
