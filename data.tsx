import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Calendar,
  IndianRupee,
  PiggyBank,
  TrendingUp,
  Wallet,
  Shield,
  Bell,
  Sparkles,
  ReceiptText,
  Tag,
  Activity,
} from "lucide-react";

// Stats Data - Updated for personal finance metrics
export const statsData = [
  {
    value: "₹50K+",
    label: "Total Budgets Created",
    icon: () => <PiggyBank className="h-6 w-6 text-green-600" />,
  },
  {
    value: "1M+",
    label: "Transactions Tracked",
    icon: () => <CreditCard className="h-6 w-6 text-blue-600" />,
  },
  {
    value: "95%",
    label: "Savings Improved",
    icon: () => <TrendingUp className="h-6 w-6 text-emerald-600" />,
  },
  {
    value: "4.8/5",
    label: "User Satisfaction",
    icon: () => <Shield className="h-6 w-6 text-amber-600" />,
  },
];

// Features Data - Focused on budgeting and transactions
export const featuresData = [
  {
    icon: () => <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Budget Visualization",
    description: "Interactive charts to track your budget vs actual spending",
  },
  {
    icon: () => <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Transaction Management",
    description: "Easily add, edit, and categorize all your transactions",
  },
  {
    icon: () => <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Spending Analysis",
    description: "Breakdown of expenses by category with visual charts",
  },
  {
    icon: () => <Calendar className="h-8 w-8 text-blue-600" />,
    title: "Monthly Tracking",
    description: "Compare monthly spending patterns and trends",
  },
  {
    icon: () => <Sparkles className="h-8 w-8 text-blue-600" />,
    title: "AI Financial Advisor",
    description: "Get personalized, AI-driven advice and budget warnings based on your spending habits",
  },
  {
    icon: () => <ReceiptText className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description: "Auto-fill transactions by simply uploading a picture of your receipt",
  },
  {
    icon: () => <Tag className="h-8 w-8 text-blue-600" />,
    title: "Auto-Categorization",
    description: "Our AI automatically categorizes merchants and expenses to save you time",
  },
  {
    icon: () => <Activity className="h-8 w-8 text-blue-600" />,
    title: "Predictive Cash Flow",
    description: "Project your end-of-month balance and automatically detect hidden subscriptions",
  },
  {
    icon: () => <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Natural Language Entry",
    description: "Just type 'Spent ₹150 on coffee' and the AI handles the rest automatically",
  },
];

// How It Works Data - Updated for your workflow
export const howItWorksData = [
  {
    icon: () => <Shield className="h-8 w-8 text-blue-600" />,
    title: "1. Link Securely",
    description: "Provide your own Gemini or OpenAI API key. It's safely stored locally on your device.",
  },
  {
    icon: () => <ReceiptText className="h-8 w-8 text-blue-600" />,
    title: "2. Track with AI",
    description: "Upload receipts, type naturally, or let our AI auto-categorize your manual entries.",
  },
  {
    icon: () => <Sparkles className="h-8 w-8 text-blue-600" />,
    title: "3. Grow your Wealth",
    description: "Receive AI-powered savings tips, budget alerts, and predictive cash flow analytics.",
  },
];


 
export const testimonialsData = [
  {
    name: "Priya Sharma",
    role: "Small Business Owner (Delhi)",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "This app has revolutionized how I manage my boutique finances. The budget tracking helps me maintain healthy cash flow during seasonal fluctuations.",
  },
  {
    name: "Rahul Patel",
    role: "Freelance Developer (Bangalore)",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "As a freelancer with multiple clients, the transaction categorization saves me hours during tax season. GST-compliant reports are a lifesaver!",
  },
  {
    name: "Ananya Gupta",
    role: "Financial Consultant (Mumbai)",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend this to all my clients. The Rupee-focused analytics and local bank integration make it perfect for Indian financial planning.",
  },
  {
    name: "Vikram Singh",
    role: "Startup Founder (Hyderabad)",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    quote:
      "The expense tracking with Indian payment modes like UPI and NetBanking helps me monitor my burn rate accurately. Essential for any Indian startup!",
  },
  {
    name: "Neha Joshi",
    role: "Homemaker (Chennai)",
    image: "https://randomuser.me/api/portraits/women/77.jpg",
    quote:
      "Managing household budgets became so much easier with the monthly spending analysis. I can now plan better for school fees and family expenses.",
  },
];