import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const BASICS_TOPICS = [
  {
    id: 'needs-vs-wants',
    name: 'Needs vs Wants',
    shortDesc: 'Setting priorities — know the difference to manage money better',
    category: 'Income, Expenses & Budgeting',
    categoryColor: '#1565C0',
    emoji: '🎯',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    fullDesc: 'It is very important to know the difference between needs and wants. This helps in setting priorities so you know where to spend money. A Need is a necessity — something essential for life. A Want is a desire — something non-essential.',
    highlights: [
      'Need: House, food, clothing, medications — essential for life',
      'Want: Movies, video games, expensive jewellery — non-essential',
      'Knowing the difference helps control spending',
      'Focus on needs first, then wants with surplus money',
      'Setting priorities is key to financial management',
    ],
    eligibility: ['Applicable to everyone managing personal finances'],
    howToApply: [
      'List all your monthly expenses',
      'Categorize each as Need or Want',
      'Cut down on wants when money is tight',
      'Focus surplus money on savings and goals',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'income',
    name: 'Income',
    shortDesc: 'Know your sources of income — job, business, pension, interest',
    category: 'Income, Expenses & Budgeting',
    categoryColor: '#1565C0',
    emoji: '💵',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    fullDesc: 'Most people have a source of income through job, business, farming, pension etc. Many also receive interest income from investments. Whatever the source, you need to know how to track it and manage it to cover expenses and save for the future.',
    highlights: [
      'Sources: Job, business, farming, pension, investments',
      'Track all income sources regularly',
      'Manage income to cover expenses and save',
      'Interest income from FD, RD, bonds also counts',
      'Knowing total income is first step in budgeting',
    ],
    eligibility: ['Applicable to all earning individuals'],
    howToApply: [
      'List all monthly income sources',
      'Include salary, business profit, rent, interest',
      'Calculate total monthly income',
      'Use this as base for budgeting',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'expenses',
    name: 'Expenses',
    shortDesc: 'Track & reduce unnecessary spending to reach your goals',
    category: 'Income, Expenses & Budgeting',
    categoryColor: '#1565C0',
    emoji: '🧾',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'It costs money to live — food, clothing, housing, transportation, communication and more. Then there are vacations, entertainment and gifts. To reach financial goals, you must know what your expenses are and reduce unnecessary spending.',
    highlights: [
      'Necessary expenses: Food, clothing, housing, transport',
      'Optional expenses: Vacations, entertainment, gifts',
      'Track daily expenses to know spending patterns',
      'Reduce unnecessary spending to save more',
      'First step: Get in habit of recording daily expenses',
    ],
    eligibility: ['Applicable to all individuals and families'],
    howToApply: [
      'Record every expense daily in a notebook or app',
      'Categorize expenses as necessary and optional',
      'Review weekly to find areas to cut down',
      'Redirect savings to goals and investments',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'budgeting',
    name: 'Budgeting',
    shortDesc: 'Compare income vs expenses — surplus or deficit?',
    category: 'Income, Expenses & Budgeting',
    categoryColor: '#1565C0',
    emoji: '📊',
    image: 'https://images.unsplash.com/photo-1504607798333-52a30db54a5d?w=800',
    fullDesc: 'A budget is simply a comparison of income and expenses. If positive — you have a surplus; pay off debts or increase savings. If negative — you have a deficit; increase income or reduce expenses by focusing on needs over wants. Do it weekly at first, then monthly.',
    highlights: [
      'Budget = Income minus Expenses',
      'Surplus: Pay off debt or increase savings',
      'Deficit: Increase income or reduce expenses',
      'Focus on needs over wants to reduce deficit',
      'Do it weekly first, then monthly',
      'Budgeting must be done regularly — not one time',
    ],
    eligibility: ['Every individual and family should budget'],
    howToApply: [
      'Note down total monthly income',
      'List all monthly expenses',
      'Subtract expenses from income',
      'If surplus: Save or invest the extra amount',
      'If deficit: Identify and cut unnecessary expenses',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'financial-planning',
    name: 'Financial Planning',
    shortDesc: 'Where am I now? Where to go? How to get there?',
    category: 'Financial Planning',
    categoryColor: '#6A1B9A',
    emoji: '🗺️',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    fullDesc: 'Financial planning is vital for financial well-being. It is not just about retirement — it helps everyone achieve their goals. Begin by answering 3 questions: Where am I now? Where do I want to go? How do I get from here to there?',
    highlights: [
      "Balance today's needs with future goals",
      'Make best use of financial resources',
      'Adapt to changes in circumstances',
      'Save money to achieve goals',
      'Prepare for unexpected emergencies',
      'Manage taxes and protect what matters most',
      'Prepare for retirement and leave something for family',
    ],
    eligibility: [
      'Everyone — college graduates, young people, homemakers, seniors',
      'Applicable at any stage of life',
    ],
    howToApply: [
      'Assess current financial situation',
      'Set short, medium and long-term goals',
      'Create a plan to achieve each goal',
      'Review and update plan regularly',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'financial-goals',
    name: 'Financial Goal Setting',
    shortDesc: 'Set short, medium & long-term goals for financial success',
    category: 'Financial Planning',
    categoryColor: '#6A1B9A',
    emoji: '🏆',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    fullDesc: 'The most important step in financial planning is goal setting. It is essential to set short-term, medium-term and long-term financial goals. Goals give direction and purpose to your savings and investments.',
    highlights: [
      'Short-term goals: Within 1 year (emergency fund, gadget)',
      'Medium-term goals: 1 to 5 years (bike, vacation, education)',
      "Long-term goals: 5+ years (house, retirement, child's marriage)",
      'Goals give direction to savings and investments',
      'Written goals are more likely to be achieved',
    ],
    eligibility: ['Every individual regardless of income level'],
    howToApply: [
      'Write down your financial goals clearly',
      'Categorize as short, medium or long-term',
      'Estimate cost and timeline for each goal',
      'Start saving and investing towards each goal',
      'Review progress every 3-6 months',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'savings',
    name: 'Savings',
    shortDesc: 'Pay yourself first — save before you spend',
    category: 'Savings',
    categoryColor: '#2E7D32',
    emoji: '🐷',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    fullDesc: 'Saving is the portion of income not spent on current expenditures. The right formula is: Expenditure = Income minus Saving. Set aside savings BEFORE spending anything else. This ensures regular savings.',
    highlights: [
      "Right formula: Saving first, then spend what's left",
      'Provides greater security in life',
      'Helps face unexpected events and emergencies',
      'Enables taking risks to try new things',
      'Helps achieve future goals — bike, house, education',
      'Clear high-interest debts before saving',
    ],
    eligibility: [
      'Everyone with any level of income',
      'Even small amounts saved regularly make a difference',
    ],
    howToApply: [
      'Decide a fixed % of income to save every month',
      'Set up auto-transfer to savings account on salary day',
      'Clear high-interest debts first',
      'Use tax-benefit schemes: EPF, PPF, NSC, ELSS, NPS',
      'Keep some in liquid assets for emergencies',
    ],
    website: 'https://www.rbi.org.in/financialeducation',
  },
  {
    id: 'where-to-save',
    name: 'Where to Save?',
    shortDesc: 'Bank FD, RD, Post Office, PPF, NSC — safe saving options',
    category: 'Savings',
    categoryColor: '#2E7D32',
    emoji: '🏦',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    fullDesc: 'There are many options to save money safely. From simple savings accounts to recurring deposits, fixed deposits and post office schemes. Always diversify savings across different instruments and keep some in liquid assets for emergencies.',
    highlights: [
      'Savings Account: Simple, liquid, earns interest',
      'Fixed Deposit (FD): Higher interest for fixed period',
      'Recurring Deposit (RD): Monthly savings habit',
      'Post Office Schemes: Government backed, safe',
      'Tax-benefit schemes: EPF, PPF, NSC, ELSS, SSY, NPS',
      'Do NOT invest in risky, unregulated instruments',
    ],
    eligibility: [
      'Any Indian citizen with valid KYC',
      'Different schemes have different eligibility criteria',
    ],
    howToApply: [
      'Open savings account at any bank or post office',
      'Start RD for monthly disciplined saving',
      'Invest in PPF or NSC for long-term tax benefits',
      'Keep 3-6 months expenses in liquid savings for emergency',
      'Diversify across multiple safe instruments',
    ],
    website: 'https://www.indiapost.gov.in/',
  },
];

export default function BasicsScreen() {
  const router = useRouter();
  const categories = [
    'Income, Expenses & Budgeting',
    'Financial Planning',
    'Savings',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Basic Concepts</Text>
      <Text style={styles.subheading}>{BASICS_TOPICS.length} topics covered</Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={styles.categoryHeader}>{cat}</Text>
          {BASICS_TOPICS.filter((t) => t.category === cat).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/basics/${topic.id}` as any)}
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