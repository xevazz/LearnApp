import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { getNotificationPrefs, saveNotificationPrefs } from '../services/storageService';

const NotificationsScreen = () => {
  const [enabled, setEnabled] = useState(false);
  const [newCourses, setNewCourses] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const prefs = await getNotificationPrefs();
      setEnabled(prefs.enabled || false);
      setNewCourses(prefs.newCourses || false);
      setReminders(prefs.reminders || false);
    };
    load();
  }, []);

  const toggleMain = async (val) => {
    setLoading(true);
    try {
      setEnabled(val);
      const updated = { enabled: val, newCourses: val ? newCourses : false, reminders: val ? reminders : false };
      await saveNotificationPrefs(updated);
      if (!val) {
        setNewCourses(false);
        setReminders(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleNewCourses = async (val) => {
    setNewCourses(val);
    await saveNotificationPrefs({ enabled, newCourses: val, reminders });
  };

  const toggleReminders = async (val) => {
    setReminders(val);
    await saveNotificationPrefs({ enabled, newCourses, reminders: val });
  };

  // simulate a test notification using Alert (expo-notifications not supported in Expo Go SDK 53+)
  const sendTestNotification = () => {
    if (!enabled) {
      Alert.alert('Notifications off', 'Enable notifications first.');
      return;
    }
    Alert.alert(
      '📚 Test notification',
      "You'll receive alerts about new books and study reminders.",
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status banner */}
      <View style={[styles.statusBanner, enabled ? styles.statusOn : styles.statusOff]}>
        <Text style={styles.statusIcon}>{enabled ? '🔔' : '🔕'}</Text>
        <View>
          <Text style={styles.statusTitle}>
            Notifications {enabled ? 'on' : 'off'}
          </Text>
          <Text style={styles.statusSub}>
            {enabled
              ? "You'll receive alerts and reminders"
              : "You won't receive any alerts"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Enable notifications</Text>
              <Text style={styles.rowSub}>Alerts and study reminders</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={toggleMain}
              disabled={loading}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>New books</Text>
              <Text style={styles.rowSub}>When new content is added</Text>
            </View>
            <Switch
              value={newCourses}
              onValueChange={toggleNewCourses}
              disabled={!enabled}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Study reminders</Text>
              <Text style={styles.rowSub}>Daily at 9:00 AM</Text>
            </View>
            <Switch
              value={reminders}
              onValueChange={toggleReminders}
              disabled={!enabled}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* Test button */}
      <TouchableOpacity
        style={[styles.testBtn, !enabled && styles.testBtnDisabled]}
        onPress={sendTestNotification}
        disabled={!enabled}
      >
        <Text style={styles.testBtnText}>🔔  Send test notification</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        * Notification preferences are saved locally and persist between sessions.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { padding: 16, paddingBottom: 32 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  statusOn: { backgroundColor: '#ECFDF5' },
  statusOff: { backgroundColor: '#FEF2F2' },
  statusIcon: { fontSize: 32 },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  statusSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  rowSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  testBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  testBtnDisabled: { backgroundColor: '#D1D5DB' },
  testBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  hint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 18 },
});

export default NotificationsScreen;
