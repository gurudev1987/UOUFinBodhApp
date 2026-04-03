import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Static exchange rates relative to USD (approximate)
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 149.5,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.89,
  CNY: 7.24,
  AED: 3.67,
};

const FLAGS: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳',
  JPY: '🇯🇵', AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭',
  CNY: '🇨🇳', AED: '🇦🇪',
};

const NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound',
  INR: 'Indian Rupee', JPY: 'Japanese Yen', AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  AED: 'UAE Dirham',
};

const currencies = Object.keys(RATES);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const convert = (val: string, fromCur: string, toCur: string): string => {
    const n = parseFloat(val);
    if (isNaN(n)) return '0';
    const inUSD = n / RATES[fromCur];
    const result = inUSD * RATES[toCur];
    return parseFloat(result.toFixed(4)).toLocaleString();
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const result = convert(amount, from, to);
  const rate = convert('1', from, to);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Main Converter */}
      <View style={styles.converterCard}>
        {/* From */}
        <View style={styles.currencyBlock}>
          <Text style={styles.blockLabel}>FROM</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
          >
            <Text style={styles.flag}>{FLAGS[from]}</Text>
            <View>
              <Text style={styles.currencyCode}>{from}</Text>
              <Text style={styles.currencyName}>{NAMES[from]}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#4b5563" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {showFromPicker && (
            <View style={styles.picker}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {currencies.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pickerItem, from === c && styles.pickerItemActive]}
                    onPress={() => { setFrom(c); setShowFromPicker(false); }}
                  >
                    <Text style={styles.pickerFlag}>{FLAGS[c]}</Text>
                    <Text style={styles.pickerCode}>{c}</Text>
                    <Text style={styles.pickerName}>{NAMES[c]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="#374151"
          />
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapBtn} onPress={swap}>
          <Ionicons name="swap-vertical" size={22} color="#06d6a0" />
        </TouchableOpacity>

        {/* To */}
        <View style={styles.currencyBlock}>
          <Text style={styles.blockLabel}>TO</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
          >
            <Text style={styles.flag}>{FLAGS[to]}</Text>
            <View>
              <Text style={styles.currencyCode}>{to}</Text>
              <Text style={styles.currencyName}>{NAMES[to]}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#4b5563" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {showToPicker && (
            <View style={styles.picker}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {currencies.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pickerItem, to === c && styles.pickerItemActive]}
                    onPress={() => { setTo(c); setShowToPicker(false); }}
                  >
                    <Text style={styles.pickerFlag}>{FLAGS[c]}</Text>
                    <Text style={styles.pickerCode}>{c}</Text>
                    <Text style={styles.pickerName}>{NAMES[c]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.resultDisplay}>
            <Text style={styles.resultValue}>{result}</Text>
          </View>
        </View>
      </View>

      {/* Rate Info */}
      <View style={styles.rateCard}>
        <Ionicons name="information-circle-outline" size={16} color="#06d6a0" />
        <Text style={styles.rateText}>
          1 {from} = <Text style={{ color: '#06d6a0', fontWeight: '700' }}>{rate} {to}</Text>
          {'  ·  '}
          <Text style={{ color: '#374151' }}>Static rates (approx.)</Text>
        </Text>
      </View>

      {/* Quick conversions */}
      <Text style={styles.sectionLabel}>QUICK CONVERT ({from} → {to})</Text>
      <View style={styles.quickGrid}>
        {[1, 5, 10, 50, 100, 500].map((v) => (
          <TouchableOpacity
            key={v}
            style={styles.quickCard}
            onPress={() => setAmount(v.toString())}
          >
            <Text style={styles.quickFrom}>{v} {from}</Text>
            <Text style={styles.quickTo}>{convert(v.toString(), from, to)} {to}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  converterCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 4,
  },
  currencyBlock: { gap: 10 },
  blockLabel: { fontSize: 11, color: '#374151', fontWeight: '800', letterSpacing: 1.5 },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131929',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 12,
  },
  flag: { fontSize: 26 },
  currencyCode: { fontSize: 16, fontWeight: '800', color: '#f3f4f6' },
  currencyName: { fontSize: 11, color: '#4b5563' },
  picker: {
    backgroundColor: '#131929',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2035',
  },
  pickerItemActive: { backgroundColor: '#06d6a015' },
  pickerFlag: { fontSize: 20 },
  pickerCode: { fontSize: 14, fontWeight: '800', color: '#f3f4f6', width: 44 },
  pickerName: { fontSize: 12, color: '#4b5563', flex: 1 },
  amountInput: {
    backgroundColor: '#131929',
    borderRadius: 14,
    padding: 16,
    fontSize: 28,
    color: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#1a2035',
    fontWeight: '300',
  },
  swapBtn: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#06d6a015',
    borderWidth: 1,
    borderColor: '#06d6a030',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  resultDisplay: {
    backgroundColor: '#06d6a010',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#06d6a020',
  },
  resultValue: { fontSize: 28, color: '#06d6a0', fontWeight: '300' },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  rateText: { fontSize: 13, color: '#6b7280', flex: 1 },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  quickFrom: { fontSize: 13, color: '#4b5563', fontWeight: '600' },
  quickTo: { fontSize: 15, color: '#f3f4f6', fontWeight: '700', marginTop: 4 },
});
