import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerBg}
      contentContainerStyle={{ flex: 1 }}
    >
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoBox}>
          <Ionicons name="calculator" size={28} color="#00d4ff" />
        </View>
        <Text style={styles.appName}>UOU FINBODH</Text>
        <Text style={styles.appTagline}>Uttarakhand Open University Fin Bodh App</Text>
      </View>

      <View style={styles.divider} />

      <DrawerItemList {...props} />

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>v1.0.0 · CalcSuite</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          drawerActiveTintColor: '#00d4ff',
          drawerInactiveTintColor: '#6b7280',
          drawerActiveBackgroundColor: '#00d4ff18',
          drawerStyle: {
            backgroundColor: '#0a0e1a',
            width: 270,
          },
          drawerLabelStyle: {
            fontSize: 15,
            fontWeight: '700',
            marginLeft: -8,
          },
          headerStyle: { backgroundColor: '#0d1117' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={26} color="#00d4ff" />
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculators/index"
          options={{
            title: 'Calculators',
            drawerLabel: 'Calculators',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calculator-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="contents/index"
          options={{
            title: 'Contents',
            drawerLabel: 'Contents',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        {/* Hide detail screens from drawer */}
        <Drawer.Screen
          name="calculators/basic"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Basic Calculator' }}
        />
        <Drawer.Screen
          name="calculators/bmi"
          options={{ drawerItemStyle: { display: 'none' }, title: 'BMI Calculator' }}
        />
        <Drawer.Screen
          name="calculators/age"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Age Calculator' }}
        />
        <Drawer.Screen
          name="calculators/percentage"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Percentage Calculator' }}
        />
        <Drawer.Screen
          name="calculators/currency"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Currency Converter' }}
        />
        <Drawer.Screen
          name="calculators/loan"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Loan Calculator' }}
        />
        <Drawer.Screen
          name="calculators/SimpleInterestCalculators"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Simple Interest Calculator' }}
        />
        <Drawer.Screen
          name="calculators/compound-interest"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Compound Interest Calculator' }}
        />
        <Drawer.Screen
          name="calculators/sip"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Systematic Investment Plan' }}
        />
        <Drawer.Screen
          name="calculators/FICalculator"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Financial Independence Calculator' }}
        />
        <Drawer.Screen
          name="calculators/StepUpSIP"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Step-Up SIP Calculator' }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerBg: { backgroundColor: '#0a0e1a' },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00d4ff18',
    borderWidth: 1,
    borderColor: '#00d4ff44',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  appTagline: { fontSize: 12, color: '#4b5563', marginTop: 3 },
  divider: {
    height: 1,
    backgroundColor: '#1a2035',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  drawerFooter: {
    padding: 20,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#1a2035',
  },
  footerText: { fontSize: 12, color: '#2d3748' },
});
