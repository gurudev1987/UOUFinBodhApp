import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const BANKING_TOPICS = [
  {
    id: 'what-is-bank',
    name: 'What is a Bank?',
    shortDesc: 'Financial institution for borrowing, lending & earning interest',
    category: 'Banking Basics',
    categoryColor: '#1565C0',
    emoji: '🏦',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'A bank is a financial institution where people deposit their surplus money and earn interest. Banks borrow money from depositors at lower interest rates and lend at higher rates. The difference is called Net Interest Margin (NIM). Banks play a vital role in enabling smooth economic activity.',
    highlights: [
      'Accepts deposits and pays interest to depositors',
      'Lends money to individuals and businesses',
      'Net Interest Margin (NIM) = Lending rate minus Borrowing rate',
      'Vital for financial needs of individuals and companies',
      'Enables smooth economic activity in the country',
    ],
    eligibility: [
      'Any Indian citizen with valid KYC documents',
      'Aadhaar and PAN card required',
      'Minimum age 18 (or minor with guardian)',
    ],
    howToApply: [
      'Choose bank based on location, ATM, interest rates',
      'Visit branch or apply online',
      'Submit KYC documents',
      'Make initial deposit to activate account',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'how-to-select-bank',
    name: 'How to Select Right Bank',
    shortDesc: 'Location, ATM, interest rates, online banking & fees',
    category: 'Banking Basics',
    categoryColor: '#1565C0',
    emoji: '✅',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    fullDesc: 'Choosing the right bank is important for your financial needs. Key factors include branch location, ATM availability, minimum balance requirement, online banking facility, interest rates on savings, and service charges.',
    highlights: [
      'Location: Choose bank near your house or office',
      'ATM: Prefer banks with ATMs in your vicinity',
      'Average Balance: Choose bank with least minimum balance',
      'Online Banking: Must have safe & secure 24/7 facility',
      'Interest Rates: Choose bank offering better savings rates',
      'Services & Fees: Prefer banks with least service charges',
    ],
    eligibility: [
      'Any individual or business entity',
    ],
    howToApply: [
      'Compare banks on interest rates and fees',
      'Check branch and ATM network near you',
      'Visit bank website or branch for details',
      'Open account after comparing all factors',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'savings-account',
    name: 'Savings Account',
    shortDesc: 'Regular deposit account — withdraw anytime, earn interest',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '💰',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    fullDesc: 'A savings bank account is a regular deposit account for depositing day-to-day surplus. You can withdraw money whenever needed. Types include regular savings, savings for children, senior citizens, women, zero-balance accounts, and accounts with auto sweep, debit cards and bill payments.',
    highlights: [
      'Earns interest on deposited money',
      'High liquidity — withdraw anytime',
      'Zero-balance savings accounts available',
      'Special accounts for children, women, senior citizens',
      'Overdraft facility available for emergency needs',
      'Auto sweep, debit card, bill payment features',
    ],
    eligibility: [
      'Any Indian citizen',
      'Aadhaar and PAN required for KYC',
      'Zero-balance accounts for PMJDY beneficiaries',
    ],
    howToApply: [
      'Visit any bank branch or apply online',
      'Submit KYC documents (Aadhaar, PAN, photo)',
      'Choose account type as per your need',
      'Make initial deposit (if required)',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'current-account',
    name: 'Current Account',
    shortDesc: 'For businesses & traders — unlimited transactions, overdraft',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    fullDesc: 'A current account is a deposit account for business owners, traders and entrepreneurs who need to make and receive payments frequently. No limit on transactions per day. Allows overdraft facility. These are zero-interest bearing accounts with minimum balance requirement.',
    highlights: [
      'No limit on number of transactions per day',
      'Overdraft facility — withdraw more than available balance',
      'Zero interest — no earnings on balance',
      'Minimum balance must be maintained',
      'Suitable for businesses, traders, entrepreneurs',
    ],
    eligibility: [
      'Business owners, traders, entrepreneurs',
      'Companies, firms, trusts',
      'Valid business documents required',
    ],
    howToApply: [
      'Visit bank branch with business documents',
      'Submit KYC and business registration proof',
      'Maintain required minimum balance',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'salary-account',
    name: 'Salary Account',
    shortDesc: 'Opened by employer — salary credited directly every month',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '💼',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    fullDesc: 'A salary account is opened as per tie-up between employer and bank. Salaries of all employees are credited to this account at the beginning of the pay cycle. The same bank also maintains reimbursement accounts where allowances and reimbursements are credited.',
    highlights: [
      'Salary credited directly every month',
      'Opened through employer-bank tie-up',
      'Usually zero minimum balance requirement',
      'Reimbursement account also maintained',
      'Special offers and benefits for salaried employees',
    ],
    eligibility: [
      'Salaried employees of organizations',
      'Employer must have tie-up with the bank',
    ],
    howToApply: [
      'Contact your employer\'s HR department',
      'Bank account opened through company',
      'Submit KYC documents to bank via employer',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'fixed-deposit',
    name: 'Fixed Deposit (FD)',
    shortDesc: 'Higher interest for fixed period — 7 days to 10 years',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '🔒',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    fullDesc: 'A Fixed Deposit (FD) account is for depositing money for a fixed period earning higher interest than savings account. Maturity period ranges from 7 days to 10 years. Generally cannot withdraw before maturity; premature withdrawal attracts lower interest rate penalty.',
    highlights: [
      'Higher interest rate than savings account',
      'Maturity period: 7 days to 10 years',
      'Interest rate varies by tenure',
      'Premature withdrawal attracts penalty',
      'Safe and guaranteed returns',
      'Tax-saving FDs available (5 year lock-in)',
    ],
    eligibility: [
      'Any Indian citizen',
      'NRIs can open NRE/NRO FDs',
      'Aadhaar and PAN required',
    ],
    howToApply: [
      'Visit bank branch or use net banking',
      'Choose amount and tenure',
      'FD certificate issued on deposit',
      'Auto-renewal option available at maturity',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'recurring-deposit',
    name: 'Recurring Deposit (RD)',
    shortDesc: 'Monthly savings with fixed interest — 6 months to 10 years',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '🔄',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    fullDesc: 'A Recurring Deposit (RD) is for depositing a fixed amount periodically (daily, weekly or monthly) for a fixed tenure. Unlike FDs with lump sum deposit, RD amount is smaller and recurrent. Tenure cannot be changed once started. Premature withdrawal attracts penalty in form of lower interest.',
    highlights: [
      'Fixed amount deposited every month',
      'Maturity period: 6 months to 10 years',
      'FD-like interest rates',
      'Suitable for regular disciplined savings',
      'Smaller investment compared to FD',
      'Premature withdrawal penalty applies',
    ],
    eligibility: [
      'Any Indian citizen',
      'Aadhaar and PAN required',
      'Minimum deposit varies by bank',
    ],
    howToApply: [
      'Visit bank branch or use net banking',
      'Choose monthly amount and tenure',
      'Auto-debit from savings account set up',
      'Receive maturity amount at end of tenure',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'nri-accounts',
    name: 'NRI Accounts',
    shortDesc: 'NRE & NRO accounts for Indians living overseas',
    category: 'Types of Bank Accounts',
    categoryColor: '#2E7D32',
    emoji: '🌍',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    fullDesc: 'NRI accounts are for Indians or Indian-origin people living overseas. Types include NRO (Non-Resident Ordinary) and NRE (Non-Resident External) savings and fixed deposit accounts. Banks also offer Foreign Currency Non-Resident (FCNR) fixed deposit accounts.',
    highlights: [
      'NRO Account: For income earned in India',
      'NRE Account: For foreign income — fully repatriable',
      'FCNR: Fixed deposit in foreign currency',
      'Tax-free interest on NRE accounts',
      'Easy repatriation of funds',
    ],
    eligibility: [
      'Indians or Indian-origin people living overseas',
      'Valid passport and visa required',
      'Overseas address proof needed',
    ],
    howToApply: [
      'Apply online or visit bank branch',
      'Submit passport, visa, overseas address proof',
      'Choose NRO or NRE as per need',
      'Transfer funds from overseas to activate',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'pmjdy',
    name: 'PM Jan Dhan Yojana (PMJDY)',
    shortDesc: 'Zero-balance account for every adult — insurance & pension access',
    category: 'Government Banking Scheme',
    categoryColor: '#4527A0',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    fullDesc: 'Pradhan Mantri Jan Dhan Yojana was launched on 28th August 2014 under the National Mission for Financial Inclusion. It provides universal access to banking with at least one basic banking account for every household, financial literacy, access to credit, insurance and pension.',
    highlights: [
      'Zero-balance basic savings bank account',
      'Overdraft limit of ₹10,000 for active accounts',
      'No conditions for OD up to ₹2,000',
      'Age limit for OD: 18 to 65 years',
      'Accidental insurance cover of ₹2 lakh on RuPay card',
      'Access to credit, insurance and pension',
    ],
    eligibility: [
      'Any Indian adult (18+ years)',
      'Valid Aadhaar card required',
      'No minimum balance required',
    ],
    howToApply: [
      'Visit nearest bank branch or Business Correspondent',
      'Submit Aadhaar card and passport photo',
      'Fill PMJDY account opening form',
      'Get RuPay debit card and passbook',
    ],
    website: 'https://www.pmjdy.gov.in/',
  },
  {
    id: 'commercial-banks',
    name: 'Commercial Banks',
    shortDesc: 'Public, Private & Foreign banks — RBI regulated',
    category: 'Types of Banks in India',
    categoryColor: '#00838F',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    fullDesc: 'Commercial Banks are financial institutions providing a wide range of services including accepting deposits, providing loans and offering investment products. RBI is the highest monetary authority regulating all scheduled commercial banks. Classified into Public Sector, Private Sector and Foreign Banks.',
    highlights: [
      'Public Sector Banks: Government holds 50%+ stake (SBI, PNB, Canara)',
      'Private Sector Banks: Privately owned (HDFC, ICICI, Axis)',
      'Foreign Banks: Headquartered abroad (Citi, HSBC, Standard Chartered)',
      'RBI regulates all scheduled commercial banks',
      '14 banks nationalized in 1969, 6 more in 1980',
      'Oldest, biggest and fastest growing institutions in India',
    ],
    eligibility: [
      'Any individual or entity can open accounts',
      'KYC documents required',
    ],
    howToApply: [
      'Choose bank type based on your needs',
      'Visit branch or apply online',
      'Submit KYC and required documents',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'rrb',
    name: 'Regional Rural Banks (RRB)',
    shortDesc: 'Rural banking for farmers, artisans & agricultural workers',
    category: 'Types of Banks in India',
    categoryColor: '#558B2F',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    fullDesc: 'Regional Rural Banks were started in 1975 to cater to the needs of rural economy of India. They focus on credit requirements of small farmers, artisans and agricultural workers and operate mainly at the district level. There are 43 RRBs with 20,000+ branches and 14,000 ATMs serving millions in rural areas.',
    highlights: [
      'Started in 1975 for rural economy',
      '43 RRBs operating in India',
      'Over 20,000 branches and 14,000 ATMs',
      'Focus: Small farmers, artisans, agricultural workers',
      'Operate mainly at district level',
      'Millions of rural customers served',
    ],
    eligibility: [
      'Residents of rural and semi-urban areas',
      'Farmers, artisans, agricultural workers',
      'Valid KYC documents required',
    ],
    howToApply: [
      'Visit nearest RRB branch in your district',
      'Submit KYC documents',
      'Open savings or loan account as needed',
    ],
    website: 'https://www.nabard.org/',
  },
  {
    id: 'cooperative-banks',
    name: 'Co-operative Banks',
    shortDesc: 'Three-tier rural credit system — village to state level',
    category: 'Types of Banks in India',
    categoryColor: '#795548',
    emoji: '🤝',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    fullDesc: 'The rural co-operative credit system ensures flow of credit to the agriculture sector. It operates with a three-tier system: Primary Agriculture Credit Societies (PACS) at village level, Central Cooperative Banks at district level, and State Cooperative Banks at state level. Urban Cooperative Banks (UCBs) cater to urban and semi-urban areas.',
    highlights: [
      'Three-tier system: Village → District → State',
      'PACS: Primary Agriculture Credit Societies at village level',
      'Central Cooperative Banks at district level',
      'State Cooperative Banks at state level',
      'Urban Cooperative Banks (UCBs) for urban areas',
      'Main focus: Agriculture credit and rural needs',
    ],
    eligibility: [
      'Farmers and rural households',
      'Members of cooperative societies',
      'Urban residents for UCBs',
    ],
    howToApply: [
      'Visit nearest cooperative bank or PACS',
      'Become a member of the cooperative society',
      'Submit required documents',
      'Apply for loan or open savings account',
    ],
    website: 'https://www.nabard.org/',
  },
];

export default function BankingScreen() {
  const router = useRouter();
  const categories = [
    'Banking Basics',
    'Types of Bank Accounts',
    'Government Banking Scheme',
    'Types of Banks in India',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Banking</Text>
      <Text style={styles.subheading}>{BANKING_TOPICS.length} topics covered</Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={styles.categoryHeader}>{cat}</Text>
          {BANKING_TOPICS.filter((t) => t.category === cat).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/banking/${topic.id}` as any)}
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