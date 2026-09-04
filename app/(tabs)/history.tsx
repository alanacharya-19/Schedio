import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { EventCard } from '@/components/EventCard';
import { MOCK_COMPLETED_EVENTS } from '@/constants/MockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformId, ScheduleStatus } from '@/types';

type FilterTab = 'all' | 'completed' | 'failed' | 'cancelled';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const PLATFORM_FILTERS: { key: PlatformId | 'all'; label: string }[] = [
  { key: 'all', label: 'All Platforms' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'whatsapp', label: 'WhatsApp' },
];

export default function HistoryScreen() {
  const colors = useThemeColor();
  const [statusFilter, setStatusFilter] = useState<FilterTab>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformId | 'all'>('all');
  const [showPlatformFilter, setShowPlatformFilter] = useState(false);

  const filteredEvents = MOCK_COMPLETED_EVENTS.filter((event) => {
    if (statusFilter !== 'all' && event.status.toLowerCase() !== statusFilter) return false;
    if (platformFilter !== 'all' && event.platform !== platformFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const getStatusCount = (status: FilterTab) => {
    if (status === 'all') return MOCK_COMPLETED_EVENTS.length;
    return MOCK_COMPLETED_EVENTS.filter(
      (e) => e.status.toLowerCase() === status
    ).length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>History</Text>
          <Pressable
            onPress={() => setShowPlatformFilter(!showPlatformFilter)}
            style={[styles.filterButton, {
              backgroundColor: platformFilter !== 'all' ? colors.tintLight : colors.surface,
              borderColor: platformFilter !== 'all' ? colors.tint : colors.border,
            }]}
          >
            <Ionicons
              name="filter"
              size={18}
              color={platformFilter !== 'all' ? colors.tint : colors.text}
            />
          </Pressable>
        </View>

        {/* Platform Filter Dropdown */}
        {showPlatformFilter && (
          <View style={[styles.filterDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {PLATFORM_FILTERS.map((pf) => (
              <Pressable
                key={pf.key}
                onPress={() => {
                  setPlatformFilter(pf.key);
                  setShowPlatformFilter(false);
                }}
                style={[
                  styles.filterOption,
                  platformFilter === pf.key && { backgroundColor: colors.tintLight },
                ]}
              >
                <Text style={[
                  styles.filterOptionText,
                  { color: platformFilter === pf.key ? colors.tint : colors.text },
                ]}>
                  {pf.label}
                </Text>
                {platformFilter === pf.key && (
                  <Ionicons name="checkmark" size={18} color={colors.tint} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Status Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {FILTER_TABS.map((tab) => {
            const count = getStatusCount(tab.key);
            return (
              <Pressable
                key={tab.key}
                onPress={() => setStatusFilter(tab.key)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: statusFilter === tab.key ? colors.tint : colors.surface,
                    borderColor: statusFilter === tab.key ? colors.tint : colors.border,
                  },
                ]}
              >
                <Text style={[
                  styles.tabText,
                  { color: statusFilter === tab.key ? '#FFFFFF' : colors.text },
                ]}>
                  {tab.label}
                </Text>
                <View style={[
                  styles.tabCount,
                  { backgroundColor: statusFilter === tab.key ? '#FFFFFF30' : colors.surfaceElevated },
                ]}>
                  <Text style={[
                    styles.tabCountText,
                    { color: statusFilter === tab.key ? '#FFFFFF' : colors.textSecondary },
                  ]}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Events List */}
        <View style={styles.eventsList}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No events found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {statusFilter === 'all' && platformFilter === 'all'
                  ? 'Your history will appear here'
                  : 'Try adjusting your filters'}
              </Text>
            </View>
          )}
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  filterDropdown: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabsRow: {
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabCount: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventsList: {
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
});
