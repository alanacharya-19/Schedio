import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ScheduledEvent, PlatformId } from '@/types';

interface EventCardProps {
  event: ScheduledEvent;
  onPress?: () => void;
}

const PLATFORM_COLORS: Record<PlatformId, string> = {
  instagram: '#E4405F',
  tiktok: '#010101',
  facebook: '#1877F2',
  whatsapp: '#25D366',
  youtube: '#FF0000',
  x: '#000000',
  linkedin: '#0A66C2',
  telegram: '#26A5E4',
};

const STATUS_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  COMPLETED: { icon: 'checkmark-circle', color: '#10B981' },
  FAILED: { icon: 'close-circle', color: '#EF4444' },
  CANCELLED: { icon: 'ban', color: '#6B7280' },
};

function getActionLabel(actionType: string): string {
  const labels: Record<string, string> = {
    post: 'Post',
    reel: 'Reel',
    story: 'Story',
    video: 'Video',
    message: 'Message',
  };
  return labels[actionType] || actionType;
}

function getPlatformLabel(platform: PlatformId): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function EventCard({ event, onPress }: EventCardProps) {
  const colors = useThemeColor();
  const platformColor = PLATFORM_COLORS[event.platform] || colors.tint;
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.COMPLETED;

  const date = new Date(event.scheduledAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.statusIcon, { backgroundColor: statusConfig.color + '15' }]}>
        <Ionicons name={statusConfig.icon} size={20} color={statusConfig.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.platformDot, { backgroundColor: platformColor }]} />
          <Text style={[styles.title, { color: colors.text }]}>
            {getPlatformLabel(event.platform)} {getActionLabel(event.actionType)}
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {formattedDate}
        </Text>
        {event.errorMessage && (
          <Text style={[styles.error, { color: '#EF4444' }]} numberOfLines={1}>
            {event.errorMessage}
          </Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
  },
});
