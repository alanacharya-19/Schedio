import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SocialIconProps {
  platform: string;
  name: string;
  connected?: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

// Local brand logo images (assets/icons)
const PLATFORM_IMAGES: Record<string, ImageSourcePropType> = {
  instagram: require('@/assets/icons/instagram.png'),
  tiktok: require('@/assets/icons/tiktok.png'),
  facebook: require('@/assets/icons/facebook.png'),
  whatsapp: require('@/assets/icons/whatsapp.png'),
};

const PLATFORM_ICON_FALLBACK: Record<string, keyof typeof Ionicons.glyphMap> = {
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

export function SocialIcon({ platform, name, onPress, size = 'medium' }: SocialIconProps) {
  const colors = useThemeColor();

  const iconSize = size === 'large' ? 56 : size === 'medium' ? 44 : 36;
  const containerSize = size === 'large' ? 72 : size === 'medium' ? 56 : 44;
  const fontSize = size === 'large' ? 12 : size === 'medium' ? 11 : 10;

  const platformColor = PLATFORM_COLORS[platform] || colors.tint;
  const platformImage = PLATFORM_IMAGES[platform];
  const fallbackIcon = PLATFORM_ICON_FALLBACK[platform];

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
            },
          ]}
        >
        {platformImage ? (
          <Image
            source={platformImage}
            style={{ width: iconSize, height: iconSize }}
            resizeMode="contain"
          />
        ) : fallbackIcon ? (
          <Ionicons name={fallbackIcon} size={iconSize} color={platformColor} />
        ) : (
          <Ionicons name="globe" size={iconSize} color={platformColor} />
        )}
        </View>
      <Text
        style={[styles.label, { color: colors.text, fontSize }]}
        numberOfLines={1}
      >
        {name}
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
  },
  label: {
    fontWeight: '600',
    marginTop: 2,
  },
});
