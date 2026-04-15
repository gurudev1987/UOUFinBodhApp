import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const SCHEMES = [
  {
    id: 'pmjdy',
    name: 'PM Jan Dhan Yojana (PMJDY)',
    shortDesc: 'Zero-balance bank account with RuPay card & insurance cover',
    category: 'Banking',
    categoryColor: '#1565C0',
    emoji: '🏦',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'Pradhan Mantri Jan Dhan Yojana is a financial inclusion scheme to provide banking access to every household in India. It helps reduce corruption through Direct Benefit Transfer.',
    highlights: [
      'Zero-balance savings bank account',
      'RuPay debit card provided free',
      'Accident insurance cover of ₹2 lakh',
      'Life insurance cover of ₹30,000 for eligible accounts',
      'Direct Benefit Transfer — pension & scholarships directly to account',
    ],
    eligibility: [
      'Any Indian citizen',
      'No minimum balance required',
      'Valid ID proof needed (Aadhaar / Voter ID)',
    ],
    howToApply: [
      'Visit your nearest bank branch',
      'Fill the account opening form',
      'Submit Aadhaar card and passport photo',
      'Get your RuPay card within 7 days',
    ],
    website: 'https://www.pmjdy.gov.in/',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana (PMSBY)',
    shortDesc: 'Accident insurance cover of ₹2 lakh at just ₹20/year',
    category: 'Insurance',
    categoryColor: '#2E7D32',
    emoji: '🛡️',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    fullDesc: 'Pradhan Mantri Suraksha Bima Yojana is a low-cost accident insurance scheme providing financial protection to people of all income groups against accidental death or disability.',
    highlights: [
      'Accidental death & permanent disability cover of ₹2 lakh',
      'Annual premium of only ₹20',
      'Auto-debit from bank account every year',
      'Valid from June 1 to May 31',
    ],
    eligibility: [
      'Age 18 to 70 years',
      'Must have a savings bank account',
      'Aadhaar linked to bank account preferred',
    ],
    howToApply: [
      'Visit your bank branch',
      'Fill the PMSBY enrollment form',
      'Premium of ₹20 will be auto-debited annually',
    ],
    website: 'https://financialservices.gov.in',
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    shortDesc: 'Guaranteed monthly pension ₹1,000–₹5,000 after age 60',
    category: 'Pension',
    categoryColor: '#6A1B9A',
    emoji: '👴',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    fullDesc: 'Atal Pension Yojana provides financial security to workers in the unorganized sector. After turning 60, subscribers receive a guaranteed monthly pension based on their contribution.',
    highlights: [
      'Guaranteed pension ₹1,000 to ₹5,000/month after age 60',
      'Government-backed and secure',
      'Auto-debit from bank account',
      "Spouse receives pension after subscriber's death",
      "Nominee receives the full corpus on spouse's death",
    ],
    eligibility: [
      'Age 18 to 40 years',
      'Must have a savings bank account',
      'Aadhaar and mobile number required',
    ],
    howToApply: [
      'Visit your bank or post office',
      'Fill the APY registration form',
      'Provide Aadhaar and bank details',
      'Choose your desired pension amount',
      'Monthly contribution will be auto-debited',
    ],
    website: 'https://npscra.nsdl.co.in/',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    shortDesc: 'Life cover of ₹2 lakh at ₹436/year for age 18–50',
    category: 'Insurance',
    categoryColor: '#00838F',
    emoji: '🛡️',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    fullDesc: "Pradhan Mantri Jeevan Jyoti Bima Yojana is a life insurance scheme providing ₹2 lakh cover to the nominee in case of the subscriber's death. It is affordable for low-income families.",
    highlights: [
      '₹2 lakh life cover on death',
      'Annual premium of only ₹436',
      'Premium auto-debited from bank account',
      'Renewable every year',
    ],
    eligibility: [
      'Age 18 to 50 years',
      'Must have a savings bank account',
    ],
    howToApply: [
      'Visit your bank branch',
      'Fill the PMJJBY enrollment form',
      'Premium of ₹436 will be auto-debited annually',
    ],
    website: 'https://financialservices.gov.in',
  },
  {
    id: 'pmmy',
    name: 'PM Mudra Yojana (PMMY)',
    shortDesc: 'Loans up to ₹10 lakh for small/micro enterprises',
    category: 'Loan',
    categoryColor: '#E65100',
    emoji: '💰',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    fullDesc: 'Pradhan Mantri MUDRA Yojana provides loans up to ₹10 lakh to small and micro enterprises through banks, RRBs, Small Finance Banks, MFIs, and NBFCs.',
    highlights: [
      'Shishu: Loans up to ₹50,000',
      'Kishore: Loans from ₹50,001 to ₹5 lakh',
      'Tarun: Loans from ₹5 lakh to ₹10 lakh',
      'TarunPlus: Up to ₹20 lakh for successful repayers',
      'Apply online at www.udyamimitra.in',
    ],
    eligibility: [
      'Non-farm small or micro enterprises',
      'Non-corporate business entities',
      'Individuals starting or expanding a business',
    ],
    howToApply: [
      'Visit any bank or lending institution',
      'Or apply online at www.udyamimitra.in',
      'Submit business plan and identity documents',
    ],
    website: 'https://www.udyamimitra.in/',
  },
  {
    id: 'nrlm',
    name: 'National Rural Livelihoods Mission (NRLM)',
    shortDesc: 'Self Help Groups & rural livelihoods support for women',
    category: 'Rural',
    categoryColor: '#558B2F',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    fullDesc: 'DAY-NRLM aims to reduce rural poverty, especially for women, by forming Self Help Groups (SHGs) and linking them with bank credit for livelihood support.',
    highlights: [
      'Formation of Self Help Groups (SHGs)',
      'Bank credit linkage for SHGs',
      'Financial literacy and skill development training',
      'Capacity building for rural households',
    ],
    eligibility: [
      'Rural households below poverty line',
      'Women from unorganized sector especially',
    ],
    howToApply: [
      'Contact your local Block Development Office',
      'Join or form a Self Help Group (SHG) in your village',
    ],
    website: 'https://nrlm.gov.in/',
  },
  {
    id: 'ssy',
    name: 'Sukanya Samriddhi Yojana',
    shortDesc: 'Tax-free savings scheme for girl child education & marriage',
    category: 'Girl Child',
    categoryColor: '#AD1457',
    emoji: '👧',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    fullDesc: 'Sukanya Samriddhi Yojana is a savings scheme for the future education and marriage expenses of a girl child. It offers higher interest rates and full tax exemption.',
    highlights: [
      'Minimum deposit ₹250, maximum ₹1,50,000 per year',
      'Higher interest rate than regular savings accounts',
      'Completely tax-free returns',
      'Account matures after 21 years',
      'Tax deduction under Section 80C',
      'Interest income tax-free under Section 10',
    ],
    eligibility: [
      'Girl child below 10 years of age',
      'Only one account per girl child',
      'Maximum 2 accounts per family (for 2 daughters)',
    ],
    howToApply: [
      'Visit any post office or authorized bank',
      "Submit girl's birth certificate and parent's Aadhaar",
      'Make initial deposit of minimum ₹250',
    ],
    website: 'https://nsiindia.gov.in/',
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    shortDesc: 'Affordable crop insurance against natural disasters',
    category: 'Agriculture',
    categoryColor: '#00695C',
    emoji: '🌱',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    fullDesc: 'Pradhan Mantri Fasal Bima Yojana provides financial support to farmers suffering crop losses due to natural calamities, pests, or disease.',
    highlights: [
      'Covers 50+ different crops',
      'Protection from natural disasters, pests & disease',
      'Very affordable premium rates for farmers',
      'Over 50 crore farmers covered so far',
    ],
    eligibility: [
      'All Indian farmers — loanee and non-loanee',
      'Both landowner and tenant farmers eligible',
    ],
    howToApply: [
      'Visit your nearest bank or insurance company',
      'Or apply online at pmfby.gov.in',
      'Submit land records and crop details',
    ],
    website: 'https://pmfby.gov.in/',
  },
  {
    id: 'ngy',
    name: 'Nanda Gaura Yojana',
    shortDesc: 'Financial help up to ₹62,000 for girls in Uttarakhand',
    category: 'State — Uttarakhand',
    categoryColor: '#4527A0',
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    fullDesc: 'Nanda Gaura Yojana is an Uttarakhand state scheme providing financial assistance to daughters of poor families — maximum 2 daughters per family.',
    highlights: [
      'Financial assistance at birth of girl child',
      'Additional ₹62,000 on passing Class 12',
      'Benefit available for maximum 2 daughters per family',
    ],
    eligibility: [
      'Daughters of poor families in Uttarakhand',
      'Permanent resident of Uttarakhand',
    ],
    howToApply: [
      'Apply online at www.nandagaurauk.in',
      'Documents needed: Affidavit, Class 12 Marksheet, Residence Certificate, Bank Details',
    ],
    website: 'https://www.nandagaurauk.in/',
  },
  {
    id: 'memsy',
    name: 'Mukhyamantri Ekal Mahila Swarojgar Yojana',
    shortDesc: 'Grant up to ₹1.5 lakh for single women entrepreneurs in Uttarakhand',
    category: 'Women Empowerment',
    categoryColor: '#C62828',
    emoji: '👩',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    fullDesc: "This Uttarakhand scheme provides grants to widowed, abandoned, or divorced single women so they can start their own business and become self-reliant.",
    highlights: [
      '75% grant — maximum ₹1.5 lakh',
      '25% contribution from beneficiary or loan',
      'For businesses up to ₹2 lakh',
      "Aimed at women's financial independence",
    ],
    eligibility: [
      'Widowed, abandoned, or divorced single women',
      'Permanent resident of Uttarakhand',
    ],
    howToApply: [
      'Apply at the District Social Welfare Office',
      'Submit required identity and residence documents',
    ],
  },
  {
    id: 'handloom',
    name: 'Handloom Spinning-Weaving Women Workers Scheme',
    shortDesc: '90% subsidy on handloom tools for women weavers in Uttarakhand',
    category: 'Handloom',
    categoryColor: '#795548',
    emoji: '🧵',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
    fullDesc: 'This scheme by the Uttarakhand Industries Department provides subsidized handloom tools and equipment to traditional women weavers to support their livelihood.',
    highlights: [
      '90% cost covered by government (max ₹25,000)',
      'Only 10% paid by the beneficiary',
      'Covers handloom, pantloom, frameloom & related tools',
    ],
    eligibility: [
      'Women whose primary work is handloom weaving or spinning',
      'Must be a permanent resident of Uttarakhand',
    ],
    howToApply: [
      'Apply at your District Industries Centre (DIC)',
      'Submit relevant identity and work documents',
    ],
  },
];

export default function GovtSchemeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Government Schemes</Text>
      <Text style={styles.subheading}>{SCHEMES.length} schemes available for you</Text>

      {SCHEMES.map((scheme) => (
        <TouchableOpacity
          key={scheme.id}
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => router.push(`/govtscheme/${scheme.id}` as any)}
        >
          <View style={[styles.iconStrip, { backgroundColor: scheme.categoryColor }]}>
            <Text style={styles.iconText}>{scheme.emoji}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{scheme.name}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{scheme.shortDesc}</Text>
            <View style={[styles.badge, { backgroundColor: scheme.categoryColor + '22' }]}>
              <Text style={[styles.badgeText, { color: scheme.categoryColor }]}>{scheme.category}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  subheading: { fontSize: 13, color: '#888', marginBottom: 18 },
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