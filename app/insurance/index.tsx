import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const INSURANCE_TOPICS = [
  {
    id: 'term',
    name: 'Term Insurance',
    shortDesc: 'Pure protection plan — low premium, high coverage',
    category: 'Life Insurance',
    categoryColor: '#1565C0',
    emoji: '🛡️',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    fullDesc: 'Term Insurance is the pure protection plan that provides high coverage at low premium. The family receives money only if death occurs during the policy term. There is no maturity benefit.',
    highlights: [
      'Low premium, high coverage',
      'No maturity benefit',
      'Family receives money only if death occurs during policy term',
      'Best for income replacement',
    ],
    eligibility: [
      'Any earning individual',
      'Age typically 18 to 65 years',
      'Medical check-up may be required',
    ],
    howToApply: [
      'Compare plans on policybazaar.com or insurer website',
      'Choose coverage amount (e.g. ₹50 lakh or ₹1 crore)',
      'Fill application and undergo medical check-up if needed',
      'Pay first premium to activate policy',
    ],
    website: 'https://www.licindia.in/',
  },
  {
    id: 'wholelife',
    name: 'Whole Life Insurance',
    shortDesc: 'Lifetime coverage up to 99–100 years with savings component',
    category: 'Life Insurance',
    categoryColor: '#1565C0',
    emoji: '📋',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    fullDesc: 'Whole Life Insurance provides coverage for almost the entire lifetime up to 99-100 years. It includes a savings component and helps in wealth transfer to the next generation.',
    highlights: [
      'Long-term life cover (up to 99-100 years)',
      'Includes savings component',
      'Helps in wealth transfer to next generation',
      'Higher premium than term insurance',
    ],
    eligibility: [
      'Age 18 to 60 years at entry',
      'Medical check-up required',
    ],
    howToApply: [
      'Visit LIC branch or authorized agent',
      'Fill proposal form',
      'Submit identity and medical documents',
      'Pay first premium',
    ],
    website: 'https://www.licindia.in/',
  },
  {
    id: 'endowment',
    name: 'Endowment Policy',
    shortDesc: 'Insurance + savings — get lump sum at maturity',
    category: 'Life Insurance',
    categoryColor: '#1565C0',
    emoji: '💰',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    fullDesc: 'Endowment Policy is a combination of insurance and savings. It provides life cover plus a guaranteed maturity benefit after the policy term ends.',
    highlights: [
      'Life cover + maturity benefit',
      'Guaranteed payout after policy term',
      'Lower risk investment',
      'Tax benefits under Section 80C',
    ],
    eligibility: [
      'Age 18 to 60 years',
      'Indian resident',
    ],
    howToApply: [
      'Visit LIC or private insurer branch',
      'Choose policy term (e.g. 15 or 20 years)',
      'Pay premium for chosen term',
      'Get lump sum at maturity',
    ],
    website: 'https://www.licindia.in/',
  },
  {
    id: 'moneyback',
    name: 'Money Back Plans',
    shortDesc: 'Regular payouts during policy term for planned expenses',
    category: 'Life Insurance',
    categoryColor: '#1565C0',
    emoji: '💵',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    fullDesc: 'Money Back Plans provide periodic survival benefits during the policy term. Life cover continues even after payouts, making it useful for planned expenses like education or marriage.',
    highlights: [
      'Periodic survival benefits during term',
      'Life cover continues even after payouts',
      'Useful for planned expenses like education',
      'Guaranteed returns',
    ],
    eligibility: [
      'Age 13 to 55 years',
      'Indian resident',
    ],
    howToApply: [
      'Contact LIC agent or visit branch',
      'Choose suitable money back plan',
      'Pay regular premiums',
      'Receive periodic payouts as per plan',
    ],
    website: 'https://www.licindia.in/',
  },
  {
    id: 'children',
    name: 'Children Policies',
    shortDesc: "Secure your child's future for education and marriage",
    category: 'Life Insurance',
    categoryColor: '#AD1457',
    emoji: '👧',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    fullDesc: "Children Policies are designed for a child's future financial needs. The parent is the insured person and many plans include a premium waiver benefit in case of parent's death.",
    highlights: [
      "Funds for child's education or marriage",
      'Parent is the insured person',
      'Premium waiver benefit in many plans',
      'Policy continues even if parent dies',
    ],
    eligibility: [
      'Child age 0 to 17 years',
      'Parent as proposer',
    ],
    howToApply: [
      'Visit LIC or private insurer',
      'Submit child birth certificate and parent ID',
      'Choose coverage amount',
      'Pay regular premiums',
    ],
    website: 'https://www.licindia.in/',
  },
  {
    id: 'ulip',
    name: 'ULIP — Unit Linked Insurance Policy',
    shortDesc: 'Insurance + market-linked investment for long-term growth',
    category: 'Life Insurance',
    categoryColor: '#E65100',
    emoji: '📈',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    fullDesc: 'ULIP is a combination of insurance and market-linked investment. Money is invested in equity or debt funds giving potential for higher returns, but market risk is involved.',
    highlights: [
      'Insurance + investment in one product',
      'Money invested in equity/debt funds',
      'Potential for higher returns',
      'Market risk involved',
      'Suitable for long-term investors',
    ],
    eligibility: [
      'Age 18 to 65 years',
      'Long-term investment mindset needed',
    ],
    howToApply: [
      'Visit any private insurer or bank',
      'Choose fund type (equity/debt/balanced)',
      'Pay premium — part goes to insurance, part to investment',
      'Monitor fund performance regularly',
    ],
    website: 'https://www.irdai.gov.in/',
  },
  {
    id: 'health',
    name: 'Health Insurance',
    shortDesc: 'Cover hospital & treatment expenses — cashless facility',
    category: 'General Insurance',
    categoryColor: '#2E7D32',
    emoji: '🏥',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    fullDesc: 'Health Insurance covers hospital and treatment expenses. It provides cashless treatment at network hospitals and covers surgery, medicines, and hospitalization costs.',
    highlights: [
      'Cashless treatment at network hospitals',
      'Covers surgery, medicines, hospitalization',
      'Avoids financial burden during emergencies',
      'Family floater plans available',
    ],
    eligibility: [
      'Any individual or family',
      'Age 18 to 65 years (varies by plan)',
      'Medical check-up may be required for senior citizens',
    ],
    howToApply: [
      'Compare plans on policybazaar.com',
      'Choose individual or family floater plan',
      'Fill online form and pay premium',
      'Get policy document and health card',
    ],
    website: 'https://www.irdai.gov.in/',
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    shortDesc: 'Mandatory protection for cars, bikes & commercial vehicles',
    category: 'General Insurance',
    categoryColor: '#00838F',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    fullDesc: 'Motor Insurance provides protection for vehicles like cars, bikes, and commercial vehicles. Third-party insurance is mandatory by law. Comprehensive insurance covers both own damage and third party.',
    highlights: [
      'Third-party insurance mandatory by law',
      'Comprehensive plan covers own damage + third party',
      'Covers accident, theft, fire, natural disaster',
      'Cashless repair at network garages',
    ],
    eligibility: [
      'Any vehicle owner',
      'Valid driving licence required',
    ],
    howToApply: [
      'Visit insurer website or agent',
      'Enter vehicle registration number',
      'Choose third-party or comprehensive plan',
      'Pay premium and download policy',
    ],
    website: 'https://www.irdai.gov.in/',
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    shortDesc: 'Protection for medical emergencies & trip cancellation abroad',
    category: 'General Insurance',
    categoryColor: '#4527A0',
    emoji: '✈️',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    fullDesc: 'Travel Insurance protects against travel-related risks including medical emergencies abroad, trip cancellation, loss of baggage, and flight delays.',
    highlights: [
      'Medical emergencies abroad covered',
      'Trip cancellation compensation',
      'Loss of baggage covered',
      'Flight delay compensation',
    ],
    eligibility: [
      'Any traveller — domestic or international',
      'Age 1 day to 70 years (varies)',
    ],
    howToApply: [
      'Buy online before your trip starts',
      'Enter travel dates and destination',
      'Choose coverage amount',
      'Pay premium and get instant policy',
    ],
    website: 'https://www.irdai.gov.in/',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana (PMSBY)',
    shortDesc: 'Accident insurance at just ₹20/year — government scheme',
    category: 'Government Scheme',
    categoryColor: '#558B2F',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    fullDesc: 'Pradhan Mantri Suraksha Bima Yojana is a government accident insurance scheme with very low premium of around ₹20 per year. It covers accidental death and disability for age group 18-70 years.',
    highlights: [
      'Very low premium — only ₹20 per year',
      'Covers accidental death and disability',
      'Age eligibility: 18–70 years',
      'Linked with bank account — auto debit',
      '₹2 lakh cover on accidental death',
    ],
    eligibility: [
      'Age 18 to 70 years',
      'Must have a savings bank account',
      'Aadhaar linked to bank account preferred',
    ],
    howToApply: [
      'Visit your bank branch',
      'Fill PMSBY enrollment form',
      'Premium of ₹20 will be auto-debited annually',
    ],
    website: 'https://financialservices.gov.in/',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    shortDesc: 'Life cover of ₹2 lakh at ₹436/year — government scheme',
    category: 'Government Scheme',
    categoryColor: '#558B2F',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    fullDesc: "Pradhan Mantri Jeevan Jyoti Bima Yojana is a government life insurance scheme providing ₹2 lakh cover to the nominee in case of the subscriber's death at very affordable premium.",
    highlights: [
      'Life cover of ₹2 lakh on death',
      'Annual premium of only ₹436',
      'Age eligibility: 18–50 years',
      'Premium auto-debited from bank account',
      'Renewable every year',
    ],
    eligibility: [
      'Age 18 to 50 years',
      'Must have a savings bank account',
    ],
    howToApply: [
      'Visit your bank branch',
      'Fill PMJJBY enrollment form',
      'Premium of ₹436 will be auto-debited annually',
    ],
    website: 'https://financialservices.gov.in/',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PMJAY)',
    shortDesc: '₹5 lakh health cover per family — free for poor families',
    category: 'Government Scheme',
    categoryColor: '#558B2F',
    emoji: '🏥',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    fullDesc: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana provides up to ₹5 lakh health cover per family per year for hospitalization expenses. It supports poor families during major medical emergencies with cashless treatment.',
    highlights: [
      'Up to ₹5 lakh health cover per family per year',
      'Cashless treatment at empanelled hospitals',
      'Covers hospitalization expenses',
      'Free for poor and vulnerable families',
      '10+ crore families covered',
    ],
    eligibility: [
      'Families listed in SECC 2011 database',
      'Below poverty line families',
      'Check eligibility at pmjay.gov.in',
    ],
    howToApply: [
      'Check eligibility at pmjay.gov.in',
      'Visit nearest Common Service Centre (CSC)',
      'Get Ayushman card made',
      'Use card for cashless treatment at empanelled hospitals',
    ],
    website: 'https://pmjay.gov.in/',
  },
];

export default function InsuranceScreen() {
  const router = useRouter();

  const categories = ['Life Insurance', 'General Insurance', 'Government Scheme'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Insurance</Text>
      <Text style={styles.subheading}>{INSURANCE_TOPICS.length} insurance types & schemes</Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={styles.categoryHeader}>{cat}</Text>
          {INSURANCE_TOPICS.filter((t) => t.category === cat).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/insurance/${topic.id}` as any)}
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