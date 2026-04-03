import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerSettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const toggleSettings = [
    {
      label: 'Push Notifications',
      icon: 'notifications-outline',
      color: '#f72585',
      value: notifications,
      onChange: setNotifications,
    },
    {
      label: 'Dark Mode',
      icon: 'moon-outline',
      color: '#7209b7',
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      label: 'Analytics Sharing',
      icon: 'analytics-outline',
      color: '#4361ee',
      value: analytics,
      onChange: setAnalytics,
    },
  ];

  const linkSettings = [
    { label: 'Account & Privacy', icon: 'shield-outline', color: '#06d6a0' },
    { label: 'Storage & Data', icon: 'server-outline', color: '#f77f00' },
    { label: 'About', icon: 'information-circle-outline', color: '#4cc9f0' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Settings</Text>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      {toggleSettings.map((item) => (
        <View key={item.label} style={styles.settingRow}>
          <View style={[styles.settingIcon, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={18} color={item.color} />
          </View>
          <Text style={styles.settingLabel}>{item.label}</Text>
          <Switch
            value={item.value}
            onValueChange={item.onChange}
            trackColor={{ false: '#2a2a40', true: '#4361ee' }}
            thumbColor="#fff"
          />
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MORE</Text>
      {linkSettings.map((item) => (
        <TouchableOpacity key={item.label} style={styles.settingRow} activeOpacity={0.7}>
          <View style={[styles.settingIcon, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={18} color={item.color} />
          </View>
          <Text style={styles.settingLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20 },
  heading: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#fff' },
});
