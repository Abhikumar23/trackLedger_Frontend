import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { MdCurrencyRupee } from "react-icons/md";


export default function EditTransactionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  async function updateForm(e) {
    e.preventDefault();

    const price = name.split(" ")[0];
    if (!price || isNaN(parseFloat(price))) {
      alert("Please enter a valid amount and item (e.g., '-500 Rent')");
      return;
    }

    const url = `http://localhost:4000/api/transactionLog/${id}`; 

    try {
      await axios.put(url, {
        name: name.substring(price.length + 1),
        date,
        description,
        category,
        price: parseFloat(price),
      });
      toast.success("Transation Updated..")
      navigate("/transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  }

  async function fetchData() {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/transaction/${id}`
      );
      const data = res.data.data;

      setName(`${data.price} ${data.name}`);
      setDate(data.date.slice(0, 16)); // Format for datetime-local
      setDescription(data.description);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  return (

    <main className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden mt-2 rounded-xl min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Update Transaction</h2>
            <p className="text-gray-300">Track your expenses and income</p>
          </div>
          
          <form onSubmit={updateForm} className="space-y-6">
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

    </main>
  );
}
