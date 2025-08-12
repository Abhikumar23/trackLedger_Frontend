import { useEffect, useState } from "react";
import axios from "axios";
// import EditTranactionPage from "./EditTranactionPage";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';
import { useMemo } from 'react';

export default function TransactionList({ refresh, setTotalBalance }) {
  const [transactions, setTransactions] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

const filteredTransactions = useMemo(() => {
  return transactions.filter(transaction =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}, [transactions, searchTerm]);


  // here were fetching the data from api/transactionlog(post request)
// 1. Fetch transactions
useEffect(() => {
  const fetchData = async () => {
    try {
      const url = "https://track-ledger-backend.vercel.app/api/transaction";
      const res = await axios.get(url);
      const data = res.data.data;
      setTransactions(data); // Only update this state here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [refresh]);

// 2. Calculate balance AFTER transactions are set
useEffect(() => {
  const balance = transactions.reduce((sum, t) => {
    const price = parseFloat(t.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  setTotalBalance(balance); // This safely updates parent App state
}, [transactions]);



  // deleting the transaction
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    
    if (!confirmDelete){
      return;
    } 

    try {
      await axios.delete(`https://track-ledger-backend.vercel.app/api/transactionLog/${id}`);
      setTransactions((prev) => {
        const updated = prev.filter((t) => t._id !== id);
        const newBalance = updated.reduce(
          (sum, t) => sum + parseFloat(t.price || 0),
          0
        );
        setTotalBalance(newBalance);
        return updated;
      });

      toast.success("Transaction Deleted..");

    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  // editing the saved transaction

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 mt-2 rounded-xl min-h-screen py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-8">
{/* Centered Search */}
<div className="flex justify-center">
  <div className="relative w-full max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl
                 text-white placeholder-gray-400 focus:outline-none focus:ring-2
                 focus:ring-purple-500 focus:border-transparent"
    />
  </div>
</div>

        <h2 className="text-3xl font-bold text-white mb-2">Transaction History</h2>
        <p className="text-gray-300">Manage your financial records</p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Transaction Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => {
            const amount = parseFloat(transaction.price);
            const isExpense = amount < 0;
            const isExpanded = expandedItems[transaction._id] || false;

            return (
              <div
                key={index}
                className={`group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                  isExpense 
                    ? 'hover:border-red-400/50 hover:bg-red-500/10' 
                    : 'hover:border-green-400/50 hover:bg-green-500/10'
                }`}
style={{
  animationName: 'fadeIn',
  animationDuration: '1s',
  animationDelay: '2s',
  animationTimingFunction: 'ease-in-out',
  animationFillMode: 'forwards',
}}

              >
                {/* Transaction Type Indicator */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  isExpense ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {isExpense ? '−' : '+'}
                </div>
                 
                 {/* Category name */}
                <div className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-200">
                    {transaction.category}
                </div>

                {/* Transaction Name */}
                <div className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-200">
                  {transaction.name}
                </div>

                {/* Amount - Most Prominent */}
                <div className={`text-2xl font-bold mb-4 ${
                  isExpense ? 'text-red-400' : 'text-green-400'
                }`}>
                  ₹{Math.abs(amount).toLocaleString('en-IN')}
                </div>

                {/* Description with Read More */}
                {transaction.description && (
                  <div className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {isExpanded || transaction.description.length <= 60
                      ? transaction.description
                      : transaction.description.slice(0, 60) + "..."}
                    {transaction.description.length > 60 && (
                      <button
                        onClick={() =>
                          setExpandedItems((prev) => ({
                            ...prev,
                            [transaction._id]: !isExpanded,
                          }))
                        }
                        className="text-purple-400 ml-2 underline hover:text-purple-300 transition-colors duration-200"
                      >
                        {isExpanded ? "show less" : "read more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="text-gray-400 text-sm mb-6 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(transaction.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="group/delete flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 transition-all duration-200 hover:scale-110"
                    title="Delete transaction"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-400 group-hover/delete:text-red-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>

                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/40 rounded-xl text-blue-300 font-medium transition-all duration-200 hover:scale-105 hover:text-blue-200"
                    onClick={() =>
                      navigate(
                        `/transactions/updateTransaction/${transaction._id}`
                      )
                    }
                  >
                    Edit
                  </button>
                </div>

                {/* Glassmorphism overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
            <p className="text-gray-400 text-center">Start tracking your finances by adding your first transaction</p>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}