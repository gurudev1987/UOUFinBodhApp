/**
 * SIPCalculator.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SIP (Systematic Investment Plan) Calculator
 * React Native — iOS + Android hybrid mobile app
 *
 * Formula:
 *   M  = Monthly SIP (₹)
 *   r  = Monthly rate = Annual rate / 12 / 100
 *   n  = Total months = Years × 12
 *   Corpus = M × { [(1 + r)^n − 1] / r } × (1 + r)
 *
 * DEPENDENCIES:
 *   npm install react-native-svg
 *   cd ios && pod install    ← iOS only
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Text as SvgText,
  G,
  Line,
} from 'react-native-svg';

// ─── Layout ───────────────────────────────────────────────────────────────────
const { width: SW } = Dimensions.get('window');
const CHART_W = SW - 48;
const CHART_H = 180;

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  bg:          '#05080F',
  surface:     '#0C1220',
  card:        '#111827',
  border:      '#1C2D44',
  accent:      '#00C896',   // emerald-mint — wealth / growth
  accentDark:  '#009970',
  accentGlow:  '#00C89630',
  gold:        '#F4B942',
  blue:        '#3B82F6',
  blueDim:     '#1E3A5F',
  text:        '#EBF4FF',
  sub:         '#7A9BC0',
  muted:       '#3D5470',
  invested:    '#3B82F6',
  returns:     '#00C896',
  danger:      '#F87171',
};

// ─── INR Formatter ───────────────────────────────────────────────────────────
function fmt(v: number, decimals = 0): string {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)} Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)} L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)} K`;
  return `₹${v.toFixed(decimals)}`;
}

function fmtFull(v: number): string {
  return '₹' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ─── SIP Formula ─────────────────────────────────────────────────────────────
function calcSIP(monthly: number, annualRate: number, years: number) {
  if (monthly <= 0 || annualRate <= 0 || years <= 0) return null;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const corpus = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const invested = monthly * n;
  const returns = corpus - invested;
  return { corpus, invested, returns, n };
}

// ─── Year-by-year growth for bar chart ───────────────────────────────────────
function yearlyBreakdown(monthly: number, annualRate: number, years: number) {
  const rows: { yr: number; invested: number; corpus: number }[] = [];
  for (let y = 1; y <= years; y++) {
    const r = calcSIP(monthly, annualRate, y);
    if (r) rows.push({ yr: y, invested: r.invested, corpus: r.corpus });
  }
  return rows;
}

// ─── Animated Number ─────────────────────────────────────────────────────────
function AnimNumber({ value, style }: { value: number; style?: any }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value: v }) => setDisplay(v));
    return () => anim.removeListener(id);
  }, [value]);

  return <Text style={style}>{fmtFull(display)}</Text>;
}

// ─── Donut Progress Ring ──────────────────────────────────────────────────────
function DonutRing({
  investedPct,
  returnsPct,
  corpus,
}: {
  investedPct: number;
  returnsPct: number;
  corpus: number;
}) {
  const SIZE = 180;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 80;
  const R_INNER = 58;

  function arcPath(r: number, startDeg: number, endDeg: number) {
    function pt(angle: number) {
      const rad = ((angle - 90) * Math.PI) / 180;
      return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
    }
    const s = pt(startDeg);
    const e = pt(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    const p1 = pt(startDeg);
    const p2 = pt(endDeg);
    const pi = pt(startDeg);
    const pi2 = pt(endDeg);
    // outer arc → inner arc back
    const o1 = { x: CX + R_OUTER * Math.cos(((startDeg - 90) * Math.PI) / 180), y: CY + R_OUTER * Math.sin(((startDeg - 90) * Math.PI) / 180) };
    const o2 = { x: CX + R_OUTER * Math.cos(((endDeg - 90) * Math.PI) / 180),   y: CY + R_OUTER * Math.sin(((endDeg - 90) * Math.PI) / 180) };
    const i1 = { x: CX + R_INNER * Math.cos(((endDeg - 90) * Math.PI) / 180),   y: CY + R_INNER * Math.sin(((endDeg - 90) * Math.PI) / 180) };
    const i2 = { x: CX + R_INNER * Math.cos(((startDeg - 90) * Math.PI) / 180), y: CY + R_INNER * Math.sin(((startDeg - 90) * Math.PI) / 180) };
    return `M ${o1.x} ${o1.y} A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${R_INNER} ${R_INNER} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
  }

  const investEnd = investedPct * 3.6; // degrees
  const returnEnd = 360;

  return (
    <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="gInv" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={P.blue} />
            <Stop offset="1" stopColor="#6366F1" />
          </LinearGradient>
          <LinearGradient id="gRet" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={P.accent} />
            <Stop offset="1" stopColor="#00E5A0" />
          </LinearGradient>
        </Defs>
        {/* Returns arc (full minus invested) */}
        <Path d={arcPath(R_OUTER, investEnd, 360)} fill="url(#gRet)" opacity={0.95} />
        {/* Invested arc */}
        <Path d={arcPath(R_OUTER, 0, investEnd)} fill="url(#gInv)" opacity={0.95} />
        {/* Inner hole */}
        <Circle cx={CX} cy={CY} r={R_INNER - 2} fill={P.surface} />
      </Svg>
      {/* Centre text */}
      <View style={s.ringCentre} pointerEvents="none">
        <Text style={s.ringLabel}>CORPUS</Text>
        <Text style={s.ringValue}>{fmt(corpus)}</Text>
      </View>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function GrowthChart({ data }: { data: { yr: number; invested: number; corpus: number }[] }) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.corpus));
  const BAR_W = Math.max(18, (CHART_W - 32) / data.length - 6);
  const SHOW_EVERY = data.length > 10 ? 2 : 1;

  return (
    <View style={s.chartWrap}>
      <Text style={s.chartTitle}>Year-by-Year Growth</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={Math.max(CHART_W, data.length * (BAR_W + 6) + 32)} height={CHART_H + 32}>
          <Defs>
            <LinearGradient id="barInv" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.blue} stopOpacity="0.9" />
              <Stop offset="1" stopColor={P.blue} stopOpacity="0.3" />
            </LinearGradient>
            <LinearGradient id="barRet" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.accent} stopOpacity="0.95" />
              <Stop offset="1" stopColor={P.accent} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <Line
              key={i}
              x1={0} y1={CHART_H - f * CHART_H}
              x2={data.length * (BAR_W + 6) + 16} y2={CHART_H - f * CHART_H}
              stroke={P.border} strokeWidth={1}
            />
          ))}

          {data.map((d, i) => {
            const x = 16 + i * (BAR_W + 6);
            const investH = (d.invested / maxVal) * CHART_H;
            const corpusH = (d.corpus / maxVal) * CHART_H;

            return (
              <G key={i}>
                {/* Corpus bar (behind) */}
                <Rect
                  x={x} y={CHART_H - corpusH}
                  width={BAR_W} height={corpusH}
                  rx={4} fill="url(#barRet)"
                />
                {/* Invested bar (overlay) */}
                <Rect
                  x={x} y={CHART_H - investH}
                  width={BAR_W} height={investH}
                  rx={4} fill="url(#barInv)"
                />
                {/* Year label */}
                {(i === 0 || (i + 1) % SHOW_EVERY === 0) && (
                  <SvgText
                    x={x + BAR_W / 2} y={CHART_H + 18}
                    fontSize={9} fill={P.sub}
                    textAnchor="middle" fontWeight="600"
                  >
                    {`Y${d.yr}`}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      {/* Legend */}
      <View style={s.legendRow}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: P.blue }]} />
          <Text style={s.legendTxt}>Invested</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: P.accent }]} />
          <Text style={s.legendTxt}>Est. Returns</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Slider Row ───────────────────────────────────────────────────────────────
