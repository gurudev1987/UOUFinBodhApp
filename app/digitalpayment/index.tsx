import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const DIGITAL_PAYMENT_TOPICS = [
  {
    id: 'banking-cards',
    name: 'Banking Cards',
    shortDesc: 'Credit, Debit & Travel Cards — secure 2-factor authentication',
    category: 'Payment Methods',
    categoryColor: '#1565C0',
    emoji: '💳',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'Banking cards include credit cards, debit cards, and travel cards. They are more secured, convenient and offer enormous flexibility. They provide 2-factor authentication i.e. secure PIN and OTP. RuPay, Visa, MasterCard are some examples.',
    highlights: [
      'Credit Cards, Debit Cards, Travel Cards available',
      'Secure PIN and OTP 2-factor authentication',
      'RuPay, Visa, MasterCard networks',
      'Contactless payments by tapping card',
      'Use in stores, internet and over telephone',
    ],
    eligibility: [
      'Valid bank account required',
      'KYC documents (Aadhaar, PAN)',
      'Minimum age 18 years',
    ],
    howToApply: [
      'Visit your bank branch or apply online',
      'Submit KYC documents',
      'Choose card type (credit/debit/travel)',
      'Card delivered within 7 working days',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'digital-wallets',
    name: 'Digital Wallets',
    shortDesc: 'Store cards digitally — pay via smartphone anytime',
    category: 'Payment Methods',
    categoryColor: '#6A1B9A',
    emoji: '👜',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    fullDesc: 'Digital Wallets are apps that store digital versions of credit/debit cards, allowing users to make payments through their smartphones. Examples include PayPal, Apple Pay, Google Pay, and Samsung Pay.',
    highlights: [
      'Store multiple cards digitally',
      'Pay via smartphone — no physical card needed',
      'Reduces fraud risk',
      'Examples: PayPal, Google Pay, Apple Pay, Samsung Pay',
      'Fast and convenient checkout',
    ],
    eligibility: [
      'Smartphone with internet connection',
      'Linked bank account or card',
      'Valid mobile number',
    ],
    howToApply: [
      'Download wallet app (Google Pay, PhonePe etc.)',
      'Register with mobile number',
      'Link your bank account or card',
      'Start making payments instantly',
    ],
    website: 'https://www.npci.org.in/',
  },
  {
    id: 'upi',
    name: 'UPI — Unified Payments Interface',
    shortDesc: 'Instant bank-to-bank transfers via mobile — most popular in India',
    category: 'Payment Methods',
    categoryColor: '#00838F',
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    fullDesc: 'UPI is an instant payment system developed by NPCI to facilitate inter-bank transactions through mobile phones. Launched in 2016, UPI accounts for 75% of total digital payments in India. Apps with UPI: PhonePe, Paytm, BHIM App, MobiKwik, Google Pay.',
    highlights: [
      'Instant 24x7 inter-bank transfer',
      'Accounts for 75% of digital payments in India',
      'Person to Person (P2P) and Person to Merchant (P2M)',
      'Single app for multiple bank accounts',
      'Apps: PhonePe, Paytm, BHIM, Google Pay',
    ],
    eligibility: [
      'Bank account with registered mobile number',
      'Smartphone with internet connection',
      'Debit card for first-time setup',
    ],
    howToApply: [
      'Download any UPI app (PhonePe, Google Pay, BHIM)',
      'Register with your mobile number',
      'Link your bank account',
      'Set UPI PIN using debit card details',
      'Start sending/receiving money instantly',
    ],
    website: 'https://www.npci.org.in/',
  },
  {
    id: 'mobile-banking',
    name: 'Mobile Banking',
    shortDesc: 'Full banking services on your phone — transfers, bills & more',
    category: 'Payment Methods',
    categoryColor: '#2E7D32',
    emoji: '🏦',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    fullDesc: 'Mobile banking refers to the use of a mobile device to access banking and financial services like transfer money, check balance, pay bills and conduct business transactions.',
    highlights: [
      'Transfer money anytime, anywhere',
      'Check account balance and mini statement',
      'Pay utility bills and recharges',
      'Secure with OTP and biometric login',
      'Available 24x7',
    ],
    eligibility: [
      'Active bank account',
      'Registered mobile number with bank',
      'Smartphone with internet',
    ],
    howToApply: [
      'Download your bank\'s official app',
      'Register using account number and debit card',
      'Set MPIN for secure login',
      'Start using all banking services',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'qr-code',
    name: 'QR Code Payments',
    shortDesc: 'Scan & pay — quick checkout for customers and merchants',
    category: 'Payment Methods',
    categoryColor: '#E65100',
    emoji: '📷',
    image: 'https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?w=800',
    fullDesc: 'QR Code payments involve scanning QR codes with a mobile device to make payments. Merchants display their QR codes, and customers scan them using their mobile wallets or banking apps.',
    highlights: [
      'Scan merchant QR code to pay instantly',
      'No need to enter account details',
      'Works with all UPI and wallet apps',
      'Safe and contactless payment',
      'Used widely at shops, restaurants, markets',
    ],
    eligibility: [
      'Smartphone with camera',
      'Any UPI or wallet app installed',
    ],
    howToApply: [
      'Open any UPI app',
      'Tap "Scan QR" option',
      'Scan the merchant\'s QR code',
      'Enter amount and confirm payment',
    ],
    website: 'https://www.npci.org.in/',
  },
  {
    id: 'neft-rtgs-imps',
    name: 'NEFT / RTGS / IMPS',
    shortDesc: 'Internet banking fund transfers — from ₹1 to unlimited',
    category: 'Internet Banking',
    categoryColor: '#4527A0',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    fullDesc: 'NEFT, RTGS and IMPS are internet banking fund transfer systems. NEFT works within 1-2 hours, RTGS is for large amounts (min ₹2 lakh) in real time, and IMPS is instant 24x7 transfer.',
    highlights: [
      'NEFT: Min ₹1, within 1-2 hours, 24x7',
      'RTGS: Min ₹2 lakh, real-time, for large transfers',
      'IMPS: Min ₹1, instant within seconds, 24x7',
      'All available online and offline',
      'Secure and RBI regulated',
    ],
    eligibility: [
      'Internet banking account',
      'Beneficiary bank account details (IFSC code)',
    ],
    howToApply: [
      'Login to your internet banking',
      'Go to Fund Transfer section',
      'Add beneficiary with account number and IFSC',
      'Choose NEFT/RTGS/IMPS as per need',
      'Enter amount and confirm with OTP',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'ussd',
    name: 'USSD — *99# Service',
    shortDesc: 'Mobile banking without internet — dial *99# on any phone',
    category: 'Internet Banking',
    categoryColor: '#558B2F',
    emoji: '📞',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    fullDesc: 'USSD was launched for people without internet access. Mobile banking transactions are possible without internet by dialing *99# on any basic feature phone across all telecom service providers.',
    highlights: [
      'Works WITHOUT internet connection',
      'Dial *99# on any GSM phone',
      'Works across all telecom providers',
      'Fund transfer, balance enquiry, mini statement',
      'Available 24x7 including holidays',
    ],
    eligibility: [
      'Any mobile phone (smartphone or basic phone)',
      'Bank account with registered mobile number',
      'No internet required',
    ],
    howToApply: [
      'Dial *99# from your registered mobile number',
      'Select your bank from the menu',
      'Choose service (transfer/balance/statement)',
      'Follow on-screen instructions',
    ],
    website: 'https://www.npci.org.in/',
  },
  {
    id: 'pos',
    name: 'POS Terminal',
    shortDesc: 'Swipe or tap card at checkout counters in shops & malls',
    category: 'Payment Methods',
    categoryColor: '#795548',
    emoji: '🖥️',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
    fullDesc: 'POS (Point of Sale) Terminals are at checkout counters in malls, stores and complexes. Customers pay with debit and credit cards by swiping their cards and entering their PINs.',
    highlights: [
      'Available at all major shops, malls, restaurants',
      'Pay by swiping or tapping card',
      'Secure PIN entry required',
      'Instant payment confirmation',
      'Contactless NFC payments supported',
    ],
    eligibility: [
      'Any debit or credit card holder',
    ],
    howToApply: [
      'Present your card at the POS terminal',
      'Swipe or tap your card',
      'Enter your PIN',
      'Collect receipt as payment confirmation',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'cybercrime',
    name: 'Cyber Crime & Safety',
    shortDesc: 'Protect yourself from online fraud, hacking & identity theft',
    category: 'Cyber Safety',
    categoryColor: '#C62828',
    emoji: '🔐',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    fullDesc: 'Cyber crime involves crimes using computers and networks including identity theft, hacking, cyber bullying, and cyber terrorism. 90% of cyber attacks are caused by human negligence, so awareness is key.',
    highlights: [
      'Never click suspicious links or attachments',
      'Keep software and apps always updated',
      'Use complex alphanumeric passwords',
      'Avoid public Wi-Fi for banking',
      'Never share OTP, PIN or personal info',
    ],
    eligibility: [
      'Applicable to all digital payment users',
    ],
    howToApply: [
      'Report cyber crime at cybercrime.gov.in',
      'Call helpline 1930 for cyber fraud',
      'Block card immediately if lost or stolen',
      'Inform bank within 3 days of unauthorized transaction',
    ],
    website: 'https://cybercrime.gov.in/',
  },
];

export default function DigitalPaymentScreen() {
  const router = useRouter();

  const categories = ['Payment Methods', 'Internet Banking', 'Cyber Safety'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Digital Payments</Text>
      <Text style={styles.subheading}>{DIGITAL_PAYMENT_TOPICS.length} topics covered</Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={styles.categoryHeader}>{cat}</Text>
          {DIGITAL_PAYMENT_TOPICS.filter((t) => t.category === cat).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/digital payement/${topic.id}` as any)}
            >
              <View style={[styles.iconStrip, { backgroundColor: topic.categoryColor }]}>
                <Text style={styles.iconText}>{topic.emoji}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{topic.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{topic.shortDesc}</Text>
                <View style={[styles.badge, { backgroundColor: topic.categoryColor + '22' }]}>
                  <Text style={[styles.badgeText, { color: topic.categoryColor }]}>{topic.category}</Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  subheading: { fontSize: 13, color: '#888', marginBottom: 18 },
  categoryHeader: {
    fontSize: 16, fontWeight: '800', color: '#1A1A2E',
    marginTop: 16, marginBottom: 8, paddingLeft: 4,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, marginBottom: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 3, minHeight: 80,
  },
  iconStrip: { width: 56, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 24 },
  cardContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  cardTitle: { fontSize: 13.5, fontWeight: '700', color: '#1A1A2E', marginBottom: 4, lineHeight: 19 },
  cardDesc: { fontSize: 12, color: '#666', lineHeight: 17, marginBottom: 7 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10.5, fontWeight: '600' },
  arrow: { fontSize: 26, color: '#CCC', paddingRight: 14 },
});