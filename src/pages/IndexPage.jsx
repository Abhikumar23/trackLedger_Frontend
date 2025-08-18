import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";
import { features, testimonials } from "../data/Data.jsx";
import {ChevronRight,Wallet,Users,Home,TrendingUp,Eye,EyeOff,Plus,Minus,DollarSign,Calendar,
        PieChart,BarChart3,Shield,Smartphone,} from "lucide-react";

export default function IndexPage() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user } = useContext(UserContext);

  const [expenseDemo, setExpenseDemo] = useState([
    { id: 1, category: "Personal Expense", amount: 1500, color: "bg-red-500" },
    { id: 2, category: "House Expense", amount: 1000, color: "bg-blue-500" },
    { id: 3, category: "Entertainment", amount: 500, color: "bg-purple-500" },
  ]);

// this is for testimonial in change in every 4 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  //this is for mouse hover
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //
  const addExpense = () => {
    if (expenseDemo.length > 4) {
      return;
    }

    const categories = [
      "Personal Expense",
      "House Expense",
      "Friends",
      "Bills",
    ];
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];

// for demo section item and color.....
    const newExpense = {
      id: Date.now(),
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: Math.floor(Math.random() * 2000) + 500,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setExpenseDemo([...expenseDemo, newExpense]);
  };

  const removeExpense = (id) => {
    setExpenseDemo(expenseDemo.filter((expense) => expense.id !== id));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-4xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-4xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              HisabKitab
            </h1> */}
          </div>

          {/* Navigation links (stay centered) */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <a
              href="#features"
              className="hover:text-purple-400 transition-colors"
            >
              Features
            </a>
            <a href="#demo" className="hover:text-purple-400 transition-colors">
              Demo
            </a>
            <a
              href="#testimonials"
              className="hover:text-purple-400 transition-colors"
            >
              Reviews
            </a>
          </div>

          {/* Sign up button - aligned right, fixed width to prevent shifting */}
          <div className="w-[150px] flex justify-end">
            {!user && (
              <Link to="/register">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/25 
                                   transition-all duration-300 transform hover:scale-105 animate-pulse">
                  Sign up
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
            Track Every Rupee
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Your smart companion for managing monthly expenses, household costs,
            and splitting bills with friends
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl 
                             hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Tracking</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-purple-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative z-10 container mx-auto px-6 py-10">
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Try It Live
        </h3>
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                <PieChart className="w-6 h-6 text-purple-400" />
                <span>Expense Tracker Demo</span>
              </h4>
              <div className="space-y-4">
                {expenseDemo.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 ${expense.color} rounded-full`}
                      />
                      <span className="font-medium">{expense.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">
                        ₹{expense.amount}
                      </span>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="text-red-500 hover:text-red-300 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addExpense}
                className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-full hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        ₹{expenseDemo.reduce((sum, exp) => sum + exp.amount, 0)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Total Expenses
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 container mx-auto px-6 py-16"
      >
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Powerful Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              onMouseEnter={() => setIsVisible({ ...isVisible, [index]: true })}
              onMouseLeave={() =>
                setIsVisible({ ...isVisible, [index]: false })
              }
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
              {isVisible[index] && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="relative z-10 container mx-auto px-6 py-16"
      >
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          What Users Say
        </h3>
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 min-h-[200px]">
            <div className="transition-all duration-500 ease-in-out">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonials[currentSlide].avatar}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {testimonials[currentSlide].name}
                  </h4>
                  <p className="text-gray-400">
                    {testimonials[currentSlide].role}
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-300 italic">
                "{testimonials[currentSlide].content}"
              </p>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-purple-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Take Control?
          </h3>
{
  user ? (
    <Link to="/home">
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
        Start Your Journey
      </button>
    </Link>
  ) : (
    <Link to="/login">
      <button className="bg-gray-300 px-12 py-4 rounded-full text-lg font-semibold text-gray-700 hover:shadow-md transition-all duration-300">
        Go to Home
      </button>
    </Link>
  )
}

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">HisabKitab</span>
          </div>
          <div className="text-gray-400">
            © 2025 Abishek Kumar. Made with ❤️ for better expense tracking.
          </div>
        </div>
      </footer>
    </div>
  );
}
