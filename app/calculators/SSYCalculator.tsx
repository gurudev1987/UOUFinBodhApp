import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SSY_RATE = 8.2; // Current rate FY 2024-25
const MIN_DEPOSIT = 250;
const MAX_DEPOSIT = 150000;
const ACCOUNT_TENURE = 21; // years
const DEPOSIT_YEARS = 15;  // deposit only for 15 years

function calcSSY(annualDeposit: number, girlAge: number) {
  const results: { year: number; age: number; deposit: number; interest: number; balance: number }[] = [];
  let balance = 0;
  let totalDeposit = 0;
  let totalInterest = 0;
  const rate = SSY_RATE / 100;
  const maturityYear = 21 - girlAge; // years from now to maturity

  for (let yr = 1; yr <= maturityYear; yr++) {
    const currentAge = girlAge + yr;
    const deposit = yr <= DEPOSIT_YEARS ? annualDeposit : 0;
    const interest = (balance + deposit) * rate;
    balance = balance + deposit + interest;
    totalDeposit += deposit;
    totalInterest += interest;
    results.push({ year: yr, age: currentAge, deposit, interest: Math.round(interest), balance: Math.round(balance) });
  }

  return {
    maturityAmount: Math.round(balance),
    totalDeposit: Math.round(totalDeposit),
    totalInterest: Math.round(totalInterest),
    results,
  };
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function fmtL(n: number) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return fmt(n);
}

