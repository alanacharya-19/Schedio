import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SocialIconProps {
  platform: string;
  name: string;
  connected: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

const PLATFORM_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  instagram: 'logo-instagram',
  tiktok: 'logo-tiktok',
  facebook: 'logo-facebook',
  whatsapp: 'logo-whatsapp',
  youtube: 'logo-youtube',
  x: 'logo-twitter',
  linkedin: 'logo-linkedin',
  telegram: 'paper-plane',
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E4405F',
  tiktok: '#010101',
  facebook: '#1877F2',
  whatsapp: '#25D366',
  youtube: '#FF0000',
  x: '#000000',
  linkedin: '#0A66C2',
  telegram: '#26A5E4',
};

export function SocialIcon({ platform, name, connected, onPress, size = 'medium' }: SocialIconProps) {
  const colors = useThemeColor();

  const iconSize = size === 'large' ? 56 : size === 'medium' ? 44 : 36;
  const containerSize = size === 'large' ? 72 : size === 'medium' ? 56 : 44;
  const fontSize = size === 'large' ? 12 : size === 'medium' ? 11 : 10;

  const platformColor = PLATFORM_COLORS[platform] || colors.tint;
  const iconName = PLATFORM_ICONS[platform] || 'globe';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: containerSize,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            width: containerSize,
            height: containerSize,
            backgroundColor: connected ? platformColor + '15' : colors.surfaceElevated,
            borderColor: connected ? platformColor : colors.border,
            borderWidth: connected ? 2 : 1,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={iconSize}
          color={connected ? platformColor : colors.textMuted}
        />
        {connected && (
          <View style={[styles.connectedDot, { backgroundColor: '#10B981' }]} />
        )}
      </View>
      <Text
        style={[
          styles.label,
          {
            color: connected ? colors.text : colors.textMuted,
            fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text
        style={[
          styles.status,
          {
            color: connected ? '#10B981' : colors.textMuted,
            fontSize: size === 'large' ? 10 : 9,
          },
        ]}
      >
        {connected ? 'Connected' : 'Not connected'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  connectedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: {
    fontWeight: '600',
    marginTop: 2,
  },
  status: {
    fontWeight: '400',
  },
});
