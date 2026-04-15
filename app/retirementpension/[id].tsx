import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Linking, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const PENSION_TOPICS = [
  {
    id: 'retirement-meaning',
    name: 'Meaning of Retirement',
    shortDesc: 'What retirement means and why financial planning matters',
    category: 'Basics',
    categoryColor: '#E8704A',
    emoji: '🌅',
    fullDesc:
      'Retirement is the stage of life when a person stops working regularly due to age or personal choice. During this phase, regular salary stops, so financial planning becomes very important.\n\nRetirement planning means saving and investing today to maintain a comfortable lifestyle in old age.',
    highlights: [
      'Regular salary stops after retirement',
      'Financial planning becomes very important',
      'Save and invest today for a comfortable future',
      'Plan early to maintain lifestyle in old age',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'pension-meaning',
    name: 'Meaning of Pension',
    shortDesc: 'What is pension and why it is needed in old age',
    category: 'Basics',
    categoryColor: '#4A90D9',
    emoji: '💰',
    fullDesc:
      'A pension is a fixed amount of money received regularly (monthly or yearly) after retirement. It provides financial security when a person is no longer earning actively.\n\nExample: A person retires at age 60 and receives ₹10,000 every month from a pension scheme — this helps cover daily expenses.',
    highlights: [
      'Decreased income earning potential with age',
      'Rise of nuclear family — migration of earning member',
      'Rise in cost of living',
      'Increased longevity',
      'Assured monthly income ensures dignified life in old age',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'importance',
    name: 'Importance of Retirement Planning',
    shortDesc: 'Why planning for retirement is essential for everyone',
    category: 'Planning',
    categoryColor: '#27AE60',
    emoji: '📊',
    fullDesc:
      'Retirement planning is the process of setting aside money and managing assets to prepare for life after work. Without proper planning, old age can become financially stressful.',
    highlights: [
      'Maintains financial independence',
      'Covers daily living expenses',
      'Helps manage medical costs',
      'Protects against inflation',
      'Reduces dependence on family',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'types-plans',
    name: 'Types of Pension / Retirement Plans',
    shortDesc: 'Government, insurance, and investment-based retirement plans',
    category: 'Planning',
    categoryColor: '#8E44AD',
    emoji: '🗂️',
    fullDesc:
      'There are three main types of retirement plans available in India — Government Pension Schemes, Insurance-Based Plans, and Investment-Based Plans. Each serves a different purpose and suits different income groups.',
    highlights: [
      'Govt Schemes: Atal Pension Yojana (APY), NPS, EPS',
      'Insurance Plans: Annuity Plans, Deferred Pension Plans',
      'Investment Plans: PPF, Mutual Funds (SIP), Fixed Deposits',
      'Retirement-focused mutual funds also available',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'types-annuity',
    name: 'Types of Pension Plans — Annuity',
    shortDesc: 'Immediate Annuity vs Deferred Annuity explained simply',
    category: 'Planning',
    categoryColor: '#E67E22',
    emoji: '📋',
    fullDesc:
      'Annuity plans are pension products offered by insurance companies. There are two types — Immediate Annuity (pension starts right away) and Deferred Annuity (pension starts after retirement age).',
    highlights: [
      'Immediate Annuity: Lump sum investment, pension starts immediately',
      'Deferred Annuity: Invest during working years',
      'Deferred Annuity: Pension starts after retirement',
      'Choose based on your current age and income',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'key-features',
    name: 'Key Features of Good Retirement Planning',
    shortDesc: 'Core principles for a successful retirement plan',
    category: 'Planning',
    categoryColor: '#16A085',
    emoji: '🔑',
    fullDesc:
      'A good retirement plan has certain key characteristics that help it grow over time and provide enough corpus after retirement. Understanding these features helps you make better investment decisions.',
    highlights: [
      'Long-term investment horizon',
      'Regular and consistent contributions',
      'Power of compounding grows wealth over time',
      'Diversification of assets reduces risk',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'factors',
    name: 'Factors Before Choosing Pension Plan',
    shortDesc: 'What to consider before selecting the right pension plan',
    category: 'Planning',
    categoryColor: '#C0392B',
    emoji: '⚖️',
    fullDesc:
      'Before choosing a pension plan, it is important to evaluate several personal and financial factors. The right plan depends on your age, risk appetite, expenses, and tax planning needs.',
    highlights: [
      'Age and retirement goal',
      'Risk tolerance (low / medium / high)',
      'Expected monthly expenses after retirement',
      'Inflation impact on future expenses',
      'Tax benefits available under the scheme',
    ],
    eligibility: [] as string[],
    howToApply: [] as string[],
    website: '',
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    shortDesc: 'Guaranteed pension ₹1,000–₹5,000/month for unorganized sector',
    category: 'Govt Scheme',
    categoryColor: '#6A1B9A',
    emoji: '👴',
    fullDesc:
      'Atal Pension Yojana is a government pension scheme mainly for workers in the unorganized sector. After turning 60, subscribers receive a guaranteed monthly pension based on their chosen amount and contribution period.',
    highlights: [
      'Entry age: 18–40 years',
      'Guaranteed pension: ₹1,000 to ₹5,000 per month after age 60',
      'Low monthly contribution based on age',
      'Auto-debit from bank account',
      "Spouse receives pension after subscriber's death",
    ],
    eligibility: [
      'Age 18 to 40 years',
      'Must have a savings bank account',
      'Aadhaar and mobile number required',
      'Mainly for unorganized sector workers',
    ],
    howToApply: [
      'Visit your nearest bank branch or post office',
      'Fill the APY registration form',
      'Provide Aadhaar and bank account details',
      'Choose your desired pension amount (₹1,000–₹5,000)',
      'Monthly contribution will be auto-debited',
    ],
    website: 'https://npscra.nsdl.co.in/',
  },
  {
    id: 'nps',
    name: 'National Pension System (NPS)',
    shortDesc: 'Market-linked pension scheme for all Indian citizens (18–70 yrs)',
    category: 'Govt Scheme',
    categoryColor: '#1B5E20',
    emoji: '📈',
    fullDesc:
      'National Pension System is a market-linked retirement savings scheme regulated by PFRDA (Pension Fund Regulatory and Development Authority). It helps build a large retirement corpus through long-term investment in equity and bonds.',
    highlights: [
      'Open to all Indian citizens (18–70 years)',
      'Flexible contributions — invest as per capacity',
      'Investment in equity, corporate bonds, and government securities',
      'Tax benefits under Income Tax Act (Section 80C & 80CCD)',
      'Partial withdrawal allowed for specific needs',
    ],
    eligibility: [
      'Indian citizens aged 18 to 70 years',
      'Both salaried and self-employed can join',
      'NRIs (Non-Resident Indians) are also eligible',
      'Valid KYC documents required',
    ],
    howToApply: [
      'Visit any Point of Presence (PoP) — banks or post offices',
      'Or register online at enps.nsdl.com',
      'Submit KYC documents (Aadhaar / PAN)',
      'Choose your investment allocation',
      'Make initial contribution of minimum ₹500',
    ],
    website: 'https://enps.nsdl.com/',
  },
  {
    id: 'eps',
    name: "Employees' Pension Scheme (EPS)",
    shortDesc: 'Monthly pension for salaried employees under EPFO after retirement',
    category: 'Govt Scheme',
    categoryColor: '#1565C0',
    emoji: '👔',
    fullDesc:
      "Employees' Pension Scheme is a pension scheme for salaried employees in the organized sector, managed under EPFO (Employees' Provident Fund Organisation). It is linked with the Employees' Provident Fund (EPF).",
    highlights: [
      "Linked with Employees' Provident Fund (EPF)",
      'Employer contributes 8.33% of salary to EPS',
      'Monthly pension after retirement at age 58',
      'Provides lifetime pension for the employee',
      'Family pension available on death of member',
    ],
    eligibility: [
      'Salaried employees working in EPFO-registered organisations',
      'Minimum 10 years of service required for pension',
      'Retirement age: 58 years (early pension at 50)',
    ],
    howToApply: [
      'EPS is automatic for all EPF members',
      'Employer registers you when you join the job',
      'Ensure UAN (Universal Account Number) is activated',
      'Submit Form 10D at retirement to claim pension',
    ],
    website: 'https://www.epfindia.gov.in/',
  },
  {
    id: 'ignoaps',
    name: 'IGNOAPS — Old Age Pension Scheme',
    shortDesc: 'Social security pension for elderly citizens below poverty line',
    category: 'Govt Scheme',
    categoryColor: '#E65100',
    emoji: '🤝',
    fullDesc:
      'Indira Gandhi National Old Age Pension Scheme (IGNOAPS) is a social security scheme for elderly citizens from Below Poverty Line (BPL) families. It provides monthly financial assistance from the central government.',
    highlights: [
      'Monthly financial assistance from government',
      '₹200/month for age 60–79 years',
      '₹500/month for age 80 years and above',
      'Support for economically weaker sections',
      'Part of National Social Assistance Programme (NSAP)',
    ],
    eligibility: [
      'Age 60 years or above',
      'Must belong to Below Poverty Line (BPL) family',
      'Permanent resident of the state',
      'No other major pension source',
    ],
    howToApply: [
      'Visit your local Gram Panchayat or Block Development Office',
      'Fill the IGNOAPS application form',
      'Submit BPL certificate, age proof, and Aadhaar',
      'Application is verified and forwarded by local authorities',
      'Pension amount is credited directly to bank account',
    ],
    website: 'https://nsap.nic.in/',
  },
];

export default function RetirementPensionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const topic = PENSION_TOPICS.find((t) => t.id === id);

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
          <Text style={{ color: '#1565C0', fontSize: 16 }}>‹ Go Back</Text>
        </TouchableOpacity>
        <Text style={{ padding: 24, color: '#555', fontSize: 16 }}>Topic not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header Banner */}
        <View style={[styles.banner, { backgroundColor: topic.categoryColor }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.bannerEmoji}>{topic.emoji}</Text>
          <Text style={styles.bannerTitle}>{topic.name}</Text>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>{topic.category}</Text>
          </View>
        </View>

        {/* About */}
        <Section title="📋 About">
          <Text style={styles.descText}>{topic.fullDesc}</Text>
        </Section>

        {/* Key Points / Benefits */}
        {topic.highlights.length > 0 && (
          <Section title="✅ Key Points">
            {topic.highlights.map((h, i) => (
              <BulletRow key={i} color={topic.categoryColor} text={h} />
            ))}
          </Section>
        )}

        {/* Eligibility — only show if data exists */}
        {topic.eligibility.length > 0 && (
          <Section title="🎯 Who Can Apply">
            {topic.eligibility.map((e, i) => (
              <BulletRow key={i} color={topic.categoryColor} text={e} />
            ))}
          </Section>
        )}

        {/* How to Apply — only show if data exists */}
        {topic.howToApply.length > 0 && (
          <Section title="📝 How to Apply">
            {topic.howToApply.map((step, i) => (
              <View key={i} style={styles.listRow}>
                <Text style={[styles.stepNum, { color: topic.categoryColor }]}>{i + 1}.</Text>
                <Text style={styles.listText}>{step}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Website Button — only show if link exists */}
        {topic.website ? (
          <TouchableOpacity
            style={[styles.websiteBtn, { backgroundColor: topic.categoryColor }]}
            onPress={() => Linking.openURL(topic.website)}
            activeOpacity={0.85}
          >
            <Text style={styles.websiteBtnText}>🌐 Visit Official Website</Text>
          </TouchableOpacity>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletRow({ color, text }: { color: string; text: string }) {
  return (
    <View style={styles.listRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.listText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 24 },

  banner: {
    minHeight: 190, justifyContent: 'flex-end',
    padding: 20, paddingTop: 60,
  },
  backBtn: { position: 'absolute', top: 16, left: 16 },
  backText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  bannerEmoji: { fontSize: 40, marginBottom: 10 },
  bannerTitle: {
    fontSize: 21, fontWeight: '800', color: '#fff',
    lineHeight: 28, marginBottom: 10,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  bannerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  descText: { fontSize: 14, color: '#444', lineHeight: 23 },

  listRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7, marginRight: 10, flexShrink: 0 },
  stepNum: { fontSize: 14, fontWeight: '700', marginRight: 8, width: 22 },
  listText: { flex: 1, fontSize: 13.5, color: '#444', lineHeight: 22 },

  websiteBtn: {
    marginHorizontal: 16, marginTop: 20,
    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
  },
  websiteBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
