import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messages = [
  { name: 'Sarah K.', message: 'Hey, can we schedule a call?', time: '2m', unread: 2 },
  { name: 'Mike R.', message: 'The PR is ready for review', time: '15m', unread: 0 },
  { name: 'Team Chat', message: 'New deployment successful ✅', time: '1h', unread: 5 },
  { name: 'Lisa T.', message: 'Thanks for the update!', time: '3h', unread: 0 },
  { name: 'Dev Group', message: 'Sprint planning tomorrow at 10', time: '5h', unread: 1 },
];

export default function MessagesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Messages</Text>

      {messages.map((msg, idx) => (
        <TouchableOpacity key={idx} style={styles.msgCard} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{msg.name[0]}</Text>
          </View>
          <View style={styles.msgContent}>
            <View style={styles.msgTop}>
              <Text style={styles.msgName}>{msg.name}</Text>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
            <Text
              style={[styles.msgText, msg.unread > 0 && styles.msgTextBold]}
              numberOfLines={1}
            >
              {msg.message}
            </Text>
          </View>
          {msg.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{msg.unread}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20 },
  heading: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 20 },
  msgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4361ee33',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#4361ee' },
  msgContent: { flex: 1 },
  msgTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  msgName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  msgTime: { fontSize: 12, color: '#555' },
  msgText: { fontSize: 13, color: '#666' },
  msgTextBold: { color: '#aaa', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: '#4361ee',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: { fontSize: 11, color: '#fff', fontWeight: '800' },
});
