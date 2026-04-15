import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const INVESTMENT_TOPICS = [
  {
    id: 'what-is-investment',
    name: 'What is Investment?',
    shortDesc: 'Put money to work today — earn more money in future',
    category: 'Basics of Investment',
    categoryColor: '#1565C0',
    emoji: '💡',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    fullDesc: 'Investment means using money today in such a way that it gives more money (return) in the future. It is the act of putting money to work to earn income or profit. Examples: shares, land, fixed deposit, gold, mutual funds.',
    highlights: [
      'To Increase Wealth — money grows faster than saving',
      'To Earn Regular Income — interest, dividends, rent',
      'To Beat Inflation — protects value of money',
      'For Financial Security — safety during emergencies',
      'To Achieve Life Goals — education, house, retirement',
      'To Create Passive Income — earn without active work',
    ],
    eligibility: [
      'Anyone with surplus money to invest',
      'Both short-term and long-term investors',
      'All income groups can invest as per capacity',
    ],
    howToApply: [
      'Identify your financial goal (short/long term)',
      'Assess your risk appetite (low/medium/high)',
      'Choose suitable investment option',
      'Start investing regularly for best results',
    ],
    website: 'https://www.sebi.gov.in/',
  },
  {
    id: 'saving-vs-investment',
    name: 'Saving vs Investment',
    shortDesc: 'Saving keeps money safe — Investment makes money grow',
    category: 'Basics of Investment',
    categoryColor: '#1565C0',
    emoji: '⚖️',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    fullDesc: 'Saving means setting aside a part of income for future use with very low risk and low return. Investment means using money to earn profit or income in future with higher risk but higher return. Saving keeps money safe; Investment makes money grow.',
    highlights: [
      'Saving: Very low risk, low return, highly liquid',
      'Investment: Higher risk, higher return expected',
      'Saving examples: Cash, savings account, piggy bank',
      'Investment examples: Shares, mutual funds, real estate',
      'Investment grows money faster than saving',
    ],
    eligibility: [
      'Savings suitable for all — especially beginners',
      'Investment suitable for those with financial goals',
    ],
    howToApply: [
      'Start with saving — build an emergency fund first',
      'Once savings are stable, move to investments',
      'Diversify across saving and investment products',
    ],
    website: 'https://www.sebi.gov.in/',
  },
  {
    id: 'risk-return',
    name: 'Risk & Return Concept',
    shortDesc: 'Higher the risk — higher the expected return',
    category: 'Basics of Investment',
    categoryColor: '#1565C0',
    emoji: '📊',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    fullDesc: 'The risk and return concept states that higher the risk, higher the expected return; lower the risk, lower the expected return. Risk is the possibility that actual return may differ from expected return. Return is the income or profit earned from investment.',
    highlights: [
      'Low Risk → Low Return (Savings account, Govt Bonds)',
      'Medium Risk → Medium Return (Mutual Funds, Corp Bonds)',
      'High Risk → High Return (Shares, Cryptocurrency)',
      'Helps choose suitable investments',
      'Supports financial planning and decision-making',
    ],
    eligibility: ['Every investor must understand risk before investing'],
    howToApply: [
      'Assess your risk tolerance honestly',
      'Match investment with your risk level',
      'Diversify to balance risk and return',
      'Review portfolio regularly',
    ],
    website: 'https://www.sebi.gov.in/',
  },
  {
    id: 'bank-deposits',
    name: 'Bank Deposits',
    shortDesc: 'Safe & secure — savings, FD, RD with guaranteed returns',
    category: 'Types of Investment',
    categoryColor: '#2E7D32',
    emoji: '🏦',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'Bank Deposits are money kept with banks for safety, interest, and future use. Types include Savings Account, Current Account, Fixed Deposit (FD), and Recurring Deposit (RD). They are safe, secure and suitable for all income groups.',
    highlights: [
      'Savings Account: High liquidity, earns interest',
      'Current Account: For businesses, unlimited transactions',
      'Fixed Deposit (FD): Higher interest, fixed period',
      'Recurring Deposit (RD): Monthly savings with FD-like interest',
      'Safe, secure and DICGC insured up to ₹5 lakh',
    ],
    eligibility: [
      'Any Indian citizen with valid KYC documents',
      'Aadhaar and PAN required',
      'Minimum age 18 (or minor with guardian)',
    ],
    howToApply: [
      'Visit any bank branch or apply online',
      'Submit KYC documents (Aadhaar, PAN, photo)',
      'Choose deposit type as per your need',
      'Make initial deposit to activate account',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'post-office',
    name: 'Post Office Schemes',
    shortDesc: 'Government-backed savings — PPF, NSC, RD & more',
    category: 'Types of Investment',
    categoryColor: '#E65100',
    emoji: '📮',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    fullDesc: 'Post Office Schemes are government-backed saving and investment schemes provided by India Post. They are safe, reliable and suitable for people of all income groups. Schemes include PPF, NSC, RD, POMIS, KVP, and Sukanya Samriddhi Yojana.',
    highlights: [
      'PPF: 15-year tenure, tax benefits, compound growth',
      'NSC: 5-year, fixed return, tax deduction under 80C',
      'RD: Monthly deposit for 5 years',
      'POMIS: Monthly income for retirees',
      'KVP: Money doubles in fixed period',
      'Sukanya Samriddhi: High interest for girl child',
    ],
    eligibility: [
      'Any Indian citizen',
      'Sukanya Samriddhi: Girl child below 10 years',
      'Aadhaar and PAN required',
    ],
    howToApply: [
      'Visit nearest post office branch',
      'Fill scheme application form',
      'Submit KYC documents',
      'Make initial deposit as per scheme minimum',
    ],
    website: 'https://www.indiapost.gov.in/',
  },
  {
    id: 'mutual-funds',
    name: 'Mutual Funds',
    shortDesc: 'Professional fund management — SIP starts from ₹100/month',
    category: 'Types of Investment',
    categoryColor: '#6A1B9A',
    emoji: '📈',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    fullDesc: 'A Mutual Fund collects money from many investors and invests in shares, bonds and other securities through professional fund managers. Returns are shared among investors. Ideal for those who lack time or knowledge to invest directly in stock market.',
    highlights: [
      'Equity Funds: High risk, high return — invest in shares',
      'Debt Funds: Low risk, stable return — invest in bonds',
      'Hybrid Funds: Medium risk — mix of equity and debt',
      'Open-ended: Buy/sell anytime',
      'SIP available from as low as ₹100/month',
      'Professional management and diversification',
    ],
    eligibility: [
      'Any Indian citizen or NRI',
      'KYC (Aadhaar + PAN) mandatory',
      'Minimum investment varies by fund',
    ],
    howToApply: [
      'Complete KYC on KRA or AMC website',
      'Choose fund based on risk appetite',
      'Invest via AMC website, Zerodha, Groww, Paytm Money',
      'Start SIP for regular monthly investment',
    ],
    website: 'https://www.amfiindia.com/',
  },
  {
    id: 'shares',
    name: 'Shares / Stocks',
    shortDesc: 'Own a part of a company — high risk, high return',
    category: 'Types of Investment',
    categoryColor: '#00838F',
    emoji: '📉',
    image: 'https://images.unsplash.com/photo-1549421263-5ec394a5ad4c?w=800',
    fullDesc: 'A Share represents ownership in a company. Equity shares give ownership and voting rights with high risk and high return. Preference shares give fixed dividends without voting rights. Shareholders earn through dividends and capital gains.',
    highlights: [
      'Equity Shares: Ownership + voting rights, high return',
      'Preference Shares: Fixed dividend, no voting rights',
      'Earn through Dividend and Capital Gain',
      'High return potential but market fluctuations',
      'Easy to buy and sell on stock exchange',
    ],
    eligibility: [
      'Age 18+, Indian resident or NRI',
      'Demat account + Trading account required',
      'PAN card mandatory',
    ],
    howToApply: [
      'Open Demat + Trading account with a broker (Zerodha, Upstox)',
      'Complete KYC with PAN and Aadhaar',
      'Add funds to trading account',
      'Search company and place buy order',
    ],
    website: 'https://www.nseindia.com/',
  },
  {
    id: 'gold',
    name: 'Gold Investment',
    shortDesc: 'Traditional safe asset — physical, ETF, SGB & digital gold',
    category: 'Types of Investment',
    categoryColor: '#F9A825',
    emoji: '🪙',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800',
    fullDesc: 'Gold is a popular and traditional investment. It protects against inflation and is safe during market fluctuations. Types include Physical Gold (jewellery/coins), Gold ETF, Sovereign Gold Bonds (SGB) by Government of India, and Digital Gold.',
    highlights: [
      'Physical Gold: Jewellery, coins, bars',
      'Gold ETF: Digital gold traded in stock market',
      'Sovereign Gold Bonds: Interest + gold price benefit',
      'Digital Gold: Buy 24K gold online in small amounts',
      'Hedge against inflation',
      'High liquidity — easy to sell',
    ],
    eligibility: [
      'Any Indian citizen',
      'SGB: Demat account required',
      'Digital Gold: Any smartphone user',
    ],
    howToApply: [
      'Physical: Buy from jeweller or bank',
      'Gold ETF: Buy via stock broker (Demat needed)',
      'SGB: Apply via bank or stock broker during issue',
      'Digital Gold: Buy via PhonePe, Paytm, Google Pay',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    shortDesc: 'Property investment — rental income & capital appreciation',
    category: 'Types of Investment',
    categoryColor: '#795548',
    emoji: '🏠',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    fullDesc: 'Real Estate means investment in land, houses, buildings, shops or commercial property to earn income or profit. It generates Rental Income and Capital Appreciation over time. Types: Residential, Commercial, and Land Investment.',
    highlights: [
      'Residential: Houses, flats, plots',
      'Commercial: Offices, shops, malls, warehouses',
      'Land: Long-term value growth',
      'Rental Income + Capital Appreciation',
      'Stable long-term returns',
      'Hedge against inflation',
    ],
    eligibility: [
      'Any Indian citizen',
      'Large investment required',
      'Legal documents: sale deed, registration mandatory',
    ],
    howToApply: [
      'Identify location and property type',
      'Check legal documents and title clearance',
      'Apply for home loan if needed',
      'Register property at sub-registrar office',
    ],
    website: 'https://www.rera.gov.in/',
  },
  {
    id: 'govt-securities',
    name: 'Government Securities (G-Sec)',
    shortDesc: 'Safest investment — government-backed bonds & T-bills',
    category: 'Types of Investment',
    categoryColor: '#4527A0',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    fullDesc: 'Government Securities are financial instruments issued by the Government of India to borrow money from the public. They are extremely safe investments. Types include Treasury Bills (T-Bills), Government Bonds, and State Development Loans (SDLs).',
    highlights: [
      'Treasury Bills: 91, 182, 364 days — issued at discount',
      'Government Bonds: 5 to 40 years — fixed interest',
      'State Development Loans (SDLs): Long-term state govt bonds',
      'Extremely safe — government-backed',
      'Fixed and regular income',
      'Suitable for conservative investors',
    ],
    eligibility: [
      'Individuals, companies, banks, trusts',
      'NRIs can also invest in select securities',
      'Demat account required for online purchase',
    ],
    howToApply: [
      'Buy via RBI Retail Direct platform (rdirect.rbi.org.in)',
      'Or buy via stock broker (NSE/BSE)',
      'Choose T-Bill or Bond as per investment horizon',
      'Hold till maturity for full return',
    ],
    website: 'https://www.rbi.org.in/',
  },
  {
    id: 'capital-market',
    name: 'Capital Market',
    shortDesc: 'Primary & Secondary market — IPO, stock exchange & demat',
    category: 'Financial Market',
    categoryColor: '#C62828',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    fullDesc: 'Capital Market is a market for securities (debt and equity) where companies and government raise long-term funds. Primary Market is where new shares are issued (IPO/FPO). Secondary Market (stock exchange) is where existing shares are bought and sold.',
    highlights: [
      'Primary Market: New shares issued — IPO and FPO',
      'Secondary Market: Stock exchange — shares bought/sold',
      'Need 3 accounts: Bank + Trading + Demat',
      'Demat Account: Holds securities electronically',
      'Trading Account: Link between bank and demat',
      'SEBI regulates capital markets in India',
    ],
    eligibility: [
      'Age 18+, Indian resident or NRI',
      'PAN card mandatory',
      'Bank account with KYC',
    ],
    howToApply: [
      'Open Demat account with NSDL/CDSL registered broker',
      'Submit PAN, Aadhaar, bank proof, photo',
      'Open linked trading account',
      'Fund trading account and start investing',
    ],
    website: 'https://www.sebi.gov.in/',
  },
  {
    id: 'money-market',
    name: 'Money Market',
    shortDesc: 'Short-term funds market — T-bills, CDs, commercial paper',
    category: 'Financial Market',
    categoryColor: '#558B2F',
    emoji: '💹',
    image: 'https://images.unsplash.com/photo-1504607798333-52a30db54a5d?w=800',
    fullDesc: 'Money Market is a market for short-term funds (overnight to less than 1 year). Instruments include Treasury Bills, Certificate of Deposit, Commercial Paper, Call Money, and Repos. RBI regulates the organized money market in India.',
    highlights: [
      'Treasury Bills (T-Bills): 91, 182, 364 days',
      'Certificate of Deposit (CD): Banks issue to depositors',
      'Commercial Paper (CP): Corporates raise short-term funds',
      'Call Money: Overnight inter-bank borrowing',
      'Repos & Reverse Repos: RBI monetary policy tools',
      'Money Market Mutual Funds (MMMFs): For individuals',
    ],
    eligibility: [
      'Banks, financial institutions, corporates',
      'Individuals via Money Market Mutual Funds',
      'Minimum ₹1 lakh for most instruments',
    ],
    howToApply: [
      'Individuals can invest via Money Market Mutual Funds',
      'Choose MMMF through AMC or broker platform',
      'Complete KYC and invest online',
    ],
    website: 'https://www.rbi.org.in/',
  },
];

export default function InvestmentScreen() {
  const router = useRouter();
  const categories = ['Basics of Investment', 'Types of Investment', 'Financial Market'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Investments</Text>
      <Text style={styles.subheading}>{INVESTMENT_TOPICS.length} topics covered</Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={styles.categoryHeader}>{cat}</Text>
          {INVESTMENT_TOPICS.filter((t) => t.category === cat).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/investments/${topic.id}` as any)}
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