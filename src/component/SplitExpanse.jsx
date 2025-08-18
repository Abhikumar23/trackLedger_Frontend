import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {Home,Users,Plus,X,DollarSign,ShoppingBag,UserPlus,Calculator,Trash2} from 'lucide-react';

export default function ExpenseSplitter() {
  const [category, setCategory] = useState('House Expense');
  const [amount, setAmount] = useState('');
  const [itemName, setItemName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Auth token setup
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Fetch friends from backend
  const fetchFriends = async () => {
    try {
      const res = await axios.get('https://track-ledger-backend.vercel.app/api/friends', { withCredentials: true });
      setAvailableFriends(res.data.friends || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
      toast.error('Failed to load friends');
    }
  };

  // Fetch expenses and friends from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expensesRes = await axios.get('https://track-ledger-backend.vercel.app/api/expenses', { withCredentials: true });
        setExpenses(expensesRes.data);
        
        // Fetch friends
        await fetchFriends();
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, [forceUpdate]);

  // Add friend to backend
  const handleAddFriend = async () => {
    if (newFriendName.trim() && !availableFriends.includes(newFriendName.trim())) {
      try {
        const res = await axios.post('https://track-ledger-backend.vercel.app/api/friends', {
          friendName: newFriendName.trim()
        }, { withCredentials: true });
        setAvailableFriends(prev => [...prev, newFriendName.trim()]);
        setNewFriendName('');
        setShowAddFriend(false);
        toast.success('Friend added!');
      } catch (err) {
        console.error('Failed to add friend:', err);
        toast.error(err.response?.data?.error || 'Failed to add friend');
      }
    }
  };

  const handleFriendToggle = (friend) => {
    setSelectedFriends(prev =>
      prev.includes(friend)
        ? prev.filter(f => f !== friend)
        : [...prev, friend]
    );
  };

  // Remove friend from backend
  const handleRemoveFriend = async (friendToRemove) => {
    try {
      await axios.delete(`https://track-ledger-backend.vercel.app/api/friends/${encodeURIComponent(friendToRemove)}`, { withCredentials: true });
      setAvailableFriends(prev => prev.filter(f => f !== friendToRemove));
      setSelectedFriends(prev => prev.filter(f => f !== friendToRemove));
      toast.success('Friend removed!');
    } catch (err) {
      console.error('Failed to remove friend:', err);
      toast.error('Failed to remove friend');
    }
  };

  const calculateSplit = () => {
    if (!amount || selectedFriends.length === 0) return 0;
    return (parseFloat(amount) / selectedFriends.length).toFixed(2);
  };

  const handleAddExpense = async () => {
    if (!amount || !itemName.trim() || selectedFriends.length === 0) {
      toast.error('Please fill in all fields and select at least one friend');
      return;
    }

    const newExpense = {
      category,
      amount: parseFloat(amount),
      itemName: itemName.trim(),
      friends: selectedFriends,
      amountPerPerson: parseFloat(calculateSplit()),
      date: new Date().toISOString(),
    };

    try {
      const res = await axios.post('https://track-ledger-backend.vercel.app/api/expenses', newExpense, { withCredentials: true });
      setExpenses(prev => [...prev, res.data]);
      setAmount('');
      setItemName('');
      setSelectedFriends([]);
      toast.success('Expense added!');
    } catch (err) {
      console.error('Failed to add expense:', err);
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`https://track-ledger-backend.vercel.app/api/expenses/${expenseId}`, { withCredentials: true });
      setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
      toast.success('Expense deleted!');
    } catch (err) {
      console.error('Failed to delete expense:', err);
      toast.error('Failed to delete expense');
    }
  };

//calculating money by amount

  const getTotalByCategory = (cat) => {
    return expenses
      .filter(expense => expense.category === cat)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Clear all friends from backend
  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all friends? This cannot be undone.')) {
      try {
        await axios.delete('https://track-ledger-backend.vercel.app/api/friends', { withCredentials: true });
        setAvailableFriends([]);
        setSelectedFriends([]);
        toast.success('All friends cleared!');
      } catch (err) {
        console.error('Failed to clear friends:', err);
        toast.error('Failed to clear friends');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 mt-2 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Expense Splitter</h1>
          </div>
          <p className="text-gray-300">Split expenses between friends and track house expenses</p>
          <div className="flex items-center justify-center space-x-4 mt-4 gap-1">
            <div className="text-sm text-gray-400">
              Total Expenses: {expenses.length} | Total Friends: {availableFriends.length} |
            </div>
            <button
              onClick={handleClearAllData}
              className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
             Clear All Friends
            </button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">House Expenses</p>
                  <p className="text-2xl font-bold text-white">₹{getTotalByCategory('House Expense').toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-300 text-sm">Friends Expenses</p>
                  <p className="text-2xl font-bold text-white">₹{getTotalByCategory('Friends Expense').toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Add New Expense
          </h2>

          {/* Category Selection */}
          <div className="mb-6 ">
            <label className="block text-sm font-medium text-gray-500 mb-2">Category</label>
            <div className="flex gap-4">
              <button
                onClick={() => setCategory('House Expense')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  category === 'House Expense'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>House Expense</span>
              </button>
              <button
                onClick={() => setCategory('Friends Expense')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  category === 'Friends Expense'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Friends Expense</span>
              </button>
            </div>
          </div>

          {/* Amount and Item Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Amount (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Item Name</label>
              <input
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Friends Management */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-500">Select Friends to Split With</label>
              <button
                onClick={() => setShowAddFriend(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600
                          hover:to-pink-600 transition-all transform hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Friend</span>
              </button>
            </div>

            {/* Add Friend Modal */}
            {showAddFriend && (
              <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Friend's name"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={(e) => e.key === 'Enter' && handleAddFriend()}
                  />
                  <button
                    onClick={handleAddFriend}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowAddFriend(false);
                      setNewFriendName('');
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Friends List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-center">
              {availableFriends.map(friend => (
                <div
                  key={friend}
                  className={`relative group flex items-center justify-between p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    selectedFriends.includes(friend)
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  onClick={() => handleFriendToggle(friend)}
                >
                  <span className="font-medium">{friend}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Split Preview */}
          {selectedFriends.length > 0 && amount && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Split Amount</p>
                  <p className="text-2xl font-bold text-white">₹{calculateSplit()} per person</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-300 text-sm">Total Friends</p>
                  <p className="text-2xl font-bold text-white">{selectedFriends.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={handleAddExpense}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Expenses List */}
        {expenses.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Recent Expenses</h2>
            <div className="space-y-4">
              {expenses.map(expense => (
                <div key={expense._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        expense.category === 'House Expense'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {expense.category === 'House Expense' ? <Home className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{expense.itemName}</h3>
                        <p className="text-sm text-red-400">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">₹{expense.amount.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-green-400">₹{expense.amountPerPerson} per person</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="ml-4 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {expense.friends.map(friend => (
                      <span key={friend} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {friend}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}