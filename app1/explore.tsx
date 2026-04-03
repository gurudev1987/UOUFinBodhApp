import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { label: 'All', icon: 'grid-outline' },
  { label: 'Design', icon: 'color-palette-outline' },
  { label: 'Dev', icon: 'code-slash-outline' },
  { label: 'Music', icon: 'musical-notes-outline' },
];

const items = [
  { title: 'UI Components', subtitle: 'React Native library', tag: 'Design' },
  { title: 'State Management', subtitle: 'Zustand & Redux', tag: 'Dev' },
  { title: 'Animation', subtitle: 'Reanimated 3 guide', tag: 'Dev' },
  { title: 'Color Palettes', subtitle: '50 curated themes', tag: 'Design' },
  { title: 'Sound Design', subtitle: 'Expo AV tutorial', tag: 'Music' },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = items.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || item.tag === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[styles.catBtn, activeCategory === cat.label && styles.catActive]}
            onPress={() => setActiveCategory(cat.label)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.label ? '#fff' : '#666'}
            />
            <Text style={[styles.catText, activeCategory === cat.label && styles.catActiveText]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>{filtered.length} RESULTS</Text>

      {filtered.map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.resultCard} activeOpacity={0.75}>
          <View style={styles.resultIcon}>
            <Ionicons name="document-text-outline" size={20} color="#4361ee" />
          </View>
          <View style={styles.resultText}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20, paddingBottom: 40 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
    marginBottom: 16,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  categories: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  catActive: { backgroundColor: '#4361ee', borderColor: '#4361ee' },
  catText: { fontSize: 12, color: '#666', fontWeight: '600' },
  catActiveText: { color: '#fff' },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#4361ee22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultText: { flex: 1 },
  resultTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  resultSubtitle: { color: '#666', fontSize: 12, marginTop: 2 },
  tag: {
    backgroundColor: '#4361ee22',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: { fontSize: 10, color: '#4361ee', fontWeight: '700' },
});
