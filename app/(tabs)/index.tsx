import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialIcon } from '@/components/SocialIcon';
import { ScheduleCard } from '@/components/ScheduleCard';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformId, ScheduledEvent } from '@/types';
import { setPendingPlatform } from '@/store/createCommand';

const PLATFORMS = [
  { id: 'instagram' as PlatformId, name: 'Instagram', connected: false },
  { id: 'tiktok' as PlatformId, name: 'TikTok', connected: false },
  { id: 'facebook' as PlatformId, name: 'Facebook', connected: false },
  { id: 'whatsapp' as PlatformId, name: 'WhatsApp', connected: false },
];

export default function HomeScreen() {
  const colors = useThemeColor();

  const upcomingEvents: ScheduledEvent[] = [];

  const todayEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.scheduledAt);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  const tomorrowEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.scheduledAt);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate.toDateString() === tomorrow.toDateString();
  });

  const laterEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.scheduledAt);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate.toDateString() !== today.toDateString() && eventDate.toDateString() !== tomorrow.toDateString();
  });

  const handlePlatformPress = (platformId: PlatformId) => {
    setPendingPlatform(platformId);
    router.push({ pathname: '/create' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={colors.background === '#0F172A' ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Social Scheduler</Text>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="person" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Social Platforms */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Platforms</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.platformsRow}
          >
            {PLATFORMS.map((platform) => (
              <SocialIcon
                key={platform.id}
                platform={platform.id}
                name={platform.name}
                connected={platform.connected}
                onPress={() => handlePlatformPress(platform.id)}
                size="large"
              />
            ))}
          </ScrollView>
        </View>

        {/* Set Event Button */}
        <Pressable
          onPress={() => router.push('/set-event')}
          style={[styles.createButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="alarm" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Set Event</Text>
        </Pressable>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
            <Pressable onPress={() => router.push('/schedule')}>
              <Text style={[styles.viewAll, { color: colors.tint }]}>View All</Text>
            </Pressable>
          </View>

          {todayEvents.length > 0 && (
            <View style={styles.eventsGroup}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Today</Text>
              {todayEvents.map((event) => (
                <ScheduleCard key={event.id} event={event} compact />
              ))}
            </View>
          )}

          {tomorrowEvents.length > 0 && (
            <View style={styles.eventsGroup}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Tomorrow</Text>
              {tomorrowEvents.map((event) => (
                <ScheduleCard key={event.id} event={event} compact />
              ))}
            </View>
          )}

          {laterEvents.length > 0 && (
            <View style={styles.eventsGroup}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Later</Text>
              {laterEvents.map((event) => (
                <ScheduleCard key={event.id} event={event} compact />
              ))}
            </View>
          )}

          {upcomingEvents.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No upcoming events</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Create your first schedule to get started
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Notification Bar */}
        <View style={[styles.notificationBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.notificationContent}>
            <Ionicons name="notifications" size={20} color={colors.tint} />
            <Text style={[styles.notificationText, { color: colors.text }]}>
              {upcomingEvents.length} scheduled event{upcomingEvents.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/schedule')}>
            <Text style={[styles.viewAll, { color: colors.tint }]}>View All</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  platformsRow: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsGroup: {
    marginBottom: 16,
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
