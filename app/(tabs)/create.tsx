import React, { useCallback, useState } from 'react';
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
import { SocialIcon } from '@/components/SocialIcon';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformId, ActionType, ScheduledEvent } from '@/types';
import { PLATFORMS } from '@/constants/Platforms';
import { consumePendingPlatform } from '@/store/createCommand';
import { AppDateTimePicker } from '@/components/DateTimePicker';

type CreateStep = 'platform' | 'action' | 'content' | 'datetime' | 'preview';

const ACTION_LABELS: Record<string, string> = {
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
  video: 'Video',
  message: 'Message',
};

const ACTION_DESCRIPTIONS: Record<string, string> = {
  post: 'Share a photo or text post',
  reel: 'Share a short video',
  story: 'Share a temporary story',
  video: 'Share a video',
  message: 'Send a direct message',
};

const ACTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  post: 'document-text',
  reel: 'film',
  story: 'images',
  video: 'videocam',
  message: 'chatbubble',
};

export default function CreateScreen() {
  const colors = useThemeColor();
  const [step, setStep] = useState<CreateStep>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [scheduleTime, setScheduleTime] = useState<Date>(new Date());

  useFocusEffect(
    useCallback(() => {
      const pending = consumePendingPlatform();
      if (pending) {
        setSelectedPlatform(pending);
        setSelectedAction(null);
        setCaption('');
        setHashtags('');
        setRecipient('');
        setMessage('');
        setStep('action');
      } else {
        // No platform selected (e.g. "+" tab press): show the platform picker.
        setSelectedPlatform(null);
        setSelectedAction(null);
        setCaption('');
        setHashtags('');
        setRecipient('');
        setMessage('');
        setStep('platform');
      }
    }, [])
  );

  const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
  const capabilities = platform?.capabilities || [];
  const selectedCapability = capabilities.find((c) => c.actionType === selectedAction);

  const handlePlatformSelect = (platformId: PlatformId) => {
    setSelectedPlatform(platformId);
    setStep('action');
  };

  const handleActionSelect = (actionType: ActionType) => {
    setSelectedAction(actionType);
    setStep('content');
  };

  const handleContentSubmit = () => {
    setStep('datetime');
  };

  const handleSchedule = () => {
    setStep('preview');
  };

  const handleConfirmSchedule = () => {
    const scheduledAt = new Date(
      scheduleDate.getFullYear(),
      scheduleDate.getMonth(),
      scheduleDate.getDate(),
      scheduleTime.getHours(),
      scheduleTime.getMinutes()
    );
    // Create event (will be implemented with SQLite in Phase 3)
    Alert.alert(
      'Scheduled!',
      `Your ${platform?.name} ${ACTION_LABELS[selectedAction || '']} has been scheduled for ${scheduledAt.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })}.`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          if (step === 'platform') router.back();
          else if (step === 'action') setStep('platform');
          else if (step === 'content') setStep('action');
          else if (step === 'datetime') setStep('content');
          else if (step === 'preview') setStep('datetime');
        }}
        style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {step === 'platform'
          ? 'Select Platform'
          : step === 'action'
          ? 'Select Action'
          : step === 'content'
          ? 'Create Content'
          : step === 'datetime'
          ? 'Schedule'
          : 'Preview'}
      </Text>
      <View style={{ width: 44 }} />
    </View>
  );

  const renderProgress = () => {
    const steps = ['platform', 'action', 'content', 'datetime', 'preview'];
    const currentIndex = steps.indexOf(step);
    return (
      <View style={styles.progressRow}>
        {steps.map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              {
                backgroundColor: i <= currentIndex ? colors.tint : colors.surfaceElevated,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Step 1: Platform Selection
  if (step === 'platform') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        {renderHeader()}
        {renderProgress()}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            What do you want to schedule?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            Choose a platform to get started.
          </Text>

          <View style={styles.platformGrid}>
            {PLATFORMS.map((p) => (
              <SocialIcon
                key={p.id}
                platform={p.id}
                name={p.name}
                connected={p.connected}
                onPress={() => handlePlatformSelect(p.id)}
                size="large"
              />
            ))}
          </View>

          {/* Set an Event Option */}
          <View style={styles.setEventDivider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            onPress={() => router.push('/set-event')}
            style={[styles.setEventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.setEventIcon, { backgroundColor: colors.tintLight }]}>
              <Ionicons name="alarm" size={28} color={colors.tint} />
            </View>
            <View style={styles.setEventContent}>
              <Text style={[styles.setEventTitle, { color: colors.text }]}>Set an Event</Text>
              <Text style={[styles.setEventSubtitle, { color: colors.textSecondary }]}>
                Schedule a reminder by date & time
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 2: Action Selection
  if (step === 'action') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        {renderHeader()}
        {renderProgress()}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            What do you want to schedule?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            {platform?.name} actions
          </Text>

          <View style={styles.actionsList}>
            {capabilities.map((capability) => (
              <Pressable
                key={capability.actionType}
                onPress={() => handleActionSelect(capability.actionType)}
                style={({ pressed }) => [
                  styles.actionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={[styles.actionIcon, { backgroundColor: platform?.color + '15' }]}>
                  <Ionicons
                    name={ACTION_ICONS[capability.actionType] || 'document'}
                    size={28}
                    color={platform?.color || colors.tint}
                  />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>
                    {capability.label}
                  </Text>
                  <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                    {capability.description}
                  </Text>
                  <View style={styles.actionMeta}>
                    {capability.executionMode === 'AUTOMATIC' ? (
                      <View style={[styles.autoTag, { backgroundColor: '#10B98115' }]}>
                        <Ionicons name="flash" size={12} color="#10B981" />
                        <Text style={styles.autoText}>Auto</Text>
                      </View>
                    ) : (
                      <View style={[styles.manualTag, { backgroundColor: '#F59E0B15' }]}>
                        <Ionicons name="hand-left" size={12} color="#F59E0B" />
                        <Text style={styles.manualText}>Reminder</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 3: Content
  if (step === 'content') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        {renderHeader()}
        {renderProgress()}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {selectedCapability?.label} Content
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Fill in the details for your {platform?.name} {ACTION_LABELS[selectedAction || '']}.
            </Text>

            {/* Media Selection (for post/reel/story/video) */}
            {selectedCapability?.requiresMedia && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Media</Text>
                <View style={styles.mediaOptions}>
                  <Pressable style={[styles.mediaOption, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="image" size={24} color={colors.tint} />
                    <Text style={[styles.mediaOptionText, { color: colors.text }]}>Choose Photo</Text>
                  </Pressable>
                  <Pressable style={[styles.mediaOption, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="videocam" size={24} color={colors.tint} />
                    <Text style={[styles.mediaOptionText, { color: colors.text }]}>Choose Video</Text>
                  </Pressable>
                  <Pressable style={[styles.mediaOption, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="camera" size={24} color={colors.tint} />
                    <Text style={[styles.mediaOptionText, { color: colors.text }]}>Take Photo</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Caption */}
            {selectedCapability?.supportsCaption && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Caption</Text>
                <TextInput
                  style={[styles.textArea, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="Write your caption..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Hashtags */}
            {selectedCapability?.supportsHashtags && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Hashtags</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  value={hashtags}
                  onChangeText={setHashtags}
                  placeholder="#travel #life #weekend"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}

            {/* Message/Recipient */}
            {selectedAction === 'message' && (
              <>
                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>Recipient</Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }]}
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Choose contact..."
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>Message</Text>
                  <TextInput
                    style={[styles.textArea, {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write your message..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </>
            )}

            {/* Media Attach */}
            {selectedCapability?.supportsMediaAttach && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Attachment (Optional)</Text>
                <Pressable style={[styles.attachButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="attach" size={20} color={colors.tint} />
                  <Text style={[styles.attachText, { color: colors.textSecondary }]}>Attach media</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={handleContentSubmit}
              style={[styles.nextButton, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 4: Date/Time
  if (step === 'datetime') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        {renderHeader()}
        {renderProgress()}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepTitle, { color: colors.text }]}>Schedule</Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            Choose when to publish your content.
          </Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Schedule Date</Text>
            <AppDateTimePicker
              mode="date"
              value={scheduleDate}
              onChange={setScheduleDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Schedule Time</Text>
            <AppDateTimePicker
              mode="time"
              value={scheduleTime}
              onChange={setScheduleTime}
            />
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.info }]}>
              {selectedCapability?.executionMode === 'AUTOMATIC'
                ? 'This action will be executed automatically at the scheduled time.'
                : 'You will receive a reminder at the scheduled time to publish manually.'}
            </Text>
          </View>

          <Pressable
            onPress={handleSchedule}
            style={[styles.nextButton, { backgroundColor: colors.tint }]}
          >
            <Text style={styles.nextButtonText}>Preview Schedule</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 5: Preview
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {renderHeader()}
      {renderProgress()}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.stepTitle, { color: colors.text }]}>Preview</Text>
        <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
          Review your schedule before confirming.
        </Text>

        <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.previewHeader}>
            <View style={[styles.previewPlatformBadge, { backgroundColor: platform?.color + '15' }]}>
              <Text style={[styles.previewPlatformText, { color: platform?.color }]}>
                {platform?.name}
              </Text>
            </View>
            <Text style={[styles.previewAction, { color: colors.text }]}>
              {ACTION_LABELS[selectedAction || '']}
            </Text>
          </View>

          {caption ? (
            <View style={styles.previewSection}>
              <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Caption</Text>
              <Text style={[styles.previewContent, { color: colors.text }]}>{caption}</Text>
            </View>
          ) : null}

          {hashtags ? (
            <View style={styles.previewSection}>
              <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Hashtags</Text>
              <Text style={[styles.previewContent, { color: colors.tint }]}>{hashtags}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.previewSection}>
              <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Message</Text>
              <Text style={[styles.previewContent, { color: colors.text }]}>{message}</Text>
            </View>
          ) : null}

          <View style={styles.previewSection}>
            <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Date</Text>
            <Text style={[styles.previewContent, { color: colors.text }]}>
              {scheduleDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Time</Text>
            <Text style={[styles.previewContent, { color: colors.text }]}>
              {scheduleTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Execution</Text>
            <View style={styles.executionRow}>
              <Ionicons
                name={selectedCapability?.executionMode === 'AUTOMATIC' ? 'flash' : 'hand-left'}
                size={16}
                color={selectedCapability?.executionMode === 'AUTOMATIC' ? '#10B981' : '#F59E0B'}
              />
              <Text style={[styles.previewContent, {
                color: selectedCapability?.executionMode === 'AUTOMATIC' ? '#10B981' : '#F59E0B',
              }]}>
                {selectedCapability?.executionMode === 'AUTOMATIC' ? 'Automatic' : 'Reminder required'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.previewActions}>
          <Pressable
            onPress={() => setStep('datetime')}
            style={[styles.editButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={handleConfirmSchedule}
            style={[styles.scheduleButton, { backgroundColor: colors.tint }]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
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
  flex: {
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    paddingTop: 8,
  },
  setEventDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  setEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  setEventIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setEventContent: {
    flex: 1,
    gap: 4,
  },
  setEventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  setEventSubtitle: {
    fontSize: 13,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionDescription: {
    fontSize: 13,
  },
  actionMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  autoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  autoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  manualTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  manualText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    minHeight: 100,
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  mediaOption: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  mediaOptionText: {
    fontSize: 11,
    fontWeight: '500',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
  },
  attachText: {
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
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
  nextButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 14,
    marginBottom: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewPlatformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewPlatformText: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewAction: {
    fontSize: 18,
    fontWeight: '600',
  },
  previewSection: {
    gap: 4,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  executionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButton: {
    flex: 2,
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
