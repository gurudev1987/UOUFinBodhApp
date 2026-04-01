import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: AmortizationRow[];
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [termType, setTermType] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!loanAmount || parseFloat(loanAmount) <= 0)
      newErrors.loanAmount = 'Enter a valid loan amount';
    if (!interestRate || parseFloat(interestRate) <= 0 || parseFloat(interestRate) > 100)
      newErrors.interestRate = 'Enter a valid interest rate (0–100)';
    if (!loanTerm || parseInt(loanTerm) <= 0)
      newErrors.loanTerm = 'Enter a valid loan term';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = useCallback(() => {
    if (!validate()) return;

    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const months =
      termType === 'years' ? parseInt(loanTerm) * 12 : parseInt(loanTerm);

    let monthlyPayment: number;

    if (monthlyRate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    // Amortization schedule
    const amortization: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      amortization.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    setResult({ monthlyPayment, totalPayment, totalInterest, amortization });
    setShowAmortization(false);
  }, [loanAmount, interestRate, loanTerm, termType]);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setResult(null);
    setShowAmortization(false);
    setErrors({});
  };

  const formatCurrency = (value: number): string => {
    return '₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const principalPercent =
    result ? (parseFloat(loanAmount) / result.totalPayment) * 100 : 0;
  const interestPercent = result ? 100 - principalPercent : 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Loan Calculator</Text>
          <Text style={styles.headerSubtitle}>Plan your finances smartly</Text>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>LOAN DETAILS</Text>

          {/* Loan Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Amount</Text>
            <View style={[styles.inputWrapper, errors.loanAmount ? styles.inputError : null]}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={(v) => { setLoanAmount(v); setErrors((e) => ({ ...e, loanAmount: '' })); }}
                placeholder="e.g. 500000"
                placeholderTextColor="#3A3A5A"
                keyboardType="numeric"
              />
            </View>
            {errors.loanAmount ? <Text style={styles.errorText}>{errors.loanAmount}</Text> : null}
          </View>

          {/* Interest Rate */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Interest Rate</Text>
            <View style={[styles.inputWrapper, errors.interestRate ? styles.inputError : null]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={interestRate}
                onChangeText={(v) => { setInterestRate(v); setErrors((e) => ({ ...e, interestRate: '' })); }}
                placeholder="e.g. 8.5"
                placeholderTextColor="#3A3A5A"
                keyboardType="decimal-pad"
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
            {errors.interestRate ? <Text style={styles.errorText}>{errors.interestRate}</Text> : null}
          </View>

          {/* Loan Term */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Term</Text>
            <View style={styles.termRow}>
              <View style={[styles.inputWrapper, styles.termInput, errors.loanTerm ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={loanTerm}
                  onChangeText={(v) => { setLoanTerm(v); setErrors((e) => ({ ...e, loanTerm: '' })); }}
                  placeholder="e.g. 20"
                  placeholderTextColor="#3A3A5A"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.termToggle}>
                <TouchableOpacity
                  style={[styles.toggleBtn, termType === 'years' && styles.toggleBtnActive]}
                  onPress={() => setTermType('years')}
                >
                  <Text style={[styles.toggleText, termType === 'years' && styles.toggleTextActive]}>
                    Years
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, termType === 'months' && styles.toggleBtnActive]}
                  onPress={() => setTermType('months')}
                >
                  <Text style={[styles.toggleText, termType === 'months' && styles.toggleTextActive]}>
                    Months
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.loanTerm ? <Text style={styles.errorText}>{errors.loanTerm}</Text> : null}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.calculateBtn} onPress={calculate} activeOpacity={0.85}>
              <Text style={styles.calculateBtnText}>CALCULATE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.85}>
              <Text style={styles.resetBtnText}>RESET</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {result && (
          <>
            {/* Monthly EMI Highlight */}
            <View style={styles.emiCard}>
              <Text style={styles.emiLabel}>Monthly EMI</Text>
              <Text style={styles.emiValue}>{formatCurrency(result.monthlyPayment)}</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.summaryCardBlue]}>
                <Text style={styles.summaryLabel}>Principal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(parseFloat(loanAmount))}</Text>
              </View>
              <View style={[styles.summaryCard, styles.summaryCardOrange]}>
                <Text style={styles.summaryLabel}>Total Interest</Text>
                <Text style={styles.summaryValue}>{formatCurrency(result.totalInterest)}</Text>
              </View>
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Payment</Text>
              <Text style={styles.totalValue}>{formatCurrency(result.totalPayment)}</Text>
            </View>

            {/* Visual Breakdown Bar */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>PAYMENT BREAKDOWN</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barSegment, styles.barPrincipal, { flex: principalPercent }]} />
                <View style={[styles.barSegment, styles.barInterest, { flex: interestPercent }]} />
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.barPrincipal]} />
                  <Text style={styles.legendText}>Principal {principalPercent.toFixed(1)}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.barInterest]} />
                  <Text style={styles.legendText}>Interest {interestPercent.toFixed(1)}%</Text>
                </View>
              </View>
            </View>

            {/* Amortization Toggle */}
            <TouchableOpacity
              style={styles.amortizationToggle}
              onPress={() => setShowAmortization(!showAmortization)}
              activeOpacity={0.8}
            >
              <Text style={styles.amortizationToggleText}>
                {showAmortization ? '▲  Hide' : '▼  Show'} Amortization Schedule
              </Text>
            </TouchableOpacity>

            {showAmortization && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>AMORTIZATION SCHEDULE</Text>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.6 }]}>Mo.</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>EMI</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>Principal</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>Interest</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>Balance</Text>
                </View>
                {result.amortization.map((row) => (
                  <View
                    key={row.month}
                    style={[styles.tableRow, row.month % 2 === 0 ? styles.tableRowEven : null]}
                  >
                    <Text style={[styles.tableCell, styles.tableCellText, { flex: 0.6 }]}>{row.month}</Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      {row.payment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText, styles.principalText]}>
                      {row.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText, styles.interestText]}>
                      {row.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      {row.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0A0A1A' },
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },

  // Header
  header: { marginBottom: 28 },
  headerAccent: {
    width: 48,
    height: 4,
    backgroundColor: '#00E5FF',
    borderRadius: 2,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: '#12122A',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E3F',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00E5FF',
    letterSpacing: 2,
    marginBottom: 20,
  },

  // Input
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D24',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E1E3F',
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: { borderColor: '#FF4D6D' },
  inputPrefix: { fontSize: 18, color: '#4B5563', marginRight: 8, fontWeight: '600' },
  inputSuffix: { fontSize: 16, color: '#4B5563', marginLeft: 8, fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '500',
    paddingVertical: 0,
  },
  errorText: { fontSize: 12, color: '#FF4D6D', marginTop: 5, marginLeft: 2 },

  // Term Row
  termRow: { flexDirection: 'row', gap: 12 },
  termInput: { flex: 1 },
  termToggle: {
    flexDirection: 'row',
    backgroundColor: '#0D0D24',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E1E3F',
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: '#00E5FF' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  toggleTextActive: { color: '#0A0A1A' },

  // Buttons
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  calculateBtn: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculateBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A1A',
    letterSpacing: 1.5,
  },
  resetBtn: {
    width: 80,
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 1 },

  // EMI Card
  emiCard: {
    backgroundColor: '#00E5FF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  emiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003340',
    letterSpacing: 2,
    marginBottom: 6,
  },
  emiValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0A0A1A',
    letterSpacing: -1,
  },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
  },
  summaryCardBlue: {
    backgroundColor: '#0D1F3C',
    borderColor: '#1E3A5F',
  },
  summaryCardOrange: {
    backgroundColor: '#2A1A0D',
    borderColor: '#4A2F0E',
  },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 1.5, marginBottom: 8 },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },

  // Total
  totalCard: {
    backgroundColor: '#12122A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E3F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },

  // Breakdown Bar
  barContainer: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barSegment: { height: 14 },
  barPrincipal: { backgroundColor: '#00E5FF' },
  barInterest: { backgroundColor: '#FF6B35' },
  legendRow: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },

  // Amortization Toggle
  amortizationToggle: {
    backgroundColor: '#12122A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E3F',
  },
  amortizationToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00E5FF',
    letterSpacing: 0.5,
  },

  // Table
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A35',
  },
  tableRowEven: { backgroundColor: '#0F0F28' },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E1E3F',
    marginBottom: 2,
  },
  tableCell: { flex: 1, textAlign: 'right' },
  tableHeaderText: { fontSize: 11, fontWeight: '700', color: '#00E5FF', letterSpacing: 0.5 },
  tableCellText: { fontSize: 11, color: '#9CA3AF' },
  principalText: { color: '#00E5FF' },
  interestText: { color: '#FF6B35' },
});

export default LoanCalculator;
