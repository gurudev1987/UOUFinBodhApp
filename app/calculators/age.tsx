import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: number;
  dayOfWeek: string;
}

function calcAge(dob: Date): AgeResult {
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) { years -= 1; months += 12; }

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((now.getTime() - dob.getTime()) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  const nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
  const nextBirthday = Math.ceil((nextBday.getTime() - now.getTime()) / msPerDay);

  const days_of_week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayOfWeek = days_of_week[dob.getDay()];

  return { years, months, days, totalDays, totalWeeks, totalMonths, nextBirthday, dayOfWeek };
}

export default function AgeCalculator() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const d = parseInt(day), m = parseInt(month) - 1, y = parseInt(year);
    if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) {
      setError('Please enter a valid date'); return;
    }
    const dob = new Date(y, m, d);
    if (dob > new Date()) { setError('Date of birth cannot be in the future'); return; }
    if (y < 1900) { setError('Year must be after 1900'); return; }
    setResult(calcAge(dob));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Date of Birth</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>DD</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="15"
                placeholderTextColor="#374151"
                value={day}
                onChangeText={setDay}
              />
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>MM</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="06"
                placeholderTextColor="#374151"
                value={month}
                onChangeText={setMonth}
              />
            </View>
            <View style={[styles.dateInput, { flex: 1.6 }]}>
              <Text style={styles.inputLabel}>YYYY</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={4}
                placeholder="1995"
                placeholderTextColor="#374151"
                value={year}
                onChangeText={setYear}
              />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#f72585" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Ionicons name="time-outline" size={18} color="#0a0e1a" />
            <Text style={styles.calcBtnText}>Calculate Age</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <>
            {/* Main Result */}
            <View style={styles.mainResult}>
              <Text style={styles.resultHeading}>You are</Text>
              <View style={styles.ageDisplay}>
                <View style={styles.ageUnit}>
                  <Text style={styles.ageNumber}>{result.years}</Text>
                  <Text style={styles.ageLabel}>Years</Text>
                </View>
                <Text style={styles.ageSep}>:</Text>
                <View style={styles.ageUnit}>
                  <Text style={styles.ageNumber}>{result.months}</Text>
                  <Text style={styles.ageLabel}>Months</Text>
                </View>
                <Text style={styles.ageSep}>:</Text>
                <View style={styles.ageUnit}>
                  <Text style={styles.ageNumber}>{result.days}</Text>
                  <Text style={styles.ageLabel}>Days</Text>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <Text style={styles.sectionLabel}>DETAILED BREAKDOWN</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Total Days', value: result.totalDays.toLocaleString(), icon: 'calendar-outline', color: '#f77f00' },
                { label: 'Total Weeks', value: result.totalWeeks.toLocaleString(), icon: 'grid-outline', color: '#a855f7' },
                { label: 'Total Months', value: result.totalMonths.toLocaleString(), icon: 'today-outline', color: '#06d6a0' },
                { label: 'Next Birthday', value: `${result.nextBirthday} days`, icon: 'gift-outline', color: '#f72585' },
              ].map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                    <Ionicons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.dobNote}>
              <Ionicons name="information-circle-outline" size={16} color="#00d4ff" />
              <Text style={styles.dobNoteText}>
                You were born on a <Text style={{ color: '#00d4ff', fontWeight: '700' }}>{result.dayOfWeek}</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={() => { setDay(''); setMonth(''); setYear(''); setResult(null); }}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  dateRow: { flexDirection: 'row', gap: 10 },
  dateInput: { flex: 1, gap: 6 },
  inputLabel: { fontSize: 11, color: '#6b7280', fontWeight: '700', letterSpacing: 1 },
  input: {
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#1a2035',
    textAlign: 'center',
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f7258512',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f7258530',
  },
  errorText: { fontSize: 13, color: '#f72585', fontWeight: '600' },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f77f00',
    borderRadius: 14,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 16, fontWeight: '800', color: '#0a0e1a' },
  mainResult: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  resultHeading: { fontSize: 14, color: '#4b5563', fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  ageDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ageUnit: { alignItems: 'center' },
  ageNumber: { fontSize: 52, fontWeight: '300', color: '#f77f00', letterSpacing: -2 },
  ageLabel: { fontSize: 12, color: '#4b5563', fontWeight: '700', letterSpacing: 0.5 },
  ageSep: { fontSize: 36, color: '#1a2035', fontWeight: '300', marginBottom: 12 },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#4b5563', marginTop: 3, fontWeight: '600' },
  dobNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00d4ff10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00d4ff20',
  },
  dobNoteText: { fontSize: 14, color: '#9ca3af' },
  resetBtn: {
    alignItems: 'center',
    backgroundColor: '#1a2035',
    borderRadius: 14,
    paddingVertical: 14,
  },
  resetText: { fontSize: 14, color: '#6b7280', fontWeight: '700' },
});
