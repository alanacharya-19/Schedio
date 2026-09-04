import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ScheduleCard } from '@/components/ScheduleCard';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduledEvent } from '@/types';

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const colors = useThemeColor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const today = new Date();
  const todayStr = today.toDateString();

  const getEventsForDate = (date: Date): ScheduledEvent[] => {
    const events: ScheduledEvent[] = [];
    return events;
  };

  const selectedDayEvents = getEventsForDate(selectedDate);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleEventPress = (event: ScheduledEvent) => {
    Alert.alert(
      'Event Options',
      `${event.platform.charAt(0).toUpperCase() + event.platform.slice(1)} ${event.actionType}`,
      [
        { text: 'Edit', onPress: () => {} },
        { text: 'Reschedule', onPress: () => {} },
        { text: 'Duplicate', onPress: () => {} },
        { text: 'Cancel Event', style: 'destructive', onPress: () => {} },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === todayStr;
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasEvents = getEventsForDate(date).length > 0;

      days.push(
        <Pressable
          key={day}
          onPress={() => setSelectedDate(date)}
          style={[
            styles.calendarDay,
            isSelected && {
              backgroundColor: colors.tint,
            },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              {
                color: isSelected ? '#FFFFFF' : isToday ? colors.tint : colors.text,
                fontWeight: isToday || isSelected ? '700' : '400',
              },
            ]}
          >
            {day}
          </Text>
          {hasEvents && (
            <View
              style={[
                styles.eventDot,
                { backgroundColor: isSelected ? '#FFFFFF' : colors.tint },
              ]}
            />
          )}
        </Pressable>
      );
    }

    return days;
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Schedule</Text>
          <Pressable
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/create')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <Pressable onPress={handlePrevMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: colors.text }]}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <Pressable onPress={handleNextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {DAY_NAMES.map((day) => (
              <Text key={day} style={[styles.dayName, { color: colors.textMuted }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>
        </View>

        {/* Selected Date Events */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedDate.toDateString() === todayStr
              ? "Today's Events"
              : selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
          </Text>

          {selectedDayEvents.length > 0 ? (
            <View style={styles.eventsList}>
              {selectedDayEvents.map((event) => (
                <ScheduleCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event)}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyDay, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No events scheduled
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 15,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  eventsList: {
    gap: 12,
  },
  emptyDay: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
  },
});
