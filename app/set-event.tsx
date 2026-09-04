import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppDateTimePicker } from '@/components/DateTimePicker';

export default function SetEventScreen() {
  const colors = useThemeColor();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventTime, setEventTime] = useState<Date>(new Date());
  const [notifyBefore, setNotifyBefore] = useState('15 min before');

  const reminderOptions = ['On time', '5 min before', '15 min before', '30 min before', '1 hour before'];

  const handleScheduleEvent = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please give your event a title.');
      return;
    }

    const scheduledAt = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      eventTime.getHours(),
      eventTime.getMinutes()
    );

    Alert.alert(
      'Event Scheduled',
      `"${title}" scheduled for ${scheduledAt.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })} at ${scheduledAt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}. You'll be notified ${notifyBefore}.`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Set Event</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroIcon, { backgroundColor: colors.tintLight }]}>
            <Ionicons name="alarm" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Set a personal reminder event and get notified at the scheduled time.
          </Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Post my new reel 🎬"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textArea, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any extra details..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Event Date</Text>
            <AppDateTimePicker
              mode="date"
              value={eventDate}
              onChange={setEventDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Event Time</Text>
            <AppDateTimePicker
              mode="time"
              value={eventTime}
              onChange={setEventTime}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Notify Me</Text>
            <View style={styles.reminderOptions}>
              {reminderOptions.map((option) => {
                const selected = notifyBefore === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setNotifyBefore(option)}
                    style={[
                      styles.reminderChip,
                      {
                        backgroundColor: selected ? colors.tintLight : colors.surface,
                        borderColor: selected ? colors.tint : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reminderChipText,
                        { color: selected ? colors.tint : colors.textSecondary },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="notifications" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.info }]}>
              You'll receive a notification{notifyBefore !== 'On time' ? ` ${notifyBefore}` : ''} reminding you about this event.
            </Text>
          </View>

          <Pressable
            onPress={handleScheduleEvent}
            style={[styles.scheduleButton, { backgroundColor: colors.tint }]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.scheduleButtonText}>Schedule Event</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  section: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  textArea: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    minHeight: 100,
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  reminderChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  reminderChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  scheduleButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
