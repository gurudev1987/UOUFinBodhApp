import { useLocalSearchParams, useRouter } from 'expo-router';
import { BASICS_TOPICS } from './index';
import React from 'react';
import {
  Image, Linking, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function BasicsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const topic = BASICS_TOPICS.find((t) => t.id === id);

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
          <Text style={{ color: '#1565C0', fontSize: 16 }}>‹ Go Back</Text>
        </TouchableOpacity>
        <Text style={{ padding: 24, color: '#555', fontSize: 16 }}>Topic not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.banner, { backgroundColor: topic.categoryColor }]}>
          {topic.image && (
            <Image source={{ uri: topic.image }} style={styles.bannerImage} resizeMode="cover" />
          )}
          <View style={styles.bannerOverlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.bannerEmoji}>{topic.emoji}</Text>
          <Text style={styles.bannerTitle}>{topic.name}</Text>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>{topic.category}</Text>
          </View>
        </View>

        <Section title="📋 About">
          <Text style={styles.descText}>{topic.fullDesc}</Text>
        </Section>
        <Section title="✅ Key Points">
          {topic.highlights.map((h, i) => <BulletRow key={i} color={topic.categoryColor} text={h} />)}
        </Section>
        <Section title="🎯 Who Should Know">
          {topic.eligibility.map((e, i) => <BulletRow key={i} color={topic.categoryColor} text={e} />)}
        </Section>
        <Section title="📝 How to Get Started">
          {topic.howToApply.map((step, i) => (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.stepNum, { color: topic.categoryColor }]}>{i + 1}.</Text>
              <Text style={styles.listText}>{step}</Text>
            </View>
          ))}
        </Section>

        {topic.website && (
          <TouchableOpacity
            style={[styles.websiteBtn, { backgroundColor: topic.categoryColor }]}
            onPress={() => Linking.openURL(topic.website!)}
            activeOpacity={0.85}
          >
            <Text style={styles.websiteBtnText}>🌐 Learn More</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletRow({ color, text }: { color: string; text: string }) {
  return (
    <View style={styles.listRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.listText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 24 },
  banner: { minHeight: 220, justifyContent: 'flex-end', padding: 20, paddingTop: 60, overflow: 'hidden' },
  bannerImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.50)' },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  backText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  bannerEmoji: { fontSize: 40, marginBottom: 10 },
  bannerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', lineHeight: 28, marginBottom: 10 },
  bannerBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  bannerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  descText: { fontSize: 14, color: '#444', lineHeight: 23 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7, marginRight: 10, flexShrink: 0 },
  stepNum: { fontSize: 14, fontWeight: '700', marginRight: 8, width: 22 },
  listText: { flex: 1, fontSize: 13.5, color: '#444', lineHeight: 22 },
  websiteBtn: {
    marginHorizontal: 16, marginTop: 20,
    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
  },
  websiteBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});