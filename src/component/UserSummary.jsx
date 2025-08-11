import { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';

export default function UserSummary({ monthlyData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showOnlyDebtors, setShowOnlyDebtors] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [filterExpense, setFilterExpense] = useState('all');

  const getAllUserTotals = () => {
    const userTotals = {};
    if (!monthlyData || !Array.isArray(monthlyData)) return userTotals;

    monthlyData.forEach(monthData => {
      if (monthData && typeof monthData === 'object') {
        Object.keys(monthData).forEach(key => {
          if (key !== 'month' && key !== 'category') {
            const amount = Number(monthData[key]) || 0;
            userTotals[key] = (userTotals[key] || 0) + amount;
          }
        });
      }
    });
    return userTotals;
  };

  const getUserTotals = () => {
    const userTotals = {};
    if (!monthlyData || !Array.isArray(monthlyData)) return userTotals;

    monthlyData.forEach(monthData => {
      if (monthData && typeof monthData === 'object') {
        Object.keys(monthData).forEach(key => {
          if (key !== 'month' && key !== 'category') {
            const shouldInclude =
              filterExpense === 'all' ||
              (filterExpense === 'House Expense' && monthData.category === 'House Expense') ||
              (filterExpense === 'Friends Expense' && monthData.category === 'Friends Expense') ||
              (filterExpense === 'Personal Expense' && monthData.category === 'Personal Expense');

            if (shouldInclude) {
              const amount = Number(monthData[key]) || 0;
              userTotals[key] = (userTotals[key] || 0) + amount;
            }
          }
        });
      }
    });
    return userTotals;
  };

  const getUserMonthlyBreakdown = userName => {
    const breakdown = [];
    if (!monthlyData || !Array.isArray(monthlyData)) return breakdown;

    monthlyData.forEach(monthData => {
      if (monthData && monthData.month && monthData[userName] !== undefined) {
        const shouldInclude =
          filterExpense === 'all' ||
          (filterExpense === 'House Expense' && monthData.category === 'House Expense') ||
          (filterExpense === 'Friends Expense' && monthData.category === 'Friends Expense') ||
          (filterExpense === 'Personal Expense' && monthData.category === 'Personal Expense');

        if (shouldInclude) {
          breakdown.push({
            month: monthData.month,
            amount: Number(monthData[userName]) || 0,
            category: monthData.category || 'Uncategorized'
          });
        }
      }
    });
    return breakdown;
  };

  const allUserTotals = getAllUserTotals();
  const userTotals = getUserTotals();

  const processedUsers = useMemo(() => {
    let users = Object.keys(userTotals)
      .filter(
        user =>
          user.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyDebtors || userTotals[user] < 0)
      )
      .map(user => ({
        name: user,
        amount: userTotals[user],
        monthlyBreakdown: getUserMonthlyBreakdown(user)
      }));

    users.sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      } else {
        return sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });

    return users;
  }, [userTotals, searchTerm, sortBy, sortOrder, showOnlyDebtors, monthlyData, filterExpense]);

  const toggleUserExpansion = userName => {
    setExpandedUsers(prev => ({
      ...prev,
      [userName]: !prev[userName]
    }));
  };

  const stats = useMemo(() => {
    const amounts = Object.values(userTotals);
    const totalUsers = amounts.length;
    const debtors = amounts.filter(amount => amount < 0).length;
    const creditors = amounts.filter(amount => amount > 0).length;
    const totalDebt = amounts.filter(amount => amount < 0).reduce((sum, amount) => sum + Math.abs(amount), 0);
    const totalCredit = amounts.filter(amount => amount > 0).reduce((sum, amount) => sum + amount, 0);

    return { totalUsers, debtors, creditors, totalDebt, totalCredit };
  }, [userTotals]);

  // Show full screen empty state ONLY if no user data exists at all (before any filters)
  if (Object.keys(allUserTotals).length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-md max-w-4xl mx-auto mt-6">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-300">
            No user data available
          </h2>
          <p className="text-gray-400">Start adding transactions to see user summaries</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-400 max-w-4xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">User Summary</h2>
          <div className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full capitalize">
            {filterExpense === 'all' ? 'All Categories' : filterExpense}
          </div>
        </div>
        <div className="text-sm text-gray-300">
          {processedUsers.length} of {stats.totalUsers} users
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
            showOnlyDebtors
              ? 'bg-red-500/80 text-white shadow-lg'
              : 'bg-gradient-to-br from-red-500/20 to-red-600/20 text-white hover:bg-red-500/30'
          }`}
          onClick={() => setShowOnlyDebtors(!showOnlyDebtors)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm">Debtors</p>
              <p className="text-2xl font-bold">{stats.debtors}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm">Creditors</p>
              <p className="text-2xl font-bold text-white">{stats.creditors}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Net Balance</p>
              <p className="text-2xl font-bold text-white">
                ₹{Math.abs(stats.totalCredit - stats.totalDebt).toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="amount" className="bg-slate-800">Sort by Amount</option>
            <option value="name" className="bg-slate-800">Sort by Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterExpense}
            onChange={e => setFilterExpense(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-slate-800">All Categories</option>
            <option value="House Expense" className="bg-slate-800">House Expense</option>
            <option value="Friends Expense" className="bg-slate-800">Friends Expense</option>
            <option value="Personal Expense" className="bg-slate-800">Personal Expense</option>
          </select>
        </div>
      </div>

      {/* User List */}
      {processedUsers.length > 0 ? (
        <div className="space-y-3">
          {processedUsers.map(user => {
            const amount = user.amount;
            const isExpanded = expandedUsers[user.name];
            const amountColor = amount < 0 ? 'text-red-400' : amount > 0 ? 'text-green-400' : 'text-gray-400';
            return (
              <div
                key={user.name}
                className="bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 overflow-hidden border border-white/10"
              >
                <div
                  className="grid grid-cols-3 gap-4 p-4 cursor-pointer"
                  onClick={() => toggleUserExpansion(user.name)}
                >
                  <div className="font-bold capitalize text-white flex items-center space-x-2">
                    <span>{user.name}</span>
                    {amount < 0 && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {amount > 0 && <TrendingUp className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className={`font-bold flex items-center ${amountColor}`}>
                    {amount < 0 ? '-' : '+'}₹{Math.abs(amount).toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm text-gray-400">{user.monthlyBreakdown.length} months</span>
                    {isExpanded ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && user.monthlyBreakdown.length > 0 && (
                  <div className="px-4 pb-4 border-t border-white/10">
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Monthly Breakdown:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {user.monthlyBreakdown.map((month, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-2">
                            <div className="text-xs text-gray-400 flex items-center justify-between">
                              <span>{month.month}</span>
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full capitalize">{month.category}</span>
                            </div>
                            <div className={`text-sm font-semibold ${month.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {month.amount < 0 ? '-' : '+'}₹{Math.abs(month.amount).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No users found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}