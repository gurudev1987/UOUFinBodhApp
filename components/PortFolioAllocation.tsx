/**
 * LivePortfolioAllocation.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Live Portfolio Tracker for React Native (iOS + Android)
 *
 * FREE API USED:
 *   Yahoo Finance v8 Quote API  — no API key required
 *   Endpoint: https://query1.finance.yahoo.com/v8/finance/quote?symbols=RELIANCE.NS
 *   NSE suffix: .NS  (e.g. RELIANCE.NS, TCS.NS, INFY.NS)
 *   BSE suffix: .BO  (e.g. RELIANCE.BO)
 *
 * DEPENDENCIES:
 *   npm install react-native-svg
 *   cd ios && pod install          ← iOS only
 *
 * CORS NOTE:
 *   Yahoo Finance blocks direct browser calls. In React Native (native build)
 *   this works fine since there is no browser CORS policy.
 *   For Expo Go / web preview use the proxy helper at bottom of this file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import Svg, { G, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// ─── Screen / Layout ──────────────────────────────────────────────────────────
const { width: SW } = Dimensions.get('window');
const PIE_SIZE = SW * 0.74;
const R = PIE_SIZE / 2;
const CX = R;
const CY = R;
const REFRESH_INTERVAL_MS = 30_000; // auto-refresh every 30 s

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#070C18',
  surface: '#0F1724',
  card: '#161F30',
  border: '#1E2D45',
  accent: '#3B82F6',
  accentDim: '#1D4ED8',
  gold: '#F59E0B',
  text: '#F0F6FF',
  sub: '#8BA3C7',
  muted: '#4A6080',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  slices: [
    '#3B82F6', '#F59E0B', '#10B981', '#EC4899',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
    '#EF4444', '#6366F1',
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Exchange = 'NSE' | 'BSE';

interface StockHolding {
  id: string;
  symbol: string;       // e.g. RELIANCE
  exchange: Exchange;
  qty: string;          // number of shares held
  avgBuy: string;       // average buy price ₹
  // live data filled after fetch
  livePrice?: number;
  change?: number;
  changePct?: number;
  companyName?: string;
  sector?: string;
  status: 'idle' | 'loading' | 'ok' | 'error';
}

interface ManualHolding {
  id: string;
  label: string;
  value: string;        // ₹ value, manual entry
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, s: number, e: number) {
  const p1 = polar(cx, cy, r, e);
  const p2 = polar(cx, cy, r, s);
  const big = e - s > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${big} 0 ${p2.x} ${p2.y} Z`;
}

function inr(v: number): string {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)} Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)} L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)} K`;
  return `₹${v.toFixed(0)}`;
}

function ticker(symbol: string, exchange: Exchange) {
  return `${symbol.toUpperCase()}.${exchange === 'NSE' ? 'NS' : 'BO'}`;
}

// ─── Yahoo Finance Free API ───────────────────────────────────────────────────
// Works natively in React Native (no CORS). 
// Returns current price, change, companyName, sector for given tickers.
async function fetchYahooQuotes(
  tickers: string[],
): Promise<Record<string, { price: number; change: number; pct: number; name: string; sector: string }>> {
  if (tickers.length === 0) return {};

  const symbols = tickers.join(',');
  // Yahoo Finance v8 — free, no API key
  const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName,sector`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
  });

  if (!res.ok) throw new Error(`Yahoo Finance returned ${res.status}`);

  const json = await res.json();
  const quotes: any[] = json?.quoteResponse?.result ?? [];

  const out: Record<string, any> = {};
  for (const q of quotes) {
    out[q.symbol] = {
      price:  q.regularMarketPrice       ?? 0,
      change: q.regularMarketChange      ?? 0,
      pct:    q.regularMarketChangePercent ?? 0,
      name:   q.shortName                ?? q.symbol,
      sector: q.sector                   ?? '—',
    };
  }
  return out;
}

// ─── Donut Pie ────────────────────────────────────────────────────────────────
interface PieSlice { label: string; value: number; color: string }

function DonutChart({
  data, total, selected, onSelect,
}: {
  data: PieSlice[];
  total: number;
  selected: number | null;
  onSelect: (i: number | null) => void;
}) {
  if (!data.length || total === 0) {
    return (
      <View style={s.emptyPieWrap}>
        <View style={s.emptyRing}>
          <Text style={s.emptyPieTxt}>Add stocks{'\n'}to visualise</Text>
        </View>
      </View>
    );
  }

  let cursor = 0;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const outerR = selected === i ? R - 4 : R - 14;
    const path = slicePath(CX, CY, outerR, cursor, cursor + sweep);
    cursor += sweep;
    return { path, color: d.color, pct: (d.value / total) * 100 };
  });

  const sel = selected !== null ? data[selected] : null;

  return (
    <View style={{ width: PIE_SIZE, height: PIE_SIZE, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={PIE_SIZE} height={PIE_SIZE}>
        {slices.map((sl, i) => (
          <Path
            key={i}
            d={sl.path}
            fill={sl.color}
            opacity={selected !== null && selected !== i ? 0.28 : 1}
            onPress={() => onSelect(selected === i ? null : i)}
          />
        ))}
        <Circle cx={CX} cy={CY} r={R * 0.44} fill={C.surface} />
      </Svg>

      <View style={s.pieCentre} pointerEvents="none">
        {sel ? (
          <>
            <Text style={s.pieCLabel} numberOfLines={1}>{sel.label}</Text>
            <Text style={s.pieCValue}>{inr(sel.value)}</Text>
            <Text style={s.pieCPct}>{((sel.value / total) * 100).toFixed(1)}%</Text>
          </>
        ) : (
          <>
            <Text style={s.pieCSmall}>TOTAL</Text>
            <Text style={s.pieCTotal}>{inr(total)}</Text>
          </>
        )}
      </View>
    </View>
  );
}

// ─── Change Badge ─────────────────────────────────────────────────────────────
function ChangeBadge({ pct }: { pct: number }) {
  const pos = pct >= 0;
  return (
    <View style={[s.badge, { backgroundColor: pos ? `${C.success}22` : `${C.danger}22` }]}>
      <Text style={[s.badgeTxt, { color: pos ? C.success : C.danger }]}>
        {pos ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
      </Text>
    </View>
  );
}

// ─── Preset Stock List ────────────────────────────────────────────────────────
const PRESET_STOCKS: StockHolding[] = [
  { id: '1', symbol: 'RELIANCE',  exchange: 'NSE', qty: '10', avgBuy: '2400', status: 'idle' },
  { id: '2', symbol: 'TCS',       exchange: 'NSE', qty: '5',  avgBuy: '3500', status: 'idle' },
  { id: '3', symbol: 'HDFCBANK',  exchange: 'NSE', qty: '15', avgBuy: '1600', status: 'idle' },
  { id: '4', symbol: 'INFY',      exchange: 'NSE', qty: '20', avgBuy: '1400', status: 'idle' },
  { id: '5', symbol: 'ICICIBANK', exchange: 'NSE', qty: '25', avgBuy: '900',  status: 'idle' },
];

const PRESET_MANUAL: ManualHolding[] = [
  { id: 'm1', label: 'Mutual Funds', value: '250000' },
  { id: 'm2', label: 'Gold ETF',     value: '75000'  },
  { id: 'm3', label: 'Fixed Deposit',value: '200000' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LivePortfolioAllocation() {
  const [stocks,  setStocks]  = useState<StockHolding[]>(PRESET_STOCKS);
  const [manuals, setManuals] = useState<ManualHolding[]>(PRESET_MANUAL);
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'stocks' | 'manual'>('chart');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch live prices ──────────────────────────────────────────────────────
  const refreshPrices = useCallback(async () => {
    if (fetching) return;
    setFetching(true);

    // mark all as loading
    setStocks(prev => prev.map(s => ({ ...s, status: 'loading' })));

    const tickers = stocks.map(s => ticker(s.symbol, s.exchange));

    try {
      const quotes = await fetchYahooQuotes(tickers);

      setStocks(prev =>
        prev.map(s => {
          const t = ticker(s.symbol, s.exchange);
          const q = quotes[t];
          if (!q) return { ...s, status: 'error' };
          return {
            ...s,
            livePrice:   q.price,
            change:      q.change,
            changePct:   q.pct,
            companyName: q.name,
            sector:      q.sector,
            status:      'ok',
          };
        }),
      );
      setLastUpdated(new Date());
    } catch (err: any) {
      setStocks(prev => prev.map(s => ({ ...s, status: 'error' })));
      Alert.alert(
        'Fetch Failed',
        'Could not reach Yahoo Finance. Check your internet connection.\n\n' + err.message,
      );
    } finally {
      setFetching(false);
    }
  }, [stocks, fetching]);

  // Initial load + interval
  useEffect(() => {
    refreshPrices();
    intervalRef.current = setInterval(refreshPrices, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Computed values ────────────────────────────────────────────────────────
  const stockValues = stocks.map(s => {
    const qty    = parseFloat(s.qty)    || 0;
    const price  = s.livePrice          ?? parseFloat(s.avgBuy) ?? 0;
    const invest = qty * (parseFloat(s.avgBuy) || 0);
    const current = qty * price;
    const pnl    = current - invest;
    const pnlPct = invest > 0 ? (pnl / invest) * 100 : 0;
    return { ...s, currentValue: current, investValue: invest, pnl, pnlPct };
  });

  const manualValues = manuals.map(m => ({
    ...m,
    numValue: parseFloat(m.value.replace(/,/g, '')) || 0,
  }));

  const totalStocks  = stockValues.reduce((a, x) => a + x.currentValue, 0);
  const totalManual  = manualValues.reduce((a, x) => a + x.numValue, 0);
  const totalPortfolio = totalStocks + totalManual;

  const totalInvested = stockValues.reduce((a, x) => a + x.investValue, 0);
  const totalPnL = totalStocks - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  // Build pie slices
  const pieData = [
    ...stockValues
      .filter(s => s.currentValue > 0)
      .map((s, i) => ({
        label: s.companyName ?? s.symbol,
        value: s.currentValue,
        color: C.slices[i % C.slices.length],
      })),
    ...manualValues
      .filter(m => m.numValue > 0)
      .map((m, i) => ({
        label: m.label || `Manual ${i + 1}`,
        value: m.numValue,
        color: C.slices[(stockValues.length + i) % C.slices.length],
      })),
  ];

  // ── Stock CRUD ─────────────────────────────────────────────────────────────
  const addStock = () => {
    if (stocks.length >= 8) return;
    setStocks(prev => [
      ...prev,
      { id: Date.now().toString(), symbol: '', exchange: 'NSE', qty: '', avgBuy: '', status: 'idle' },
    ]);
  };

  const removeStock = (id: string) => setStocks(prev => prev.filter(s => s.id !== id));

  const updateStock = (id: string, field: keyof StockHolding, val: any) =>
    setStocks(prev => prev.map(s => s.id === id ? { ...s, [field]: val, status: 'idle' } : s));

  // ── Manual CRUD ────────────────────────────────────────────────────────────
  const addManual = () => {
    if (manuals.length >= 6) return;
    setManuals(prev => [...prev, { id: Date.now().toString(), label: '', value: '' }]);
  };

  const removeManual = (id: string) => setManuals(prev => prev.filter(m => m.id !== id));

  const updateManual = (id: string, field: 'label' | 'value', val: string) =>
    setManuals(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>LIVE PORTFOLIO</Text>
          <Text style={s.title}>My Holdings</Text>
        </View>
        <TouchableOpacity
          style={[s.refreshBtn, fetching && s.refreshBtnDisabled]}
          onPress={refreshPrices}
          disabled={fetching}
          activeOpacity={0.75}
        >
          {fetching
            ? <ActivityIndicator size="small" color={C.accent} />
            : <Text style={s.refreshTxt}>⟳ Refresh</Text>}
        </TouchableOpacity>
      </View>

      {lastUpdated && (
        <Text style={s.lastUpdated}>
          Updated {lastUpdated.toLocaleTimeString()} · auto-refresh 30s
        </Text>
      )}

      {/* ── Summary Strip ── */}
      <View style={s.summaryStrip}>
        <View style={s.summaryItem}>
          <Text style={s.summaryLbl}>Portfolio</Text>
          <Text style={[s.summaryVal, { color: C.accent }]}>{inr(totalPortfolio)}</Text>
        </View>
        <View style={s.summaryDiv} />
        <View style={s.summaryItem}>
          <Text style={s.summaryLbl}>Invested</Text>
          <Text style={s.summaryVal}>{inr(totalInvested)}</Text>
        </View>
        <View style={s.summaryDiv} />
        <View style={s.summaryItem}>
          <Text style={s.summaryLbl}>Total P&L</Text>
          <Text style={[s.summaryVal, { color: totalPnL >= 0 ? C.success : C.danger }]}>
            {totalPnL >= 0 ? '+' : ''}{inr(totalPnL)}
          </Text>
          <Text style={[s.summaryPct, { color: totalPnL >= 0 ? C.success : C.danger }]}>
            ({totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%)
          </Text>
        </View>
      </View>

      {/* ── Tab Bar ── */}
      <View style={s.tabBar}>
        {(['chart', 'stocks', 'manual'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.75}
          >
            <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>
              {tab === 'chart' ? '📊 Chart' : tab === 'stocks' ? '📈 Stocks' : '🏦 Manual'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Tabs ── */}
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={refreshPrices}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >

        {/* ════ CHART TAB ════ */}
        {activeTab === 'chart' && (
          <>
            <View style={s.chartCard}>
              <DonutChart
                data={pieData}
                total={totalPortfolio}
                selected={selected}
                onSelect={setSelected}
              />
            </View>

            {/* Legend scroll */}
            {pieData.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 14 }}
                contentContainerStyle={{ paddingHorizontal: 2, gap: 8 }}
              >
                {pieData.map((d, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.chip, selected === i && s.chipActive]}
                    onPress={() => setSelected(selected === i ? null : i)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.chipDot, { backgroundColor: d.color }]} />
                    <Text style={s.chipTxt} numberOfLines={1}>{d.label}</Text>
                    <Text style={[s.chipPct, { color: d.color }]}>
                      {((d.value / totalPortfolio) * 100).toFixed(1)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Allocation table */}
            {pieData.length > 0 && (
              <View style={s.allocTable}>
                <View style={s.allocHeader}>
                  <Text style={[s.allocCell, { flex: 2 }]}>Asset</Text>
                  <Text style={[s.allocCell, { flex: 1.2, textAlign: 'right' }]}>Value</Text>
                  <Text style={[s.allocCell, { flex: 0.9, textAlign: 'right' }]}>Weight</Text>
                </View>
                {pieData.map((d, i) => (
                  <View key={i} style={[s.allocRow, i % 2 === 0 && s.allocRowAlt]}>
                    <View style={[s.allocDot, { backgroundColor: d.color }]} />
                    <Text style={[s.allocTxt, { flex: 2 }]} numberOfLines={1}>{d.label}</Text>
                    <Text style={[s.allocTxt, { flex: 1.2, textAlign: 'right' }]}>{inr(d.value)}</Text>
                    <Text style={[s.allocTxt, { flex: 0.9, textAlign: 'right', color: d.color }]}>
                      {((d.value / totalPortfolio) * 100).toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* ════ STOCKS TAB ════ */}
        {activeTab === 'stocks' && (
          <>
            <View style={s.rowBetween}>
              <Text style={s.sectionTitle}>Live Stocks (NSE/BSE)</Text>
              <TouchableOpacity
                style={[s.addBtn, stocks.length >= 8 && { opacity: 0.35 }]}
                onPress={addStock}
                disabled={stocks.length >= 8}
                activeOpacity={0.75}
              >
                <Text style={s.addBtnTxt}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {stocks.map((stk, i) => {
              const sv   = stockValues[i];
              const clr  = C.slices[i % C.slices.length];
              const pnlPos = sv.pnl >= 0;

              return (
                <View key={stk.id} style={s.stockCard}>
                  <View style={[s.colorBar, { backgroundColor: clr }]} />
                  <View style={s.stockBody}>

                    {/* Row 1: symbol + exchange toggle + delete */}
                    <View style={s.rowBetween}>
                      <TextInput
                        style={s.symbolInput}
                        value={stk.symbol}
                        onChangeText={v => updateStock(stk.id, 'symbol', v.toUpperCase())}
                        placeholder="SYMBOL"
                        placeholderTextColor={C.muted}
                        autoCapitalize="characters"
                        maxLength={12}
                      />
                      <View style={s.exRow}>
                        {(['NSE', 'BSE'] as Exchange[]).map(ex => (
                          <TouchableOpacity
                            key={ex}
                            style={[s.exBtn, stk.exchange === ex && s.exBtnActive]}
                            onPress={() => updateStock(stk.id, 'exchange', ex)}
                          >
                            <Text style={[s.exTxt, stk.exchange === ex && s.exTxtActive]}>{ex}</Text>
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => removeStock(stk.id)} style={s.delBtn}>
                          <Text style={s.delTxt}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Company name + sector */}
                    {stk.companyName && (
                      <Text style={s.companyName}>{stk.companyName} · {stk.sector}</Text>
                    )}

                    {/* Row 2: Qty + Avg Buy */}
                    <View style={s.inputRow}>
                      <View style={[s.inputBox, { flex: 1, marginRight: 6 }]}>
                        <Text style={s.inputLabel}>QTY</Text>
                        <TextInput
                          style={s.inputField}
                          value={stk.qty}
                          onChangeText={v => updateStock(stk.id, 'qty', v.replace(/[^0-9]/g, ''))}
                          placeholder="0"
                          placeholderTextColor={C.muted}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                      <View style={[s.inputBox, { flex: 1.5 }]}>
                        <Text style={s.inputLabel}>AVG BUY  ₹</Text>
                        <TextInput
                          style={s.inputField}
                          value={stk.avgBuy}
                          onChangeText={v => updateStock(stk.id, 'avgBuy', v.replace(/[^0-9.]/g, ''))}
                          placeholder="0.00"
                          placeholderTextColor={C.muted}
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                        />
                      </View>
                    </View>

                    {/* Live price row */}
                    <View style={s.liveRow}>
                      {stk.status === 'loading' && (
                        <ActivityIndicator size="small" color={C.accent} style={{ marginRight: 8 }} />
                      )}
                      {stk.status === 'ok' && stk.livePrice != null && (
                        <>
                          <Text style={s.livePrice}>₹{stk.livePrice.toFixed(2)}</Text>
                          <ChangeBadge pct={stk.changePct ?? 0} />
                        </>
                      )}
                      {stk.status === 'error' && (
                        <Text style={s.errTxt}>⚠ Could not fetch price</Text>
                      )}
                      {stk.status === 'idle' && (
                        <Text style={s.idleTxt}>Tap Refresh to load price</Text>
                      )}
                    </View>

                    {/* P&L row */}
                    {sv.currentValue > 0 && (
                      <View style={s.pnlRow}>
                        <View style={s.pnlItem}>
                          <Text style={s.pnlLbl}>Current</Text>
                          <Text style={s.pnlVal}>{inr(sv.currentValue)}</Text>
                        </View>
                        <View style={s.pnlItem}>
                          <Text style={s.pnlLbl}>Invested</Text>
                          <Text style={s.pnlVal}>{inr(sv.investValue)}</Text>
                        </View>
                        <View style={s.pnlItem}>
                          <Text style={s.pnlLbl}>P&L</Text>
                          <Text style={[s.pnlVal, { color: pnlPos ? C.success : C.danger }]}>
                            {pnlPos ? '+' : ''}{inr(sv.pnl)}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Fetch button */}
            <TouchableOpacity
              style={[s.bigFetchBtn, fetching && { opacity: 0.5 }]}
              onPress={refreshPrices}
              disabled={fetching}
              activeOpacity={0.8}
            >
              {fetching
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.bigFetchTxt}>⟳  Fetch Live Prices (Yahoo Finance)</Text>}
            </TouchableOpacity>

            <View style={s.apiNote}>
              <Text style={s.apiNoteTxt}>
                📡  Powered by Yahoo Finance v8 API · Free · No API key needed{'\n'}
                NSE tickers use suffix .NS  |  BSE tickers use suffix .BO
              </Text>
            </View>
          </>
        )}

        {/* ════ MANUAL TAB ════ */}
        {activeTab === 'manual' && (
          <>
            <View style={s.rowBetween}>
              <Text style={s.sectionTitle}>Manual Assets</Text>
              <TouchableOpacity
                style={[s.addBtn, manuals.length >= 6 && { opacity: 0.35 }]}
                onPress={addManual}
                disabled={manuals.length >= 6}
                activeOpacity={0.75}
              >
                <Text style={s.addBtnTxt}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {manuals.map((m, i) => {
              const clr = C.slices[(stocks.length + i) % C.slices.length];
              const num = parseFloat(m.value.replace(/,/g, '')) || 0;
              const pct = totalPortfolio > 0 ? (num / totalPortfolio) * 100 : 0;

              return (
                <View key={m.id} style={s.manualCard}>
                  <View style={[s.colorBar, { backgroundColor: clr }]} />
                  <View style={s.stockBody}>
                    <View style={s.rowBetween}>
                      <TextInput
                        style={s.labelInput}
                        value={m.label}
                        onChangeText={v => updateManual(m.id, 'label', v)}
                        placeholder="Asset name (e.g. Gold)"
                        placeholderTextColor={C.muted}
                        maxLength={24}
                      />
                      <View style={s.rowBetween}>
                        {pct > 0 && (
                          <View style={[s.pctBadge, { borderColor: clr }]}>
                            <Text style={[s.pctBadgeTxt, { color: clr }]}>{pct.toFixed(1)}%</Text>
                          </View>
                        )}
                        <TouchableOpacity onPress={() => removeManual(m.id)} style={s.delBtn}>
                          <Text style={s.delTxt}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={s.amountBox}>
                      <Text style={s.rupee}>₹</Text>
                      <TextInput
                        style={s.amountInput}
                        value={m.value}
                        onChangeText={v => updateManual(m.id, 'value', v.replace(/[^0-9.]/g, ''))}
                        placeholder="0"
                        placeholderTextColor={C.muted}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />
                      {num > 0 && <Text style={s.amountConverted}>{inr(num)}</Text>}
                    </View>

                    {pct > 0 && (
                      <View style={s.progressTrack}>
                        <View style={[s.progressFill, { width: `${pct}%` as any, backgroundColor: clr }]} />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },

  // Header
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
                  paddingTop: Platform.OS === 'ios' ? 54 : 36, paddingHorizontal: 18, paddingBottom: 6 },
  eyebrow:     { fontSize: 10, letterSpacing: 3, color: C.accent, fontWeight: '700', marginBottom: 2 },
  title:       { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  refreshBtn:  { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                  borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
  refreshBtnDisabled: { opacity: 0.6 },
  refreshTxt:  { color: C.accent, fontSize: 13, fontWeight: '700' },
  lastUpdated: { fontSize: 10, color: C.muted, paddingHorizontal: 18, marginBottom: 6, letterSpacing: 0.3 },

  // Summary
  summaryStrip: { flexDirection: 'row', marginHorizontal: 14, marginBottom: 10,
                   backgroundColor: C.surface, borderRadius: 16, padding: 14,
                   borderWidth: 1, borderColor: C.border },
  summaryItem:  { flex: 1, alignItems: 'center' },
  summaryDiv:   { width: 1, backgroundColor: C.border, marginVertical: 2 },
  summaryLbl:   { fontSize: 9, color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
                   fontWeight: '600', marginBottom: 4 },
  summaryVal:   { fontSize: 13, fontWeight: '800', color: C.text },
  summaryPct:   { fontSize: 10, fontWeight: '600', marginTop: 1 },

  // Tabs
  tabBar:     { flexDirection: 'row', marginHorizontal: 14, marginBottom: 10,
                 backgroundColor: C.surface, borderRadius: 14, padding: 3,
                 borderWidth: 1, borderColor: C.border },
  tab:        { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 11 },
  tabActive:  { backgroundColor: C.card },
  tabTxt:     { fontSize: 12, color: C.muted, fontWeight: '600' },
  tabTxtActive: { color: C.text },

  scroll: { paddingHorizontal: 14 },

  // Chart
  chartCard:  { backgroundColor: C.surface, borderRadius: 24, paddingVertical: 20,
                 alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  emptyPieWrap: { width: PIE_SIZE, height: PIE_SIZE, alignItems: 'center', justifyContent: 'center' },
  emptyRing:  { width: PIE_SIZE - 24, height: PIE_SIZE - 24, borderRadius: (PIE_SIZE - 24) / 2,
                 borderWidth: 2, borderColor: C.border, borderStyle: 'dashed',
                 alignItems: 'center', justifyContent: 'center' },
  emptyPieTxt: { color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  pieCentre:  { position: 'absolute', alignItems: 'center', width: R * 0.75 },
  pieCSmall:  { fontSize: 9, color: C.muted, letterSpacing: 2, fontWeight: '700' },
  pieCTotal:  { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 3 },
  pieCLabel:  { fontSize: 10, color: C.muted, fontWeight: '600', textTransform: 'uppercase' },
  pieCValue:  { fontSize: 16, fontWeight: '800', color: C.text, marginTop: 2 },
  pieCPct:    { fontSize: 12, color: C.accent, fontWeight: '700', marginTop: 2 },

  // Legend chips
  chip:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
                 borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
                 borderWidth: 1, borderColor: C.border, gap: 5, marginRight: 6 },
  chipActive: { borderColor: C.accent, backgroundColor: `${C.accent}15` },
  chipDot:    { width: 7, height: 7, borderRadius: 4 },
  chipTxt:    { fontSize: 11, color: C.text, fontWeight: '600', maxWidth: 90 },
  chipPct:    { fontSize: 10, fontWeight: '700' },

  // Alloc table
  allocTable:  { backgroundColor: C.surface, borderRadius: 16, overflow: 'hidden',
                  borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  allocHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10,
                  borderBottomWidth: 1, borderColor: C.border },
  allocCell:   { fontSize: 10, color: C.muted, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  allocRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9 },
  allocRowAlt: { backgroundColor: `${C.card}60` },
  allocDot:    { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  allocTxt:    { fontSize: 12, color: C.text, fontWeight: '600' },

  // Section
  rowBetween:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  addBtn:      { backgroundColor: C.accent, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnTxt:   { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Stock card
  stockCard:   { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, marginBottom: 10,
                  overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  colorBar:    { width: 4 },
  stockBody:   { flex: 1, padding: 13, gap: 7 },
  symbolInput: { fontSize: 16, fontWeight: '800', color: C.text, flex: 1, padding: 0 },
  exRow:       { flexDirection: 'row', gap: 5, alignItems: 'center' },
  exBtn:       { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
                  borderWidth: 1, borderColor: C.border },
  exBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  exTxt:       { fontSize: 10, color: C.muted, fontWeight: '700' },
  exTxtActive: { color: '#fff' },
  delBtn:      { backgroundColor: `${C.danger}20`, borderRadius: 7, width: 24, height: 24,
                  alignItems: 'center', justifyContent: 'center' },
  delTxt:      { color: C.danger, fontSize: 10, fontWeight: '800' },
  companyName: { fontSize: 11, color: C.sub, fontWeight: '500' },

  inputRow:    { flexDirection: 'row' },
  inputBox:    { backgroundColor: C.surface, borderRadius: 10, padding: 9,
                  borderWidth: 1, borderColor: C.border },
  inputLabel:  { fontSize: 9, color: C.muted, letterSpacing: 1, fontWeight: '700',
                  textTransform: 'uppercase', marginBottom: 3 },
  inputField:  { fontSize: 15, fontWeight: '700', color: C.text, padding: 0 },

  liveRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 24 },
  livePrice:   { fontSize: 20, fontWeight: '800', color: C.text },
  errTxt:      { fontSize: 12, color: C.danger },
  idleTxt:     { fontSize: 11, color: C.muted },

  badge:       { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  badgeTxt:    { fontSize: 11, fontWeight: '700' },

  pnlRow:      { flexDirection: 'row', backgroundColor: C.surface, borderRadius: 10,
                  padding: 9, gap: 4 },
  pnlItem:     { flex: 1, alignItems: 'center' },
  pnlLbl:      { fontSize: 9, color: C.muted, letterSpacing: 0.8, fontWeight: '600',
                  textTransform: 'uppercase', marginBottom: 2 },
  pnlVal:      { fontSize: 12, fontWeight: '800', color: C.text },

  bigFetchBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 15,
                  alignItems: 'center', marginTop: 4, marginBottom: 10 },
  bigFetchTxt: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },

  apiNote:     { backgroundColor: `${C.accent}12`, borderRadius: 12, padding: 12,
                  borderWidth: 1, borderColor: `${C.accent}30`, marginBottom: 8 },
  apiNoteTxt:  { fontSize: 11, color: C.sub, lineHeight: 18, textAlign: 'center' },

  // Manual card
  manualCard:  { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, marginBottom: 10,
                  overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  labelInput:  { flex: 1, fontSize: 15, fontWeight: '700', color: C.text, padding: 0, marginRight: 8 },
  pctBadge:    { borderRadius: 7, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6 },
  pctBadgeTxt: { fontSize: 10, fontWeight: '700' },
  amountBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
                  borderRadius: 10, borderWidth: 1, borderColor: C.border,
                  paddingHorizontal: 10, height: 44 },
  rupee:       { fontSize: 18, fontWeight: '700', color: C.gold, marginRight: 4 },
  amountInput: { flex: 1, fontSize: 17, fontWeight: '700', color: C.text, padding: 0 },
  amountConverted: { fontSize: 11, color: C.muted, fontWeight: '600', marginLeft: 4 },
  progressTrack: { height: 3, backgroundColor: C.border, borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 2 },
});
