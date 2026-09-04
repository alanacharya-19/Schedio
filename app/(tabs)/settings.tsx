import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingsItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  type: 'nav' | 'toggle' | 'info';
  value?: string;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  color?: string;
};

export default function SettingsScreen() {
  const colors = useThemeColor();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const sections = [
    {
      title: 'Security',
      items: [
        {
          icon: 'lock-closed',
          label: 'App Lock',
          value: 'PIN',
          type: 'nav' as const,
          onPress: () => Alert.alert('App Lock', 'Change your PIN or password.'),
        },
        {
          icon: 'finger-print',
          label: 'Biometric Unlock',
          type: 'toggle' as const,
          toggleValue: false,
          onToggle: (value: boolean) => {},
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          label: 'Push Notifications',
          type: 'toggle' as const,
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'alarm',
          label: 'Reminder Time',
          value: '15 min before',
          type: 'nav' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Connected Accounts',
      items: [
        {
          icon: 'logo-instagram',
          label: 'Instagram',
          value: 'Not Connected',
          type: 'nav' as const,
          onPress: () => {},
        },
        {
          icon: 'logo-tiktok',
          label: 'TikTok',
          value: 'Not Connected',
          type: 'nav' as const,
          onPress: () => {},
        },
        {
          icon: 'logo-facebook',
          label: 'Facebook',
          value: 'Not Connected',
          type: 'nav' as const,
          onPress: () => {},
        },
        {
          icon: 'logo-whatsapp',
          label: 'WhatsApp',
          value: 'Not Connected',
          type: 'nav' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'toggle' as const,
          toggleValue: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          icon: 'globe',
          label: 'Timezone',
          value: 'Auto',
          type: 'nav' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'download',
          label: 'Export Schedules',
          type: 'nav' as const,
          onPress: () => Alert.alert('Export', 'Export your schedules as JSON.'),
        },
        {
          icon: 'cloud-upload',
          label: 'Import Backup',
          type: 'nav' as const,
          onPress: () => Alert.alert('Import', 'Import a backup file.'),
        },
        {
          icon: 'trash',
          label: 'Clear All Data',
          type: 'nav' as const,
          onPress: () => Alert.alert(
            'Clear Data',
            'This will delete all your schedules, drafts, and settings. This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => {} },
            ]
          ),
          color: '#EF4444',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle',
          label: 'Version',
          value: '1.0.0',
          type: 'info' as const,
        },
        {
          icon: 'document-text',
          label: 'Privacy Policy',
          type: 'nav' as const,
          onPress: () => {},
        },
        {
          icon: 'document-text',
          label: 'Terms of Service',
          type: 'nav' as const,
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <Pressable
                    onPress={item.onPress}
                    disabled={item.type === 'toggle'}
                    style={[
                      styles.settingsItem,
                      item.type === 'nav' && { opacity: 1 },
                    ]}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIcon, { backgroundColor: ((item as any).color || colors.tint) + '15' }]}>
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          color={(item as any).color || colors.tint}
                        />
                      </View>
                      <Text style={[
                        styles.itemLabel,
                        { color: (item as any).color || colors.text },
                      ]}>
                        {item.label}
                      </Text>
                    </View>

                    <View style={styles.itemRight}>
                      {item.type === 'toggle' && (
                        <Switch
                          value={item.toggleValue}
                          onValueChange={item.onToggle}
                          trackColor={{ false: colors.surfaceElevated, true: colors.tint + '50' }}
                          thumbColor={item.toggleValue ? colors.tint : colors.textMuted}
                        />
                      )}
                      {item.type === 'nav' && (
                        <>
                          {'value' in item && item.value && (
                            <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
                              {item.value}
                            </Text>
                          )}
                          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                        </>
                      )}
                    </View>
                  </Pressable>
                  {itemIndex < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Lock Button */}
        <Pressable
          onPress={() => router.replace('/lock')}
          style={[styles.lockButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="lock-closed" size={20} color={colors.tint} />
          <Text style={[styles.lockButtonText, { color: colors.tint }]}>Lock App Now</Text>
        </Pressable>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  lockButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
