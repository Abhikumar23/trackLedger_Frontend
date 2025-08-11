// data.js
import { Wallet, Home, Users, TrendingUp } from "lucide-react";

export const features = [
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Monthly Expense Tracking",
    description:
      "Track your monthly expenses with detailed categorization and insights",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: "House Expense Management",
    description:
      "Manage household expenses, bills, and shared costs efficiently",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Friends Expense Splitting",
    description: "Split expenses with friends and track who owes what",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Smart Analytics",
    description: "Get insights into your spending patterns and trends",
    color: "from-orange-500 to-red-500",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    role: "Working Professional",
    content:
      "HisabKitab has completely transformed how I manage my monthly expenses. The friend expense splitting feature is a game-changer!",
    avatar: "PS",
  },
  {
    name: "Rahul Gupta",
    role: "Student",
    content:
      "Perfect for tracking house expenses with roommates. No more awkward conversations about who owes what!",
    avatar: "RG",
  },
  {
    name: "Anjali Patel",
    role: "Homemaker",
    content:
      "The analytics help me understand where our family money goes. Simple, effective, and beautifully designed.",
    avatar: "AP",
  },
];
