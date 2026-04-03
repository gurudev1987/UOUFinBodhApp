import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Line,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Rect,
  G,
} from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_WIDTH = SCREEN_WIDTH - 64; // padding 20 each side + card padding 12 each
const GRAPH_HEIGHT = 200;
const PAD_LEFT = 52;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 36;
const PLOT_W = GRAPH_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_H = GRAPH_HEIGHT - PAD_TOP - PAD_BOTTOM;

// ─── Types ────────────────────────────────────────────────────────────────────

type StepUpMode = 'percent' | 'amount';

interface YearData {
  year: number;
  age?: number;
  monthlyAtYear: number;
  invested: number;
  returns: number;
  totalValue: number;
}

interface CalcResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  absoluteReturn: number;
  cagr: number;
  wealthRatio: number;
  finalMonthly: number;
  yearlyData: YearData[];
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calcStepUpSIP(
  initialMonthly: number,
  annualReturn: number,
  years: number,
  stepUpMode: StepUpMode,
  stepUpValue: number,
  currentAge?: number
): CalcResult {
  const monthlyRate = annualReturn / 12 / 100;
  let totalInvested = 0;
  let totalValue = 0;
  let currentMonthly = initialMonthly;
  const yearlyData: YearData[] = [];

  for (let y = 1; y <= years; y++) {
    // Apply step-up at start of each year (except first)
    if (y > 1) {
      if (stepUpMode === 'percent') currentMonthly *= 1 + stepUpValue / 100;
      else currentMonthly += stepUpValue;
    }

    const monthlyAtYear = parseFloat(currentMonthly.toFixed(2));

    for (let m = 0; m < 12; m++) {
      totalInvested += currentMonthly;
      totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
    }

    yearlyData.push({
      year: y,
      age: currentAge ? currentAge + y : undefined,
      monthlyAtYear,
      invested: parseFloat(totalInvested.toFixed(2)),
      returns: parseFloat((totalValue - totalInvested).toFixed(2)),
      totalValue: parseFloat(totalValue.toFixed(2)),
    });
  }

  const estimatedReturns = totalValue - totalInvested;
  const absoluteReturn = (estimatedReturns / totalInvested) * 100;
  const cagr = (Math.pow(totalValue / totalInvested, 1 / years) - 1) * 100;
  const wealthRatio = totalValue / totalInvested;

  return {
    investedAmount: parseFloat(totalInvested.toFixed(2)),
    estimatedReturns: parseFloat(estimatedReturns.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    cagr: parseFloat(cagr.toFixed(2)),
    wealthRatio: parseFloat(wealthRatio.toFixed(2)),
    finalMonthly: parseFloat(currentMonthly.toFixed(2)),
    yearlyData,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function fmtFull(n: number) {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Growth Graph ─────────────────────────────────────────────────────────────

function GrowthGraph({ data }: { data: YearData[] }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.totalValue));
  const minVal = 0;
  const range  = maxVal - minVal || 1;

  const xStep = PLOT_W / Math.max(data.length - 1, 1);

  const toX = (i: number) => PAD_LEFT + i * xStep;
  const toY = (val: number) => PAD_TOP + PLOT_H - ((val - minVal) / range) * PLOT_H;

  // Build SVG paths
  const totalPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.totalValue).toFixed(1)}`)
    .join(' ');

  const investedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.invested).toFixed(1)}`)
    .join(' ');

  // Area under total value line
  const totalAreaPath =
    totalPath +
    ` L${toX(data.length - 1).toFixed(1)},${(PAD_TOP + PLOT_H).toFixed(1)}` +
    ` L${toX(0).toFixed(1)},${(PAD_TOP + PLOT_H).toFixed(1)} Z`;

  // Area under invested line
  const investedAreaPath =
    investedPath +
    ` L${toX(data.length - 1).toFixed(1)},${(PAD_TOP + PLOT_H).toFixed(1)}` +
    ` L${toX(0).toFixed(1)},${(PAD_TOP + PLOT_H).toFixed(1)} Z`;

  // Y-axis labels (5 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    val: minVal + t * range,
    y: PAD_TOP + PLOT_H - t * PLOT_H,
  }));

  // X-axis labels — show up to 6 evenly spaced
  const xLabelCount = Math.min(data.length, 6);
  const xLabelIndices = Array.from({ length: xLabelCount }, (_, i) =>
    Math.round((i / (xLabelCount - 1)) * (data.length - 1))
  );

  // Tooltip dot — last data point
  const lastIdx  = data.length - 1;
  const dotTotalX = toX(lastIdx);
  const dotTotalY = toY(data[lastIdx].totalValue);

  return (
    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
      <Defs>
        <LinearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
        </LinearGradient>
        <LinearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#06d6a0" stopOpacity="0.25" />
          <Stop offset="100%" stopColor="#06d6a0" stopOpacity="0.02" />
        </LinearGradient>
      </Defs>

      {/* Grid lines */}
      {yTicks.map((tick, i) => (
        <G key={i}>
          <Line
            x1={PAD_LEFT}
            y1={tick.y}
            x2={PAD_LEFT + PLOT_W}
            y2={tick.y}
            stroke="#1a2035"
            strokeWidth="1"
            strokeDasharray={i === 0 ? '0' : '4,4'}
          />
          <SvgText
            x={PAD_LEFT - 6}
            y={tick.y + 4}
            fontSize="9"
            fill="#374151"
            textAnchor="end"
          >
            {fmt(tick.val)}
          </SvgText>
        </G>
      ))}

      {/* X-axis labels */}
      {xLabelIndices.map((idx) => (
        <SvgText
          key={idx}
          x={toX(idx)}
          y={PAD_TOP + PLOT_H + 18}
          fontSize="9"
          fill="#374151"
          textAnchor="middle"
        >
          {`Y${data[idx].year}`}
        </SvgText>
      ))}

      {/* Invested area */}
      <Path d={investedAreaPath} fill="url(#gradInvested)" />

      {/* Total area */}
      <Path d={totalAreaPath} fill="url(#gradTotal)" />

      {/* Invested line */}
      <Path
        d={investedPath}
        fill="none"
        stroke="#06d6a0"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />

      {/* Total value line */}
      <Path d={totalPath} fill="none" stroke="#a855f7" strokeWidth="2.5" />

      {/* Dot at last point */}
      <Circle cx={dotTotalX} cy={dotTotalY} r="5" fill="#a855f7" />
      <Circle cx={dotTotalX} cy={dotTotalY} r="3" fill="#0d1117" />
    </Svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PRESET_MONTHLY  = [1000, 2000, 5000, 10000, 25000];
const PRESET_RATES    = [8, 10, 12, 15, 18];
const PRESET_YEARS    = [5, 10, 15, 20, 30];
const PRESET_STEP_PCT = [5, 10, 15, 20];
const PRESET_STEP_AMT = [500, 1000, 2000, 5000];

export default function StepUpSIPCalculator() {
  const [monthly, setMonthly]       = useState('');
  const [rate, setRate]             = useState('');
  const [years, setYears]           = useState('');
  const [stepMode, setStepMode]     = useState<StepUpMode>('percent');
  const [stepValue, setStepValue]   = useState('');
  const [currentAge, setCurrentAge] = useState('');
  const [showAge, setShowAge]       = useState(false);
  const [result, setResult]         = useState<CalcResult | null>(null);
  const [error, setError]           = useState('');
  const [showTable, setShowTable]   = useState(false);
  const [activeTab, setActiveTab]   = useState<'graph' | 'table'>('graph');

  const calculate = () => {
    setError('');
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const sv = parseFloat(stepValue);

    if (isNaN(m) || m <= 0) { setError('Enter a valid monthly investment.'); return; }
    if (isNaN(r) || r <= 0 || r > 50) { setError('Enter a valid return rate (1–50%).'); return; }
    if (isNaN(y) || y <= 0 || y > 40) { setError('Enter a valid period (1–40 years).'); return; }
    if (isNaN(sv) || sv < 0) { setError('Enter a valid step-up value.'); return; }
    if (stepMode === 'percent' && sv > 100) { setError('Step-up % cannot exceed 100%.'); return; }

    const age = showAge && currentAge ? parseFloat(currentAge) : undefined;

    setResult(calcStepUpSIP(m, r, y, stepMode, sv, age));
    setActiveTab('graph');
    setShowTable(false);
  };

  const reset = () => {
    setMonthly(''); setRate(''); setYears(''); setStepValue('');
    setCurrentAge(''); setResult(null); setError('');
    setShowTable(false);
  };

  const investedPct = result
    ? ((result.investedAmount / result.totalValue) * 100).toFixed(1) : '0';
  const returnsPct  = result
    ? ((result.estimatedReturns / result.totalValue) * 100).toFixed(1) : '0';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* ── Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="rocket-outline" size={22} color="#a855f7" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Step-Up SIP Calculator</Text>
            <Text style={styles.bannerSub}>
              Increase your SIP annually to beat inflation and grow wealth faster
            </Text>
          </View>
        </View>

        {/* ── Input Card ── */}
        <View style={styles.card}>

          {/* Monthly Investment */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="cash-outline" size={13} color="#a855f7" />
              <Text style={styles.inputLabel}>INITIAL MONTHLY INVESTMENT</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.affix}>₹</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 5000"
                placeholderTextColor="#374151"
                value={monthly}
                onChangeText={(v) => { setMonthly(v); setResult(null); }}
              />
            </View>
            <View style={styles.chips}>
              {PRESET_MONTHLY.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.chip, monthly === String(a) && styles.chipActive]}
                  onPress={() => { setMonthly(String(a)); setResult(null); }}
                >
                  <Text style={[styles.chipText, monthly === String(a) && styles.chipTextActive]}>
                    ₹{a >= 1000 ? `${a / 1000}K` : a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Annual Step-Up */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="trending-up-outline" size={13} color="#a855f7" />
              <Text style={styles.inputLabel}>ANNUAL STEP-UP</Text>
            </View>
            {/* Mode toggle */}
            <View style={styles.modeToggle}>
              {(['percent', 'amount'] as StepUpMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeBtn, stepMode === m && styles.modeBtnActive]}
                  onPress={() => { setStepMode(m); setStepValue(''); setResult(null); }}
                >
                  <Ionicons
                    name={m === 'percent' ? 'at-outline' : 'add-circle-outline'}
                    size={14}
                    color={stepMode === m ? '#0a0e1a' : '#6b7280'}
                  />
                  <Text style={[styles.modeBtnText, stepMode === m && styles.modeBtnTextActive]}>
                    {m === 'percent' ? '% Increase' : '₹ Increase'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.affix}>{stepMode === 'percent' ? '%' : '₹'}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={stepMode === 'percent' ? 'e.g. 10' : 'e.g. 1000'}
                placeholderTextColor="#374151"
                value={stepValue}
                onChangeText={(v) => { setStepValue(v); setResult(null); }}
              />
              <Text style={styles.affix}>/ yr</Text>
            </View>
            <View style={styles.chips}>
              {(stepMode === 'percent' ? PRESET_STEP_PCT : PRESET_STEP_AMT).map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.chip, stepValue === String(v) && styles.chipActive]}
                  onPress={() => { setStepValue(String(v)); setResult(null); }}
                >
                  <Text style={[styles.chipText, stepValue === String(v) && styles.chipTextActive]}>
                    {stepMode === 'percent' ? `${v}%` : `₹${v >= 1000 ? `${v / 1000}K` : v}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Expected Return */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="analytics-outline" size={13} color="#a855f7" />
              <Text style={styles.inputLabel}>EXPECTED ANNUAL RETURN</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 12"
                placeholderTextColor="#374151"
                value={rate}
                onChangeText={(v) => { setRate(v); setResult(null); }}
              />
              <Text style={styles.affix}>% p.a.</Text>
            </View>
            <View style={styles.chips}>
              {PRESET_RATES.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, rate === String(r) && styles.chipActive]}
                  onPress={() => { setRate(String(r)); setResult(null); }}
                >
                  <Text style={[styles.chipText, rate === String(r) && styles.chipTextActive]}>
                    {r}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Investment Period */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="hourglass-outline" size={13} color="#a855f7" />
              <Text style={styles.inputLabel}>INVESTMENT PERIOD</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 15"
                placeholderTextColor="#374151"
                value={years}
                onChangeText={(v) => { setYears(v); setResult(null); }}
              />
              <Text style={styles.affix}>Years</Text>
            </View>
            <View style={styles.chips}>
              {PRESET_YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.chip, years === String(y) && styles.chipActive]}
                  onPress={() => { setYears(String(y)); setResult(null); }}
                >
                  <Text style={[styles.chipText, years === String(y) && styles.chipTextActive]}>
                    {y}Y
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Optional Age */}
          <TouchableOpacity
            style={styles.optionalToggle}
            onPress={() => { setShowAge(!showAge); setCurrentAge(''); }}
          >
            <Ionicons
              name={showAge ? 'checkbox-outline' : 'square-outline'}
              size={16}
              color="#a855f7"
            />
            <Text style={styles.optionalText}>Add current age for age-based milestones</Text>
          </TouchableOpacity>
          {showAge && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={16} color="#4b5563" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 28"
                placeholderTextColor="#374151"
                value={currentAge}
                onChangeText={setCurrentAge}
              />
              <Text style={styles.affix}>yrs</Text>
            </View>
          )}

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color="#f72585" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Ionicons name="refresh-outline" size={17} color="#6b7280" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
              <Ionicons name="calculator-outline" size={17} color="#fff" />
              <Text style={styles.calcBtnText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RESULTS ── */}
        {result && (
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>TOTAL MATURITY VALUE</Text>
              <Text style={styles.heroValue}>{fmt(result.totalValue)}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>Invested</Text>
                  <Text style={styles.heroStatValue}>{fmt(result.investedAmount)}</Text>
                </View>
                <View style={styles.heroStatSep} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>Returns</Text>
                  <Text style={[styles.heroStatValue, { color: '#a855f7' }]}>
                    {fmt(result.estimatedReturns)}
                  </Text>
                </View>
                <View style={styles.heroStatSep} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>Final SIP</Text>
                  <Text style={[styles.heroStatValue, { color: '#06d6a0' }]}>
                    {fmt(result.finalMonthly)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Split Bar */}
            <View style={styles.splitCard}>
              <View style={styles.barTrack}>
                <View style={[styles.barSeg, { flex: parseFloat(investedPct), backgroundColor: '#06d6a0' }]} />
                <View style={[styles.barSeg, { flex: parseFloat(returnsPct), backgroundColor: '#a855f7' }]} />
              </View>
              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                  <Text style={styles.legendLabel}>Invested</Text>
                  <Text style={[styles.legendPct, { color: '#06d6a0' }]}>{investedPct}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#a855f7' }]} />
                  <Text style={styles.legendLabel}>Returns</Text>
                  <Text style={[styles.legendPct, { color: '#a855f7' }]}>{returnsPct}%</Text>
                </View>
              </View>
            </View>

            {/* Metrics */}
            <View style={styles.metricsGrid}>
              {[
                { label: 'Absolute Return', value: `${result.absoluteReturn}%`, icon: 'trending-up-outline', color: '#a855f7' },
                { label: 'CAGR',            value: `${result.cagr}%`,           icon: 'stats-chart-outline', color: '#00d4ff' },
                { label: 'Wealth Ratio',    value: `${result.wealthRatio}x`,     icon: 'diamond-outline',    color: '#f59e0b' },
                { label: 'Final Monthly SIP', value: fmt(result.finalMonthly), icon: 'cash-outline',       color: '#06d6a0' },
              ].map((m) => (
                <View key={m.label} style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: m.color + '20' }]}>
                    <Ionicons name={m.icon as any} size={16} color={m.color} />
                  </View>
                  <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              ))}
            </View>

            {/* Graph / Table Tabs */}
            <View style={styles.tabRow}>
              {(['graph', 'table'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Ionicons
                    name={tab === 'graph' ? 'bar-chart-outline' : 'list-outline'}
                    size={14}
                    color={activeTab === tab ? '#0a0e1a' : '#6b7280'}
                  />
                  <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                    {tab === 'graph' ? 'Growth Graph' : 'Year Table'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Growth Graph ── */}
            {activeTab === 'graph' && (
              <View style={styles.graphCard}>
                <View style={styles.graphHeader}>
                  <Text style={styles.graphTitle}>Portfolio Growth Over Time</Text>
                  <View style={styles.graphLegend}>
                    <View style={styles.graphLegendItem}>
                      <View style={[styles.graphLegendLine, { backgroundColor: '#a855f7' }]} />
                      <Text style={styles.graphLegendText}>Total Value</Text>
                    </View>
                    <View style={styles.graphLegendItem}>
                      <View style={[styles.graphLegendLine, { backgroundColor: '#06d6a0', opacity: 0.7 }]} />
                      <Text style={styles.graphLegendText}>Invested</Text>
                    </View>
                  </View>
                </View>
                <GrowthGraph data={result.yearlyData} />

                {/* Milestone callouts */}
                <View style={styles.graphMilestones}>
                  {[0.25, 0.5, 0.75, 1].map((frac) => {
                    const idx = Math.min(
                      Math.round(frac * (result.yearlyData.length - 1)),
                      result.yearlyData.length - 1
                    );
                    const d = result.yearlyData[idx];
                    return (
                      <View key={frac} style={styles.graphMilestone}>
                        <Text style={styles.graphMilestoneYear}>
                          Yr {d.year}{d.age ? ` (${d.age})` : ''}
                        </Text>
                        <Text style={[styles.graphMilestoneVal, frac === 1 && { color: '#a855f7' }]}>
                          {fmt(d.totalValue)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── Year Table ── */}
            {activeTab === 'table' && (
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  {['Year', showAge && currentAge ? 'Age' : null, 'Monthly', 'Invested', 'Returns', 'Value']
                    .filter(Boolean)
                    .map((h) => (
                      <Text key={h!} style={styles.tableHeadCell}>{h}</Text>
                    ))}
                </View>
                {result.yearlyData.map((row, idx) => (
                  <View
                    key={row.year}
                    style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
                  >
                    <Text style={styles.tableCell}>{row.year}</Text>
                    {showAge && currentAge && (
                      <Text style={styles.tableCell}>{row.age}</Text>
                    )}
                    <Text style={styles.tableCell}>{fmt(row.monthlyAtYear)}</Text>
                    <Text style={styles.tableCell}>{fmt(row.invested)}</Text>
                    <Text style={[styles.tableCell, { color: '#a855f7' }]}>
                      {fmt(row.returns)}
                    </Text>
                    <Text style={[styles.tableCell, { color: '#00d4ff' }]}>
                      {fmt(row.totalValue)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Step-Up Benefit comparison */}
            <Text style={styles.sectionLabel}>STEP-UP BENEFIT</Text>
            <View style={styles.benefitCard}>
              {(() => {
                // Compare with flat SIP (no step-up)
                const flatResult = calcStepUpSIP(
                  parseFloat(monthly), parseFloat(rate), parseFloat(years), 'percent', 0
                );
                const extra = result.totalValue - flatResult.totalValue;
                const extraInvested = result.investedAmount - flatResult.investedAmount;
                return (
                  <>
                    <View style={styles.benefitRow}>
                      <View style={styles.benefitItem}>
                        <Text style={styles.benefitItemLabel}>Flat SIP Value</Text>
                        <Text style={[styles.benefitItemValue, { color: '#6b7280' }]}>
                          {fmt(flatResult.totalValue)}
                        </Text>
                        <Text style={styles.benefitItemSub}>No step-up</Text>
                      </View>
                      <View style={styles.benefitVs}>
                        <Ionicons name="arrow-forward" size={16} color="#a855f7" />
                      </View>
                      <View style={styles.benefitItem}>
                        <Text style={styles.benefitItemLabel}>Step-Up SIP Value</Text>
                        <Text style={[styles.benefitItemValue, { color: '#a855f7' }]}>
                          {fmt(result.totalValue)}
                        </Text>
                        <Text style={styles.benefitItemSub}>With step-up</Text>
                      </View>
                    </View>
                    <View style={styles.extraBox}>
                      <Ionicons name="rocket-outline" size={15} color="#a855f7" />
                      <Text style={styles.extraText}>
                        Extra corpus:{' '}
                        <Text style={{ color: '#a855f7', fontWeight: '800' }}>{fmt(extra)}</Text>
                        {'  ·  '}Extra invested:{' '}
                        <Text style={{ color: '#06d6a0', fontWeight: '700' }}>
                          {fmt(extraInvested)}
                        </Text>
                      </Text>
                    </View>
                  </>
                );
              })()}
            </View>

            {/* Summary Note */}
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={15} color="#a855f7" />
              <Text style={styles.summaryNoteText}>
                Starting with{' '}
                <Text style={styles.hl}>{fmtFull(parseFloat(monthly))}/mo</Text>, stepping up by{' '}
                <Text style={styles.hl}>
                  {stepMode === 'percent' ? `${stepValue}%` : `₹${stepValue}`}
                </Text>{' '}
                every year at <Text style={styles.hl}>{rate}% p.a.</Text> for{' '}
                <Text style={styles.hl}>{years} years</Text> grows your wealth to{' '}
                <Text style={styles.hl}>{fmt(result.totalValue)}</Text> — a{' '}
                <Text style={styles.hl}>{result.wealthRatio}x</Text> return. Your final monthly SIP
                will be <Text style={styles.hl}>{fmt(result.finalMonthly)}</Text>.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 56 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#a855f712',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a855f730',
  },
  bannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#a855f720',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  bannerSub: { fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 16 },

  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 16,
  },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputLabel: { fontSize: 11, color: '#6b7280', fontWeight: '800', letterSpacing: 1.2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131929',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    paddingHorizontal: 14,
  },
  affix: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  input: { flex: 1, fontSize: 18, color: '#f3f4f6', paddingVertical: 13, paddingHorizontal: 8 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#131929',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  chipActive: { backgroundColor: '#a855f7', borderColor: '#a855f7' },
  chipText: { fontSize: 11, color: '#4b5563', fontWeight: '700' },
  chipTextActive: { color: '#fff' },

  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 9,
  },
  modeBtnActive: { backgroundColor: '#a855f7' },
  modeBtnText: { fontSize: 13, color: '#6b7280', fontWeight: '700' },
  modeBtnTextActive: { color: '#0a0e1a' },

  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionalText: { fontSize: 13, color: '#4b5563', fontWeight: '600' },

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
  errorText: { fontSize: 13, color: '#f72585', fontWeight: '600', flex: 1 },

  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1a2035',
    borderRadius: 14,
    paddingVertical: 14,
  },
  resetText: { fontSize: 14, fontWeight: '700', color: '#6b7280' },
  calcBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#a855f7',
    borderRadius: 14,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  hero: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#a855f730',
  },
  heroLabel: { fontSize: 11, color: '#4b5563', fontWeight: '800', letterSpacing: 1.5 },
  heroValue: { fontSize: 42, fontWeight: '300', color: '#a855f7', letterSpacing: -1.5, marginTop: 4 },
  heroDivider: { height: 1, backgroundColor: '#1a2035', width: '100%', marginVertical: 16 },
  heroRow: { flexDirection: 'row', width: '100%' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatSep: { width: 1, backgroundColor: '#1a2035' },
  heroStatLabel: { fontSize: 10, color: '#4b5563', fontWeight: '700', letterSpacing: 0.3 },
  heroStatValue: { fontSize: 13, fontWeight: '800', color: '#f3f4f6', marginTop: 3 },

  splitCard: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 12,
  },
  barTrack: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: '#131929' },
  barSeg: { height: '100%' },
  barLegend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  legendPct: { fontSize: 12, fontWeight: '800' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  metricCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    alignItems: 'center',
    gap: 7,
  },
  metricIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  metricLabel: { fontSize: 10, color: '#4b5563', fontWeight: '600', textAlign: 'center' },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: { backgroundColor: '#a855f7' },
  tabBtnText: { fontSize: 13, color: '#4b5563', fontWeight: '700' },
  tabBtnTextActive: { color: '#0a0e1a' },

  // Graph
  graphCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  graphHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  graphTitle: { fontSize: 13, fontWeight: '800', color: '#f3f4f6' },
  graphLegend: { flexDirection: 'row', gap: 12 },
  graphLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  graphLegendLine: { width: 18, height: 2.5, borderRadius: 2 },
  graphLegendText: { fontSize: 10, color: '#4b5563', fontWeight: '600' },
  graphMilestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2035',
  },
  graphMilestone: { alignItems: 'center', flex: 1 },
  graphMilestoneYear: { fontSize: 9, color: '#374151', fontWeight: '700' },
  graphMilestoneVal: { fontSize: 11, color: '#f3f4f6', fontWeight: '800', marginTop: 2 },

  // Table
  tableCard: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#131929', paddingVertical: 10, paddingHorizontal: 10 },
  tableHeadCell: { flex: 1, fontSize: 9, color: '#4b5563', fontWeight: '800', textAlign: 'center', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: '#1a2035' },
  tableRowAlt: { backgroundColor: '#0a0f1e' },
  tableCell: { flex: 1, fontSize: 10, color: '#9ca3af', textAlign: 'center', fontWeight: '600' },

  sectionLabel: { fontSize: 11, color: '#374151', fontWeight: '800', letterSpacing: 1.8, marginBottom: 14 },

  benefitCard: {
    backgroundColor: '#0d1117',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a855f725',
    gap: 14,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center' },
  benefitItem: { flex: 1, alignItems: 'center', gap: 4 },
  benefitItemLabel: { fontSize: 11, color: '#4b5563', fontWeight: '700', textAlign: 'center' },
  benefitItemValue: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  benefitItemSub: { fontSize: 10, color: '#374151' },
  benefitVs: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#a855f720',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#a855f712',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#a855f725',
  },
  extraText: { fontSize: 12, color: '#6b7280', flex: 1 },

  summaryNote: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#a855f710',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a855f725',
  },
  summaryNoteText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 20 },
  hl: { color: '#a855f7', fontWeight: '700' },
});
