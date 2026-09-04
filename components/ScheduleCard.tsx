import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ScheduledEvent, PlatformId } from '@/types';

interface ScheduleCardProps {
  event: ScheduledEvent;
  onPress?: () => void;
  compact?: boolean;
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

const ACTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  post: 'document-text',
  reel: 'film',
  story: 'images',
  video: 'videocam',
  message: 'chatbubble',
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  DRAFT: { color: '#6B7280', bg: '#F3F4F6', label: 'Draft' },
  SCHEDULED: { color: '#3B82F6', bg: '#EFF6FF', label: 'Scheduled' },
  READY: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Ready' },
  PROCESSING: { color: '#F59E0B', bg: '#FFFBEB', label: 'Processing' },
  COMPLETED: { color: '#10B981', bg: '#ECFDF5', label: 'Completed' },
  FAILED: { color: '#EF4444', bg: '#FEF2F2', label: 'Failed' },
  CANCELLED: { color: '#6B7280', bg: '#F3F4F6', label: 'Cancelled' },
  REMINDER_REQUIRED: { color: '#F59E0B', bg: '#FFFBEB', label: 'Reminder' },
};

function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (eventDay.getTime() === today.getTime()) return 'Today';
  if (eventDay.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

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

export function ScheduleCard({ event, onPress, compact = false }: ScheduleCardProps) {
  const colors = useThemeColor();
  const platformColor = PLATFORM_COLORS[event.platform] || colors.tint;
  const actionIcon = ACTION_ICONS[event.actionType] || 'document';
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.SCHEDULED;

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.compactCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[styles.compactIcon, { backgroundColor: platformColor + '15' }]}>
          <Ionicons name={actionIcon} size={20} color={platformColor} />
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>
            {getPlatformLabel(event.platform)} {getActionLabel(event.actionType)}
          </Text>
          <Text style={[styles.compactSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {event.caption || event.message || 'No content'}
          </Text>
        </View>
        <View style={styles.compactRight}>
          <Text style={[styles.compactTime, { color: colors.text }]}>
            {formatEventTime(event.scheduledAt)}
          </Text>
        </View>
      </Pressable>
    );
  }

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
      <View style={styles.cardHeader}>
        <View style={[styles.platformBadge, { backgroundColor: platformColor + '15' }]}>
          <Ionicons name={actionIcon} size={16} color={platformColor} />
          <Text style={[styles.platformText, { color: platformColor }]}>
            {getPlatformLabel(event.platform)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <Text style={[styles.cardTitle, { color: colors.text }]}>
        {getActionLabel(event.actionType)}
      </Text>

      {(event.caption || event.message) && (
        <Text style={[styles.cardContent, { color: colors.textSecondary }]} numberOfLines={2}>
          {event.caption || event.message}
        </Text>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatEventDate(event.scheduledAt)} · {formatEventTime(event.scheduledAt)}
          </Text>
        </View>
        <View style={[styles.executionBadge, {
          backgroundColor: event.executionMode === 'AUTOMATIC' ? '#10B98115' : '#F59E0B15',
        }]}>
          <Ionicons
            name={event.executionMode === 'AUTOMATIC' ? 'flash' : 'hand-left'}
            size={12}
            color={event.executionMode === 'AUTOMATIC' ? '#10B981' : '#F59E0B'}
          />
          <Text style={[styles.executionText, {
            color: event.executionMode === 'AUTOMATIC' ? '#10B981' : '#F59E0B',
          }]}>
            {event.executionMode === 'AUTOMATIC' ? 'Auto' : 'Manual'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
  },
  executionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  executionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  compactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContent: {
    flex: 1,
    gap: 2,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactSubtitle: {
    fontSize: 12,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactTime: {
    fontSize: 13,
    fontWeight: '600',
  },
});