export default function SSYCalculator() {
  const [deposit, setDeposit] = useState('');
  const [girlAge, setGirlAge] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const dep = parseFloat(deposit.replace(/,/g, '')) || 0;
  const age = parseInt(girlAge) || 0;

  const isValidAge = age >= 0 && age <= 10;
  const isValidDep = dep >= MIN_DEPOSIT && dep <= MAX_DEPOSIT;

  const result = (calculated && isValidAge && isValidDep) ? calcSSY(dep, age) : null;

  const handleCalculate = () => {
    if (!isValidAge || !isValidDep) return;
    setCalculated(true);
    setShowTable(false);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const maturityAge = age + (21 - age);
  const withdrawalAge = age + (18 - age);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient colors={['#1a0a2e', '#0d0a1e']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Ionicons name="heart" size={24} color="#a855f7" />
          </View>
          <View style={styles.govtBadge}>
            <Ionicons name="shield-checkmark" size={11} color="#06d6a0" />
            <Text style={styles.govtBadgeText}> Govt. of India Scheme</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Sukanya Samriddhi</Text>
        <Text style={styles.headerTitleAccent}>Yojana Calculator</Text>
        <Text style={styles.headerSub}>Beti ke ujjwal bhavishya ke liye · {SSY_RATE}% p.a. (FY 2024-25)</Text>

        {/* Key Info Pills */}
        <View style={styles.pillRow}>
          <View style={styles.pill}><Text style={styles.pillText}>Min ₹250/yr</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>Max ₹1.5L/yr</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>21 yr tenure</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>80C benefit</Text></View>
        </View>
      </LinearGradient>

      {/* Input Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Details</Text>

        <Text style={styles.label}>Beti ki Umar (0–10 saal)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person" size={16} color="#4b6080" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={girlAge}
            onChangeText={setGirlAge}
            maxLength={2}
          />
          <Text style={styles.inputSuffix}>years</Text>
        </View>
        {girlAge !== '' && !isValidAge && (
          <Text style={styles.errorText}>⚠ Umar 0 se 10 saal ke beech honi chahiye</Text>
        )}

        <Text style={styles.label}>Saalaana Jamaa Raashi (Annual Deposit)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50000"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={deposit}
            onChangeText={setDeposit}
          />
        </View>
        {deposit !== '' && !isValidDep && (
          <Text style={styles.errorText}>⚠ ₹250 se ₹1,50,000 ke beech hona chahiye</Text>
        )}

        {/* Quick amount buttons */}
        <View style={styles.quickAmtRow}>
          {[12000, 50000, 100000, 150000].map(amt => (
            <TouchableOpacity
              key={amt}
              style={[styles.quickAmt, deposit === String(amt) && styles.quickAmtActive]}
              onPress={() => setDeposit(String(amt))}
            >
              <Text style={[styles.quickAmtText, deposit === String(amt) && styles.quickAmtTextActive]}>
                {amt >= 100000 ? `₹${amt / 100000}L` : `₹${amt / 1000}k`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.calcBtn, (!isValidAge || !isValidDep) && { opacity: 0.5 }]}
          onPress={handleCalculate}
          activeOpacity={0.85}
          disabled={!isValidAge || !isValidDep}
        >
          <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.calcBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="calculator" size={16} color="#fff" />
            <Text style={styles.calcBtnText}>Calculate Maturity</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {result && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Maturity Amount Hero */}
          <LinearGradient colors={['#1a0a2e', '#12082a']} style={styles.maturityCard}>
            <View style={styles.maturityTop}>
              <Ionicons name="trophy" size={20} color="#a855f7" />
              <Text style={styles.maturityLabel}>  Maturity Amount</Text>
            </View>
            <Text style={styles.maturityAmount}>{fmtL(result.maturityAmount)}</Text>
            <Text style={styles.maturitySub}>Jab beti {maturityAge} saal ki hogi</Text>

            {/* Progress bar: deposit vs interest */}
            <View style={styles.progressWrap}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round((result.totalDeposit / result.maturityAmount) * 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.progressLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#a855f7' }]} />
                  <Text style={styles.legendText}>Deposit {Math.round((result.totalDeposit / result.maturityAmount) * 100)}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                  <Text style={styles.legendText}>Interest {Math.round((result.totalInterest / result.maturityAmount) * 100)}%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* 3 Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="wallet-outline" size={18} color="#a855f7" />
              <Text style={styles.summaryVal}>{fmtL(result.totalDeposit)}</Text>
              <Text style={styles.summaryLabel}>Total Deposit</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="trending-up-outline" size={18} color="#06d6a0" />
              <Text style={styles.summaryVal}>{fmtL(result.totalInterest)}</Text>
              <Text style={styles.summaryLabel}>Total Interest</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="time-outline" size={18} color="#f77f00" />
              <Text style={styles.summaryVal}>{21 - age} yrs</Text>
              <Text style={styles.summaryLabel}>Tenure</Text>
            </View>
          </View>

          {/* Key Milestones */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Key Milestones</Text>

            <View style={styles.milestone}>
              <View style={[styles.milestoneDot, { backgroundColor: '#a855f7' }]} />
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>Account Khulna</Text>
                <Text style={styles.milestoneSub}>Aaj se deposit shuru · {fmt(dep)} per year</Text>
              </View>
              <Text style={styles.milestoneAge}>Age {age}</Text>
            </View>

            <View style={styles.milestoneLine} />

            <View style={styles.milestone}>
              <View style={[styles.milestoneDot, { backgroundColor: '#f77f00' }]} />
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>Deposit Band</Text>
                <Text style={styles.milestoneSub}>Sirf 15 saal deposit, baaki interest milta rahe</Text>
              </View>
              <Text style={styles.milestoneAge}>Age {age + 15}</Text>
            </View>

            <View style={styles.milestoneLine} />

            <View style={styles.milestone}>
              <View style={[styles.milestoneDot, { backgroundColor: '#00d4ff' }]} />
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>50% Withdrawal</Text>
                <Text style={styles.milestoneSub}>Higher education ke liye nikaali ja sakti hai</Text>
              </View>
              <Text style={styles.milestoneAge}>Age 18</Text>
            </View>

            <View style={styles.milestoneLine} />

            <View style={styles.milestone}>
              <View style={[styles.milestoneDot, { backgroundColor: '#06d6a0' }]} />
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>Poora Paisa Milega 🎉</Text>
                <Text style={styles.milestoneSub}>Maturity · {fmtL(result.maturityAmount)}</Text>
              </View>
              <Text style={styles.milestoneAge}>Age 21</Text>
            </View>
          </View>

          {/* Tax Benefit */}
          <LinearGradient colors={['#06d6a015', '#06d6a005']} style={styles.taxCard}>
            <Ionicons name="shield-checkmark" size={20} color="#06d6a0" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.taxTitle}>Triple Tax Benefit (EEE)</Text>
              <Text style={styles.taxSub}>Deposit, Interest aur Maturity — teeno par koi tax nahi</Text>
              <Text style={styles.taxSub}>80C ke under ₹1.5L tak deduction milega</Text>
            </View>
          </LinearGradient>

          {/* Year-wise Table Toggle */}
          <TouchableOpacity
            style={styles.tableToggle}
            onPress={() => setShowTable(!showTable)}
            activeOpacity={0.8}
          >
            <Text style={styles.tableToggleText}>
              {showTable ? 'Year-wise Table Chhupao' : 'Year-wise Table Dekho'}
            </Text>
            <Ionicons name={showTable ? 'chevron-up' : 'chevron-down'} size={16} color="#a855f7" />
          </TouchableOpacity>

          {showTable && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Year-wise Growth</Text>
              {/* Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.6 }]}>Yr</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Deposit</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Interest</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Balance</Text>
              </View>
              {result.results.map((r, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, { flex: 0.6, color: '#4b6080' }]}>{r.year}</Text>
                  <Text style={styles.tableCell}>{r.deposit > 0 ? fmtL(r.deposit) : '—'}</Text>
                  <Text style={[styles.tableCell, { color: '#06d6a0' }]}>{fmtL(r.interest)}</Text>
                  <Text style={[styles.tableCell, { color: '#a855f7', fontWeight: '700' }]}>{fmtL(r.balance)}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      )}

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080c14' },
  content: { paddingBottom: 48 },

  /* Header */
  header: {
    padding: 24,
    paddingTop: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#a855f722',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#a855f715',
    borderWidth: 1,
    borderColor: '#a855f733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  govtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06d6a015',
    borderWidth: 1,
    borderColor: '#06d6a033',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  govtBadgeText: { fontSize: 11, color: '#06d6a0', fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#e2d4ff', letterSpacing: 0.3 },
  headerTitleAccent: { fontSize: 26, fontWeight: '900', color: '#a855f7', letterSpacing: 0.3, marginBottom: 8 },
  headerSub: { fontSize: 12, color: '#4b3070', marginBottom: 16 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    backgroundColor: '#a855f715',
    borderWidth: 1,
    borderColor: '#a855f730',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: { fontSize: 11, color: '#c084fc', fontWeight: '600' },

  /* Card */
  card: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1a2535',
  },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#7b5ea7', marginBottom: 16, letterSpacing: 0.5, textTransform: 'uppercase' },

  label: { fontSize: 12, color: '#4b6080', marginBottom: 6, marginTop: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080c14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2535',
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  rupee: { fontSize: 16, color: '#4b6080', marginRight: 6 },
  input: { flex: 1, height: 46, fontSize: 16, color: '#e2f4ff' },
  inputSuffix: { fontSize: 13, color: '#4b6080' },
  errorText: { fontSize: 11, color: '#f72585', marginBottom: 8, marginLeft: 4 },

  quickAmtRow: { flexDirection: 'row', gap: 8, marginBottom: 16, marginTop: 10 },
  quickAmt: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a2535',
    alignItems: 'center',
    backgroundColor: '#080c14',
  },
  quickAmtActive: { borderColor: '#a855f7', backgroundColor: '#a855f715' },
  quickAmtText: { fontSize: 12, color: '#4b6080', fontWeight: '700' },
  quickAmtTextActive: { color: '#a855f7' },

  calcBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  calcBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  /* Maturity Card */
  maturityCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#a855f733',
  },
  maturityTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  maturityLabel: { fontSize: 13, color: '#7b5ea7', fontWeight: '700' },
  maturityAmount: { fontSize: 36, fontWeight: '900', color: '#e2d4ff', marginBottom: 4 },
  maturitySub: { fontSize: 12, color: '#4b3070', marginBottom: 16 },
  progressWrap: { gap: 10 },
  progressBg: { height: 8, backgroundColor: '#06d6a044', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#a855f7', borderRadius: 4 },
  progressLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#4b6080' },

  /* Summary */
  summaryRow: { flexDirection: 'row', margin: 16, marginBottom: 0, gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2535',
    gap: 6,
  },
  summaryVal: { fontSize: 15, fontWeight: '900', color: '#e2f4ff' },
  summaryLabel: { fontSize: 10, color: '#4b6080', textAlign: 'center' },

  /* Milestones */
  milestone: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  milestoneDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  milestoneContent: { flex: 1 },
  milestoneTitle: { fontSize: 13, fontWeight: '700', color: '#d4e4f5' },
  milestoneSub: { fontSize: 11, color: '#4b6080', marginTop: 2 },
  milestoneAge: { fontSize: 12, fontWeight: '700', color: '#4b6080' },
  milestoneLine: { width: 1, height: 20, backgroundColor: '#1a2535', marginLeft: 5, marginVertical: 6 },

  /* Tax Card */
  taxCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06d6a022',
  },
  taxTitle: { fontSize: 13, fontWeight: '800', color: '#06d6a0', marginBottom: 4 },
  taxSub: { fontSize: 11, color: '#4b6080', lineHeight: 17 },

  /* Table */
  tableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#a855f733',
    backgroundColor: '#a855f710',
  },
  tableToggleText: { fontSize: 13, fontWeight: '700', color: '#a855f7' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0f1925' },
  tableRowAlt: { backgroundColor: '#0a0e18' },
  tableHeader: { borderBottomWidth: 2, borderBottomColor: '#1a2535' },
  tableHeaderText: { fontWeight: '800', color: '#4b6080', fontSize: 11 },
  tableCell: { flex: 1, fontSize: 11, color: '#c8d8e8', textAlign: 'right' },
});
