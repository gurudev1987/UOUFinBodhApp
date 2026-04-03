import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type Unit = 'metric' | 'imperial';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  advice: string;
}

function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) return { bmi, category: 'Underweight', color: '#60a5fa', advice: 'Consider a nutritious diet to reach a healthy weight.' };
  if (bmi < 25)   return { bmi, category: 'Normal Weight', color: '#06d6a0', advice: 'Great job! Maintain your healthy lifestyle.' };
  if (bmi < 30)   return { bmi, category: 'Overweight', color: '#f77f00', advice: 'Regular exercise and balanced diet recommended.' };
  return { bmi, category: 'Obese', color: '#f72585', advice: 'Consult a healthcare provider for guidance.' };
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    let h = 0, w = parseFloat(weight);
    if (unit === 'metric') {
      h = parseFloat(height) / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      h = (ft * 12 + inch) * 0.0254;
      w = w * 0.453592;
    }
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = w / (h * h);
    setResult(getBMIResult(parseFloat(bmi.toFixed(1))));
  };

  const reset = () => {
    setHeight(''); setWeight(''); setHeightFt(''); setHeightIn(''); setResult(null);
  };

  const getBarWidth = (bmi: number) => {
    const pct = Math.min(Math.max((bmi / 40) * 100, 0), 100);
    return `${pct}%`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          {(['metric', 'imperial'] as Unit[]).map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
              onPress={() => { setUnit(u); reset(); }}
            >
              <Text style={[styles.unitBtnText, unit === u && styles.unitBtnTextActive]}>
                {u === 'metric' ? 'Metric (cm/kg)' : 'Imperial (ft/lbs)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <View style={styles.card}>
          {unit === 'metric' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 170"
                placeholderTextColor="#374151"
                value={height}
                onChangeText={setHeight}
              />
            </View>
          ) : (
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Feet</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor="#374151"
                  value={heightFt}
                  onChangeText={setHeightFt}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Inches</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="7"
                  placeholderTextColor="#374151"
                  value={heightIn}
                  onChangeText={setHeightIn}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
              placeholderTextColor="#374151"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Ionicons name="calculator-outline" size={18} color="#0a0e1a" />
            <Text style={styles.calcBtnText}>Calculate BMI</Text>
          </TouchableOpacity>
        </View>

        {/* Result */}
        {result && (
          <View style={[styles.resultCard, { borderColor: result.color + '50' }]}>
            <Text style={styles.resultLabel}>Your BMI</Text>
            <Text style={[styles.resultBMI, { color: result.color }]}>{result.bmi}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: result.color + '20' }]}>
              <Text style={[styles.categoryText, { color: result.color }]}>{result.category}</Text>
            </View>

            {/* Bar */}
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: getBarWidth(result.bmi) as any, backgroundColor: result.color }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={styles.barLabel}>Underweight</Text>
              <Text style={styles.barLabel}>Normal</Text>
              <Text style={styles.barLabel}>Obese</Text>
            </View>

            <Text style={styles.advice}>{result.advice}</Text>

            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reference Table */}
        <Text style={styles.sectionLabel}>BMI REFERENCE</Text>
        {[
          { range: '< 18.5', label: 'Underweight', color: '#60a5fa' },
          { range: '18.5 – 24.9', label: 'Normal Weight', color: '#06d6a0' },
          { range: '25 – 29.9', label: 'Overweight', color: '#f77f00' },
          { range: '≥ 30', label: 'Obese', color: '#f72585' },
        ].map((r) => (
          <View key={r.label} style={styles.refRow}>
            <View style={[styles.refDot, { backgroundColor: r.color }]} />
            <Text style={styles.refRange}>{r.range}</Text>
            <Text style={[styles.refLabel, { color: r.color }]}>{r.label}</Text>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  unitBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  unitBtnActive: { backgroundColor: '#00d4ff' },
  unitBtnText: { fontSize: 13, fontWeight: '700', color: '#4b5563' },
  unitBtnTextActive: { color: '#0a0e1a' },
  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00d4ff',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  calcBtnText: { fontSize: 16, fontWeight: '800', color: '#0a0e1a' },
  resultCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  resultLabel: { fontSize: 13, color: '#4b5563', fontWeight: '700', letterSpacing: 1 },
  resultBMI: { fontSize: 72, fontWeight: '300', letterSpacing: -3, marginTop: 4 },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  categoryText: { fontSize: 14, fontWeight: '800' },
  barTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#1a2035',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: { height: '100%', borderRadius: 4 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  barLabel: { fontSize: 10, color: '#374151' },
  advice: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  resetBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#1a2035',
    borderRadius: 10,
  },
  resetText: { fontSize: 14, color: '#6b7280', fontWeight: '700' },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 12,
  },
  refDot: { width: 10, height: 10, borderRadius: 5 },
  refRange: { flex: 1, fontSize: 14, color: '#9ca3af', fontWeight: '600' },
  refLabel: { fontSize: 13, fontWeight: '700' },
});