function SliderRow({
  label, value, unit, min, max, step,
  onChange, color = P.accent,
}: {
  label: string; value: number; unit: string;
  min: number; max: number; step: number;
  onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const dec = () => onChange(Math.max(min, parseFloat((value - step).toFixed(2))));
  const inc = () => onChange(Math.min(max, parseFloat((value + step).toFixed(2))));

  return (
    <View style={s.sliderRow}>
      <View style={s.sliderHeader}>
        <Text style={s.sliderLabel}>{label}</Text>
        <View style={s.sliderValBox}>
          {unit === '₹' && <Text style={s.sliderUnit}>₹</Text>}
          <Text style={s.sliderVal}>{unit === '₹' ? value.toLocaleString('en-IN') : value}</Text>
          {unit !== '₹' && <Text style={s.sliderUnit}>{unit}</Text>}
        </View>
      </View>

      {/* Track */}
      <View style={s.track}>
        <View style={[s.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
        <View style={[s.thumb, { left: `${pct}%` as any, borderColor: color }]} />
      </View>

      {/* −  + buttons */}
      <View style={s.nudgeRow}>
        <Text style={s.nudgeLbl}>{unit === '₹' ? `₹${min.toLocaleString('en-IN')}` : `${min}${unit}`}</Text>
        <View style={s.nudgeBtns}>
          <TouchableOpacity onPress={dec} style={[s.nudgeBtn, { borderColor: color }]}>
            <Text style={[s.nudgeTxt, { color }]}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={inc} style={[s.nudgeBtn, { borderColor: color }]}>
            <Text style={[s.nudgeTxt, { color }]}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.nudgeLbl}>{unit === '₹' ? `₹${max.toLocaleString('en-IN')}` : `${max}${unit}`}</Text>
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SIPCalculator() {
  const [monthly, setMonthly]   = useState(5000);
  const [rate,    setRate]      = useState(6);
  const [years,   setYears]     = useState(7);
  const [inputMode, setInputMode] = useState(false);

  // Direct text inputs
  const [tMonthly, setTMonthly] = useState('5000');
  const [tRate,    setTRate]    = useState('6');
  const [tYears,   setTYears]   = useState('7');

  const result = calcSIP(monthly, rate, years);
  const breakdown = result ? yearlyBreakdown(monthly, rate, years) : [];

  const invested = result?.invested ?? 0;
  const corpus   = result?.corpus   ?? 0;
  const returns  = result?.returns  ?? 0;
  const investedPct = corpus > 0 ? (invested / corpus) * 100 : 0;
  const returnsPct  = corpus > 0 ? (returns  / corpus) * 100 : 0;

  const applyText = () => {
    const m = parseFloat(tMonthly) || 5000;
    const r = parseFloat(tRate)    || 6;
    const y = parseInt(tYears)     || 7;
    setMonthly(Math.min(1_00_000, Math.max(500, m)));
    setRate(Math.min(30, Math.max(1, r)));
    setYears(Math.min(40, Math.max(1, y)));
    setInputMode(false);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={P.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>CALCULATOR</Text>
          <Text style={s.title}>SIP Planner</Text>
        </View>
        <TouchableOpacity
          style={[s.modeBtn, inputMode && s.modeBtnActive]}
          onPress={() => setInputMode(v => !v)}
          activeOpacity={0.75}
        >
          <Text style={[s.modeTxt, inputMode && s.modeTxtActive]}>
            {inputMode ? '✓ Apply' : '✎ Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Result Hero ── */}
        {result && (
          <View style={s.heroCard}>
            {/* Donut + right stats */}
            <View style={s.heroRow}>
              <DonutRing
                investedPct={investedPct}
                returnsPct={returnsPct}
                corpus={corpus}
              />
              <View style={s.heroStats}>
                <View style={s.heroStatItem}>
                  <View style={[s.heroStatBar, { backgroundColor: P.blue }]} />
                  <View>
                    <Text style={s.heroStatLbl}>Invested</Text>
                    <Text style={[s.heroStatVal, { color: P.blue }]}>{fmt(invested)}</Text>
                    <Text style={s.heroStatPct}>{investedPct.toFixed(1)}%</Text>
                  </View>
                </View>
                <View style={s.heroStatItem}>
                  <View style={[s.heroStatBar, { backgroundColor: P.accent }]} />
                  <View>
                    <Text style={s.heroStatLbl}>Est. Returns</Text>
                    <Text style={[s.heroStatVal, { color: P.accent }]}>{fmt(returns)}</Text>
                    <Text style={s.heroStatPct}>{returnsPct.toFixed(1)}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Full corpus */}
            <View style={s.corpusRow}>
              <Text style={s.corpusLbl}>Total Corpus</Text>
              <AnimNumber value={corpus} style={s.corpusVal} />
            </View>

            {/* Quick metrics */}
            <View style={s.metricsRow}>
              <View style={s.metricItem}>
                <Text style={s.metricLbl}>Monthly SIP</Text>
                <Text style={s.metricVal}>₹{monthly.toLocaleString('en-IN')}</Text>
              </View>
              <View style={s.metricDiv} />
              <View style={s.metricItem}>
                <Text style={s.metricLbl}>Duration</Text>
                <Text style={s.metricVal}>{years} yrs</Text>
              </View>
              <View style={s.metricDiv} />
              <View style={s.metricItem}>
                <Text style={s.metricLbl}>Return Rate</Text>
                <Text style={s.metricVal}>{rate}% p.a.</Text>
              </View>
              <View style={s.metricDiv} />
              <View style={s.metricItem}>
                <Text style={s.metricLbl}>Instalments</Text>
                <Text style={s.metricVal}>{result.n}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Input Mode: text fields ── */}
        {inputMode && (
          <View style={s.textInputCard}>
            <Text style={s.textInputTitle}>Enter Values Directly</Text>
            <View style={s.textRow}>
              <View style={s.textField}>
                <Text style={s.textFieldLbl}>Monthly SIP</Text>
                <View style={s.textFieldBox}>
                  <Text style={s.textRupee}>₹</Text>
                  <TextInput
                    style={s.textFieldInput}
                    value={tMonthly}
                    onChangeText={setTMonthly}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholder="5000"
                    placeholderTextColor={P.muted}
                  />
                </View>
              </View>
              <View style={s.textField}>
                <Text style={s.textFieldLbl}>Return %</Text>
                <View style={s.textFieldBox}>
                  <TextInput
                    style={[s.textFieldInput, { flex: 1 }]}
                    value={tRate}
                    onChangeText={setTRate}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="6"
                    placeholderTextColor={P.muted}
                  />
                  <Text style={s.textUnit}>%</Text>
                </View>
              </View>
              <View style={s.textField}>
                <Text style={s.textFieldLbl}>Years</Text>
                <View style={s.textFieldBox}>
                  <TextInput
                    style={[s.textFieldInput, { flex: 1 }]}
                    value={tYears}
                    onChangeText={setTYears}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholder="7"
                    placeholderTextColor={P.muted}
                  />
                  <Text style={s.textUnit}>yr</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={s.applyBtn} onPress={applyText} activeOpacity={0.8}>
              <Text style={s.applyBtnTxt}>Calculate →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Sliders ── */}
        {/* {!inputMode && (
        //   <View style={s.slidersCard}>
        //     <Text style={s.slidersTitle}>Adjust Parameters</Text>

        //     <SliderRow
        //       label="Monthly SIP"
        //       value={monthly}
        //       unit="₹"
        //       min={500} max={1_00_000} step={500}
        //       onChange={setMonthly}
        //       color={P.blue}
        //     />

        //     <View style={s.divider} />

        //     <SliderRow
        //       label="Expected Return"
        //       value={rate}
        //       unit="% p.a."
        //       min={1} max={30} step={0.5}
        //       onChange={setRate}
        //       color={P.gold}
        //     />

        //     <View style={s.divider} />

        //     <SliderRow
        //       label="Investment Period"
        //       value={years}
        //       unit=" yr"
        //       min={1} max={40} step={1}
        //       onChange={setYears}
        //       color={P.accent}
        //     />
        //   </View>
        )} */}

        {/* ── Bar Chart ── */}
        {breakdown.length > 0 && <GrowthChart data={breakdown} />}

        {/* ── Formula Note ── */}
        {/* <View style={s.formulaCard}>
          <Text style={s.formulaTitle}>📐 Formula Used</Text>
          <Text style={s.formulaTxt}>
            {'Corpus = M × { [(1 + r)ⁿ − 1] / r } × (1 + r)\n\n'}
            {'M  = Monthly SIP   |   r = Monthly Rate\n'}
            {'n  = Total Months (Years × 12)'}
          </Text>
          <View style={s.formulaExample}>
            <Text style={s.formulaExTxt}>
              {`₹${monthly.toLocaleString('en-IN')} × `}
              {`[((1 + ${(rate/12/100).toFixed(5)})^${years*12} − 1) / ${(rate/12/100).toFixed(5)}]`}
              {` × (1 + ${(rate/12/100).toFixed(5)})`}
            </Text>
            <Text style={[s.formulaResult, { color: P.accent }]}>
              = {result ? fmtFull(result.corpus) : '—'}
            </Text>
          </View>
        </View> */}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: P.bg },

  header:  {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 56 : 38,
    paddingHorizontal: 20, paddingBottom: 10,
  },
  eyebrow: { fontSize: 10, letterSpacing: 3.5, color: P.accent, fontWeight: '800', marginBottom: 2 },
  title:   { fontSize: 28, fontWeight: '900', color: P.text, letterSpacing: -0.8 },
  modeBtn: {
    backgroundColor: P.card, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: P.border,
  },
  modeBtnActive: { backgroundColor: P.accent, borderColor: P.accent },
  modeTxt:       { color: P.sub, fontSize: 13, fontWeight: '700' },
  modeTxtActive: { color: '#000' },

  scroll: { paddingHorizontal: 16, paddingTop: 8 },

  // Hero card
  heroCard: {
    backgroundColor: P.surface, borderRadius: 24,
    borderWidth: 1, borderColor: P.border,
    padding: 18, marginBottom: 14,
  },
  heroRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroStats:     { flex: 1, paddingLeft: 16, gap: 14 },
  heroStatItem:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  heroStatBar:   { width: 3, height: 46, borderRadius: 2, marginTop: 2 },
  heroStatLbl:   { fontSize: 10, color: P.sub, letterSpacing: 0.8, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  heroStatVal:   { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  heroStatPct:   { fontSize: 11, color: P.sub, fontWeight: '600' },

  ringCentre:  { position: 'absolute', alignItems: 'center' },
  ringLabel:   { fontSize: 9, color: P.sub, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase' },
  ringValue:   { fontSize: 15, fontWeight: '900', color: P.text, marginTop: 3, letterSpacing: -0.5 },

  corpusRow:   {
    borderTopWidth: 1, borderColor: P.border,
    paddingTop: 14, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  corpusLbl:   { fontSize: 12, color: P.sub, fontWeight: '700', letterSpacing: 0.5 },
  corpusVal:   { fontSize: 20, fontWeight: '900', color: P.accent, letterSpacing: -0.5 },

  metricsRow:  { flexDirection: 'row', backgroundColor: P.card, borderRadius: 14, padding: 12 },
  metricItem:  { flex: 1, alignItems: 'center' },
  metricDiv:   { width: 1, backgroundColor: P.border, marginVertical: 2 },
  metricLbl:   { fontSize: 9, color: P.muted, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600', marginBottom: 3 },
  metricVal:   { fontSize: 12, fontWeight: '800', color: P.text },

  // Text input mode
  textInputCard: {
    backgroundColor: P.surface, borderRadius: 20,
    borderWidth: 1, borderColor: P.border,
    padding: 16, marginBottom: 14,
  },
  textInputTitle: { fontSize: 13, color: P.sub, fontWeight: '700', marginBottom: 12 },
  textRow:        { flexDirection: 'row', gap: 8 },
  textField:      { flex: 1 },
  textFieldLbl:   { fontSize: 9, color: P.muted, letterSpacing: 1, fontWeight: '700',
                     textTransform: 'uppercase', marginBottom: 5 },
  textFieldBox:   {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: P.card, borderRadius: 10,
    borderWidth: 1, borderColor: P.border,
    paddingHorizontal: 8, height: 44,
  },
  textRupee:      { fontSize: 16, color: P.gold, fontWeight: '700', marginRight: 2 },
  textFieldInput: { flex: 1, fontSize: 15, fontWeight: '700', color: P.text, padding: 0 },
  textUnit:       { fontSize: 12, color: P.sub, fontWeight: '600' },
  applyBtn:       {
    backgroundColor: P.accent, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center', marginTop: 12,
  },
  applyBtnTxt:    { color: '#000', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },

  // Sliders card
  slidersCard: {
    backgroundColor: P.surface, borderRadius: 20,
    borderWidth: 1, borderColor: P.border,
    padding: 18, marginBottom: 14,
  },
  slidersTitle: { fontSize: 13, color: P.sub, fontWeight: '700', marginBottom: 14 },
  divider:      { height: 1, backgroundColor: P.border, marginVertical: 10 },

  sliderRow:    { gap: 8 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderLabel:  { fontSize: 13, color: P.text, fontWeight: '700' },
  sliderValBox: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sliderUnit:   { fontSize: 12, color: P.muted, fontWeight: '600' },
  sliderVal:    { fontSize: 16, fontWeight: '900', color: P.text },

  track:  {
    height: 6, backgroundColor: P.border, borderRadius: 4,
    position: 'relative', justifyContent: 'center',
  },
  fill:   { height: '100%', borderRadius: 4, position: 'absolute', left: 0 },
  thumb:  {
    position: 'absolute', width: 18, height: 18,
    borderRadius: 9, backgroundColor: P.bg,
    borderWidth: 3, marginLeft: -9,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  nudgeRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nudgeLbl:  { fontSize: 9, color: P.muted, fontWeight: '600' },
  nudgeBtns: { flexDirection: 'row', gap: 8 },
  nudgeBtn:  {
    width: 30, height: 30, borderRadius: 8,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  nudgeTxt:  { fontSize: 18, fontWeight: '700', lineHeight: 22 },

  // Chart
  chartWrap: {
    backgroundColor: P.surface, borderRadius: 20,
    borderWidth: 1, borderColor: P.border,
    padding: 16, marginBottom: 14,
  },
  chartTitle: { fontSize: 14, color: P.text, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  legendRow:  { flexDirection: 'row', gap: 18, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 3 },
  legendTxt:  { fontSize: 11, color: P.sub, fontWeight: '600' },

  // Formula
  formulaCard: {
    backgroundColor: `${P.accent}0C`,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: `${P.accent}25`,
    marginBottom: 14,
  },
  formulaTitle:  { fontSize: 13, color: P.accent, fontWeight: '800', marginBottom: 8 },
  formulaTxt:    { fontSize: 12, color: P.sub, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  formulaExample:{ marginTop: 10, backgroundColor: P.card, borderRadius: 10, padding: 10 },
  formulaExTxt:  { fontSize: 10, color: P.sub, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 16 },
  formulaResult: { fontSize: 15, fontWeight: '900', marginTop: 6, letterSpacing: -0.3 },
});
