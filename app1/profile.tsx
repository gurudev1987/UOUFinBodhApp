import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const menuLinks = [
  { label: 'Edit Profile', icon: 'create-outline', color: '#4361ee' },
  { label: 'Notifications', icon: 'notifications-outline', color: '#f72585' },
  { label: 'Privacy', icon: 'lock-closed-outline', color: '#7209b7' },
  { label: 'Help & Support', icon: 'help-circle-outline', color: '#4cc9f0' },
  { label: 'Log Out', icon: 'log-out-outline', color: '#ff6b6b' },
];

export default function TabProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#4361ee" />
        </View>
        <Text style={styles.name}>Alex Johnson</Text>
        <Text style={styles.email}>alex.johnson@email.com</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={13} color="#4cc9f0" />
          <Text style={styles.badgeText}>Verified Account</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[['12', 'Posts'], ['340', 'Followers'], ['128', 'Following']].map(([val, lbl]) => (
          <View key={lbl} style={styles.statBox}>
            <Text style={styles.statVal}>{val}</Text>
            <Text style={styles.statLbl}>{lbl}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      {menuLinks.map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuRow} activeOpacity={0.7}>
          <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={18} color={item.color} />
          </View>
          <Text style={[styles.menuLabel, item.label === 'Log Out' && { color: '#ff6b6b' }]}>
            {item.label}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 30 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4361ee22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4361ee',
    marginBottom: 14,
  },
  name: { fontSize: 22, fontWeight: '800', color: '#fff' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    backgroundColor: '#4cc9f022',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: '#4cc9f0', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statVal: { fontSize: 20, fontWeight: '800', color: '#fff' },
  statLbl: { fontSize: 11, color: '#555', marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, color: '#fff', fontWeight: '600' },
});
