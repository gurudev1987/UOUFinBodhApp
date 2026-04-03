import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const buttons = [
  ['C', '+/-', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

const isOperator = (val: string) => ['÷', '×', '−', '+', '='].includes(val);
const isSpecial = (val: string) => ['C', '+/-', '%', '⌫'].includes(val);

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [operator, setOperator] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setExpression('');
      setPrevValue('');
      setOperator('');
      setShouldReset(false);
      return;
    }

    if (val === '⌫') {
      if (display.length > 1) setDisplay(display.slice(0, -1));
      else setDisplay('0');
      return;
    }

    if (val === '+/-') {
      setDisplay((parseFloat(display) * -1).toString());
      return;
    }

    if (val === '%') {
      setDisplay((parseFloat(display) / 100).toString());
      return;
    }

    if (isOperator(val) && val !== '=') {
      setPrevValue(display);
      setOperator(val);
      setExpression(`${display} ${val}`);
      setShouldReset(true);
      return;
    }

    if (val === '=') {
      if (!operator || !prevValue) return;
      const a = parseFloat(prevValue);
      const b = parseFloat(display);
      let result = 0;
      if (operator === '+') result = a + b;
      if (operator === '−') result = a - b;
      if (operator === '×') result = a * b;
      if (operator === '÷') result = b !== 0 ? a / b : 0;
      const resultStr = parseFloat(result.toFixed(10)).toString();
      setExpression(`${prevValue} ${operator} ${display} =`);
      setDisplay(resultStr);
      setPrevValue('');
      setOperator('');
      setShouldReset(true);
      return;
    }

    if (val === '.' && display.includes('.')) return;

    if (shouldReset) {
      setDisplay(val === '.' ? '0.' : val);
      setShouldReset(false);
    } else {
      setDisplay(display === '0' && val !== '.' ? val : display + val);
    }
  };

  const getBtnStyle = (val: string) => {
    if (val === '=') return [styles.btn, styles.btnEqual];
    if (isOperator(val)) return [styles.btn, styles.btnOperator];
    if (isSpecial(val)) return [styles.btn, styles.btnSpecial];
    return [styles.btn, styles.btnNumber];
  };

  const getBtnTextStyle = (val: string) => {
    if (val === '=') return [styles.btnText, styles.btnTextEqual];
    if (isOperator(val)) return [styles.btnText, styles.btnTextOperator];
    if (isSpecial(val)) return [styles.btnText, styles.btnTextSpecial];
    return [styles.btnText];
  };

  return (
    <View style={styles.container}>
      {/* Display */}
      <View style={styles.displayArea}>
        <Text style={styles.expression} numberOfLines={1}>{expression || ' '}</Text>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.pad}>
        {buttons.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={getBtnStyle(btn)}
                onPress={() => handlePress(btn)}
                activeOpacity={0.7}
              >
                <Text style={getBtnTextStyle(btn)}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  displayArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#0d1117',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2035',
  },
  expression: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'right',
    marginBottom: 8,
  },
  display: {
    fontSize: 64,
    fontWeight: '300',
    color: '#f9fafb',
    textAlign: 'right',
    letterSpacing: -2,
  },
  pad: {
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNumber: { backgroundColor: '#131929' },
  btnOperator: { backgroundColor: '#00d4ff20', borderWidth: 1, borderColor: '#00d4ff40' },
  btnSpecial: { backgroundColor: '#1e2a3a' },
  btnEqual: { backgroundColor: '#00d4ff' },
  btnText: { fontSize: 24, fontWeight: '600', color: '#e5e7eb' },
  btnTextOperator: { color: '#00d4ff', fontWeight: '700' },
  btnTextSpecial: { color: '#9ca3af' },
  btnTextEqual: { color: '#0a0e1a', fontWeight: '800' },
});
