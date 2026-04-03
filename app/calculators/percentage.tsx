import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type Mode = 'percent_of' | 'what_percent' | 'increase' | 'discount';

const modes: { key: Mode; label: string; icon: string; color: string; desc: string }[] = [
  { key: 'percent_of', label: '% of Number', icon: 'at-outline', color: '#a855f7', desc: 'What is X% of Y?' },
  { key: 'what_percent', label: 'What % is', icon: 'help-outline', color: '#00d4ff', desc: 'X is what % of Y?' },
  { key: 'increase', label: '% Change', icon: 'trending-up-outline', color: '#06d6a0', desc: 'Increase/decrease by %' },
  { key: 'discount', label: 'Discount', icon: 'pricetag-outline', color: '#f72585', desc: 'Price after discount' },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('percent_of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const na = parseFloat(a), nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) { setResult('Invalid input'); return; }
    let res = 0;
    if (mode === 'percent_of') res = (na / 100) * nb;
    if (mode === 'what_percent') res = (na / nb) * 100;
    if (mode === 'increase') res = na + (na * nb) / 100;
    if (mode === 'discount') res = na - (na * nb) / 100;
    setResult(parseFloat(res.toFixed(4)).toString());
  };

  const activeMode = modes.find((m) => m.key === mode)!;

  const getLabels = (): [string, string] => {
    if (mode === 'percent_of') return ['Percentage (%)', 'Number'];
    if (mode === 'what_percent') return ['Value (X)', 'Total (Y)'];
    if (mode === 'increase') return ['Original Value', 'Change (%)'];
    return ['Original Price', 'Discount (%)'];
  };

  const getResultLabel = (): string => {
    if (mode === 'percent_of') return `${a}% of ${b} =`;
    if (mode === 'what_percent') return `${a} is __% of ${b}`;
    if (mode === 'increase') return `${a} changed by ${b}% =`;
    return `After ${b}% discount on ${a} =`;
  };

  const [labelA, labelB] = getLabels();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mode selector */}
      <View style={styles.modeGrid}>
        {modes.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.modeCard, mode === m.key && { borderColor: m.color, backgroundColor: m.color + '15' }]}
            onPress={() => { setMode(m.key); setA(''); setB(''); setResult(null); }}
          >
            <Ionicons name={m.icon as any} size={20} color={mode === m.key ? m.color : '#374151'} />
            <Text style={[styles.modeLabel, mode === m.key && { color: m.color }]}>{m.label}</Text>
            <Text style={styles.modeDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{labelA}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#374151"
            value={a}
            onChangeText={(v) => { setA(v); setResult(null); }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{labelB}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#374151"
            value={b}
            onChangeText={(v) => { setB(v); setResult(null); }}
          />
        </View>
        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: activeMode.color }]}
          onPress={calculate}
        >
          <Text style={styles.calcBtnText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {result !== null && (
        <View style={[styles.resultBox, { borderColor: activeMode.color + '40' }]}>
          <Text style={styles.resultLabel}>{getResultLabel()}</Text>
          <Text style={[styles.resultValue, { color: activeMode.color }]}>{result}</Text>
          {mode === 'discount' && (
            <Text style={styles.resultSub}>
              You save: {parseFloat((parseFloat(a) - parseFloat(result)).toFixed(4))}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  modeCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 6,
  },
  modeLabel: { fontSize: 13, fontWeight: '800', color: '#6b7280' },
  modeDesc: { fontSize: 11, color: '#374151' },
  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  calcBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  calcBtnText: { fontSize: 16, fontWeight: '800', color: '#0a0e1a' },
  resultBox: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
  },
  resultLabel: { fontSize: 13, color: '#4b5563', fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  resultValue: { fontSize: 56, fontWeight: '300', letterSpacing: -2 },
  resultSub: { fontSize: 14, color: '#6b7280', marginTop: 8 },
});
