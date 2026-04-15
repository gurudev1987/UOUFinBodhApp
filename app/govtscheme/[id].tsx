import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SCHEMES } from './index';

export default function SchemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const scheme = SCHEMES.find((s) => s.id === id);

  if (!scheme) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
          <Text style={{ color: '#1565C0', fontSize: 16 }}>‹ Go Back</Text>
        </TouchableOpacity>
        <Text style={{ padding: 24, color: '#555', fontSize: 16 }}>Scheme not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header Banner with Image */}
        <View style={[styles.banner, { backgroundColor: scheme.categoryColor }]}>
          {scheme.image && (
            <Image
              source={{ uri: scheme.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.bannerOverlay} />

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.bannerEmoji}>{scheme.emoji}</Text>
          <Text style={styles.bannerTitle}>{scheme.name}</Text>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>{scheme.category}</Text>
          </View>
        </View>

        {/* About */}
        <Section title="📋 About This Scheme">
          <Text style={styles.descText}>{scheme.fullDesc}</Text>
        </Section>

        {/* Key Benefits */}
        <Section title="✅ Key Benefits">
          {scheme.highlights.map((h, i) => (
            <BulletRow key={i} color={scheme.categoryColor} text={h} />
          ))}
        </Section>

        {/* Eligibility */}
        <Section title="🎯 Who Can Apply">
          {scheme.eligibility.map((e, i) => (
            <BulletRow key={i} color={scheme.categoryColor} text={e} />
          ))}
        </Section>

        {/* How to Apply */}
        <Section title="📝 How to Apply">
          {scheme.howToApply.map((step, i) => (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.stepNum, { color: scheme.categoryColor }]}>{i + 1}.</Text>
              <Text style={styles.listText}>{step}</Text>
            </View>
          ))}
        </Section>

        {/* Website Button */}
        {scheme.website && (
          <TouchableOpacity
            style={[styles.websiteBtn, { backgroundColor: scheme.categoryColor }]}
            onPress={() => Linking.openURL(scheme.website!)}
            activeOpacity={0.85}
          >
            <Text style={styles.websiteBtnText}>🌐 Visit Official Website</Text>
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

  banner: {
    minHeight: 220,
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
    overflow: 'hidden',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  backText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  bannerEmoji: { fontSize: 40, marginBottom: 10 },
  bannerTitle: {
    fontSize: 21, fontWeight: '800', color: '#fff',
    lineHeight: 28, marginBottom: 10,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  bannerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
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