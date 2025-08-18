import { useEffect , useState } from 'react';
import axios from 'axios';
import BarChartPage from './component/BarChartPage';
import { MdCurrencyRupee } from "react-icons/md";
// import { useNavigate} from 'react-router-dom';
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";
import { toast } from 'react-toastify';
import UserSummary from './component/UserSummary';
import SplitExpanse from './component/SplitExpanse.jsx'
import {Link} from "react-router-dom";
import {Wallet,Calculator, ChevronRight} from "lucide-react";

function Home( {totalBalance, setRefresh, setTotalBalance}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [category, setCategory]= useState('');
  const [showSplitter, setShowSplitter] = useState(false);

  const{user} = useContext(UserContext);
  // const navigate = useNavigate();

  //for showing montely expense as bar chart;

const monthlyExpense = async () => {
  try {
    const url = 'https://track-ledger-backend.vercel.app/api/transaction/monthly-summary';
    const res = await axios.get(url);

    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    const grouped = {};

    res.data.forEach(entry => {
      const monthName = monthNames[entry.month - 1];
      const category = entry.category || 'Uncategorized';
      
      // Create a unique key for month + category combination
      const key = `${monthName}-${category}`;
      
      if (!grouped[key]) {
        grouped[key] = { 
          month: monthName, 
          category: category 
        };
      }

      const itemName = entry.name?.trim() || 'Unnamed';
      const total = parseFloat(entry.total || 0);

      grouped[key][itemName] = (grouped[key][itemName] || 0) + total;
    });

    const formattedData = Object.values(grouped);
    // console.log("Formatted chart data with categories:", formattedData);
    setMonthlyData(formattedData);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
  }
};

  useEffect(()=>{
    monthlyExpense();
  },[])
//_____________________________

    const fetchBalance = async () => {
    try {
      const url = 'https://track-ledger-backend.vercel.app/api/transaction';
      const res = await axios.get(url);
      const data = res.data.data;

      const balance = data.reduce((sum, t) => {
        const price = parseFloat(t.price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      setTotalBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

const submitForm = async (event) => {
  event.preventDefault();

  const parts = name.trim().split(' ');
  if (parts.length < 2) {
    toast.warning("Enter amount and item (e.g., '-500 Rent')");
    return;
  }

  const price = parts[0];
  const item = parts.slice(1).join(' ');

  try {
    await axios.post('https://track-ledger-backend.vercel.app/api/transactionLog', {
      name: item,
      date,
      description,
      category,
      price: parseFloat(price),
    });
  toast.success("transaction added successfully..");
    setName('');
    setDate('');
    setDescription('');
    setRefresh(prev => !prev);
    fetchBalance();

  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  return (

  <main className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden min-h-screen py-6 px-4">
        {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-4xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-4xl animate-bounce" />
      </div>

{/* SplitExpanse Button + Toggle UI */}
<div className="relative md:gap-y-[-0.5rem]">
  {/* Always visible button in top-right */}
  <Link to="/split-expanse" className="absolute top-4 gap-1 right-4 z-10 flex">
    <button
      onClick={(e) => {
        setShowSplitter(!showSplitter);
      }}
      className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden rounded-2xl px-3 py-2 cursor-pointer
                 transition-300 animate-pulse flex items-center justify-center space-x-1 text-sm md:text-base md:px-6"
    >
      <span className='bg-gradient-to-br from-purple-400 to-pink-400 rounded'><Calculator className="w-6 h-6 md:w-10 md:h-10 text-white " /></span>
      <span className='font-bold hidden sm:inline'>Split Expense</span>
    </button>
  </Link>

  {/* Conditionally show component below the button */}
  {showSplitter && (
    <div className="mt-20 px-4">
      <SplitExpanse />
    </div>
  )}
</div>


  <h1
    className="text-4xl font-bold text-white text-center flex items-center justify-center mt-16 md:mt-8 pr-4 md:pr-0"
    aria-label={`Total Balance is ₹${totalBalance.toLocaleString('en-IN')}`}
  >
    <MdCurrencyRupee className="mr-1" />
    {totalBalance.toLocaleString('en-IN')}
  </h1>
      
      {/* Enhanced Form Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Add New Transaction</h2>
            <p className="text-gray-300">Track your expenses and income</p>
          </div>
          
          <form onSubmit={submitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Amount & Item
                </label>
                <div className="relative">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="e.g., -500 Rent or +2000 Salary"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MdCurrencyRupee className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Date & Time
                </label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            
<div className="flex flex-col md:flex-row gap-4">
  {/* Dropdown */}
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="flex-1 px-4 py-4 rounded-xl border bg-white/10 text-white backdrop-blur-sm
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
  >
            <option value="Monthly Expense" className="bg-slate-800">All Categories</option>
            <option value="House Expense" className="bg-slate-800">House Expense</option>
            <option value="Friends Expense" className="bg-slate-800">Friends Expense</option>
            <option value="Personal Expense" className="bg-slate-800">Personal Expense</option>
  </select>

  {/* Textarea */}
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white
               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
               transition-all duration-200 resize-none"
    rows="3"
    placeholder="Add any additional notes...(optional)"
  />
</div>

            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 
                         rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2
                          focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span className="flex items-center justify-center">
                <MdCurrencyRupee className="mr-2" />
                Add Transaction
              </span>
            </button>
          </form>
        </div>
      </div>

{/* Different Components */}
<div>
  <BarChartPage data={monthlyData}/>
  <UserSummary monthlyData={monthlyData} />
</div>
    </main>

  );

}

export default Home;