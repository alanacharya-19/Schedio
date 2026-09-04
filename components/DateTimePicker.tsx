import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AppDateTimePickerProps {
  mode: 'date' | 'time';
  value: Date;
  onChange: (date: Date) => void;
}

export function AppDateTimePicker({ mode, value, onChange }: AppDateTimePickerProps) {
  const colors = useThemeColor();
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<Date>(value);

  const displayValue =
    mode === 'date'
      ? value.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : value.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

  const openPicker = () => {
    setDraft(value);
    setShow(true);
  };

  const closePicker = () => {
    setShow(false);
  };

  const confirm = () => {
    onChange(draft);
    setShow(false);
  };

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selected) {
        onChange(selected);
      }
      setShow(false);
      return;
    }
    // iOS: update draft live while the spinner stays open
    if (selected) {
      setDraft(selected);
    }
  };

  const picker = (
    <DateTimePicker
      value={draft}
      mode={mode}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={handleChange}
      minimumDate={mode === 'date' ? new Date() : undefined}
    />
  );

  return (
    <View>
      <Pressable
        onPress={openPicker}
        style={[
          styles.field,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.fieldContent}>
          <Ionicons
            name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
            size={20}
            color={colors.tint}
          />
          <Text style={[styles.fieldText, { color: colors.text }]}>
            {displayValue}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <Pressable style={styles.modalDismiss} onPress={closePicker} />
            <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
              <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
                <Pressable onPress={closePicker} hitSlop={10}>
                  <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
                </Pressable>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>
                  {mode === 'date' ? 'Select Date' : 'Select Time'}
                </Text>
                <Pressable onPress={confirm} hitSlop={10}>
                  <Text style={[styles.doneText, { color: colors.tint }]}>Done</Text>
                </Pressable>
              </View>
              {picker}
            </View>
          </View>
        </Modal>
      ) : (
        show && picker
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldText: {
    fontSize: 15,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalDismiss: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    fontSize: 16,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
