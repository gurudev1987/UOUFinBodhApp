/**
 * PieChartApp.tsx
 * Hybrid React Native app — iOS & Windows (React Native for Windows)
 *
 * Dependencies:
 *   npm install react-native-svg
 *   (iOS)     cd ios && pod install
 *   (Windows) npx react-native-windows-init --overwrite  (if not done yet)
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  G,
} from "react-native-svg";

/* ─── constants ─────────────────────────────────────────── */

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA","#FF6B6B", "#4ECDC4"] as const;
const LABELS = ["Equity (Indian)", "Equity (International)", "Debt (PPF/EPF/Debt Funds)", "Gold","Real Estate / REITs","Cash / Emergency Fund"] as const;
const INITIAL = [40, 25, 20, 15,0,0];

/* ─── types ──────────────────────────────────────────────── */

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface SliceData {
  seg: Segment;
  path: string;
  labelX: number;
  labelY: number;
  pct: number;
}

/* ─── PieChart component ─────────────────────────────────── */

function buildSlices(segments: Segment[], total: number): SliceData[] {
  const cx = 110,
    cy = 110,
    r = 90;
  let cumAngle = -90;

  return segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const pct = seg.value / total;
      const startAngle = cumAngle;
      const endAngle = cumAngle + pct * 360;
      cumAngle = endAngle;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const x1 = cx + r * Math.cos(toRad(startAngle));
      const y1 = cy + r * Math.sin(toRad(startAngle));
      const x2 = cx + r * Math.cos(toRad(endAngle));
      const y2 = cy + r * Math.sin(toRad(endAngle));
      const largeArc = pct > 0.5 ? 1 : 0;

      const midRad = toRad((startAngle + endAngle) / 2);
      const labelR = r * 0.63;
      const labelX = cx + labelR * Math.cos(midRad);
      const labelY = cy + labelR * Math.sin(midRad);

      return {
        seg,
        path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`,
        labelX,
        labelY,
        pct,
      };
    });
}

function PieChart({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const SIZE = 220;
  const cx = SIZE / 2,
    cy = SIZE / 2;

  if (total === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>Enter values{"\n"}to generate chart</Text>
      </View>
    );
  }

  const slices = buildSlices(segments, total);

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Defs>
        <RadialGradient id="bg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#2a2a5e" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#0d0d1a" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Slices */}
      {slices.map(({ seg, path, labelX, labelY, pct }, i) => (
        <G key={i}>
          <Path
            d={path}
            fill={seg.color}
            stroke="#1a1a2e"
            strokeWidth={2.5}
          />
          {pct > 0.07 && (
            <SvgText
              x={labelX}
              y={labelY}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#1a1a2e"
              fontSize={11}
              fontWeight="bold"
            >
              {Math.round(pct * 100)}%
            </SvgText>
          )}
        </G>
      ))}

      {/* Donut hole */}
      <Circle cx={cx} cy={cy} r={34} fill="#1a1a2e" stroke="#2a2a4e" strokeWidth={3} />
      <SvgText
        x={cx}
        y={cy - 7}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="#7777aa"
        fontSize={9}
        fontWeight="600"
      >
        TOTAL
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="#ffffff"
        fontSize={15}
        fontWeight="bold"
      >
        {total}
      </SvgText>
    </Svg>
  );
}

/* ─── Main App ───────────────────────────────────────────── */

export default function App() {
  const [rawValues, setRawValues] = useState<string[]>(
    INITIAL.map(String)
  );

  const segments: Segment[] = LABELS.map((label, i) => ({
    label,
    value: Math.max(0, parseFloat(rawValues[i]) || 0),
    color: COLORS[i],
  }));

  const total = segments.reduce((s, seg) => s + seg.value, 0);

  const handleChange = (i: number, text: string) => {
    const next = [...rawValues];
    next[i] = text.replace(/[^0-9.]/g, "");
    setRawValues(next);
  };

  const reset = () => setRawValues(["", "", "", ""]);

  // Focus refs for sequential tab-through
  const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PERSONALISED ASSET ALLOCATION (INDIA)</Text>
          <Text style={styles.subtitle}>Enter values · Chart updates live</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* Inputs */}
          <View style={styles.inputsSection}>
            {segments.map((seg, i) => (
              <View
                key={i}
                style={[styles.inputRow, { borderColor: seg.color + "55" }]}
              >
                {/* Color dot */}
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: seg.color,
                      shadowColor: seg.color,
                    },
                  ]}
                />
                <Text style={styles.inputLabel}>{seg.label}</Text>
                <TextInput
                  ref={(r) => (inputRefs.current[i] = r)}
                  style={styles.input}
                  value={rawValues[i]}
                  onChangeText={(t) => handleChange(i, t)}
                  placeholder="0"
                  placeholderTextColor="#444466"
                  keyboardType="numeric"
                  returnKeyType={i < 3 ? "next" : "done"}
                  onSubmitEditing={() =>
                    i < 3 ? inputRefs.current[i + 1]?.focus() : undefined
                  }
                  selectionColor={seg.color}
                />
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Chart */}
          <View style={styles.chartSection}>
            <PieChart segments={segments} />
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {segments.map((seg, i) => (
              <View key={i} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: seg.color, shadowColor: seg.color },
                  ]}
                />
                <Text style={styles.legendLabel}>{seg.label}</Text>
                <Text style={[styles.legendPct, { color: seg.color }]}>
                  {total > 0
                    ? Math.round((seg.value / total) * 100) + "%"
                    : "—"}
                </Text>
              </View>
            ))}
          </View>

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>

          {/* Reset */}
          <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.7}>
            <Text style={styles.resetText}>↺  RESET ALL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: "#0d0d1a",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 4,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  subtitle: {
    color: "#555588",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 6,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },

  /* Card */
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 20,
  },

  /* Inputs */
  inputsSection: {
    gap: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  inputLabel: {
    flex: 1,
    color: "#9999bb",
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginVertical: 22,
  },

  /* Chart */
  chartSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  emptyChart: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#444466",
    fontSize: 13,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    lineHeight: 20,
  },

  /* Legend */
  legend: {
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  legendLabel: {
    flex: 1,
    color: "#aaaacc",
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  legendPct: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    minWidth: 38,
    textAlign: "right",
  },

  /* Total */
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
    marginTop: 14,
    paddingTop: 14,
  },
  totalLabel: {
    color: "#555588",
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  totalValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },

  /* Reset */
  resetBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  resetText: {
    color: "#555588",
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
});
