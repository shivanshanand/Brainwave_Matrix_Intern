// components/dashboard/SpendingChart.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

const SpendingChart = ({ expenses, period }) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date();
    let startDate, days;

    switch (period) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        days = eachDayOfInterval({ start: startDate, end: now });
        break;
      case 'last3Months':
        startDate = subDays(now, 90);
        days = eachDayOfInterval({ start: startDate, end: now }).filter((_, i) => i % 3 === 0); // Every 3rd day
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        days = eachDayOfInterval({ start: startDate, end: now }).filter((_, i) => i % 7 === 0); // Weekly
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        days = eachDayOfInterval({ start: startDate, end: now });
    }

    // Group expenses by date
    const expensesByDate = expenses.reduce((acc, expense) => {
      const date = format(startOfDay(new Date(expense.date)), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      
      if (expense.type === 'income') {
        acc[date].income += expense.amount;
      } else {
        acc[date].expense += expense.amount;
      }
      
      return acc;
    }, {});

    // Create chart data with all days
    return days.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayData = expensesByDate[dateKey] || { income: 0, expense: 0 };
      
      return {
        date: format(date, period === 'thisMonth' ? 'MMM dd' : period === 'last3Months' ? 'MMM dd' : 'MMM'),
        fullDate: dateKey,
        income: dayData.income,
        expense: dayData.expense,
        net: dayData.income - dayData.expense
      };
    });
  }, [expenses, period]);

  // Calculate totals for display
  const totals = useMemo(() => {
    return chartData.reduce((acc, day) => ({
      totalIncome: acc.totalIncome + day.income,
      totalExpense: acc.totalExpense + day.expense,
      totalNet: acc.totalNet + day.net
    }), { totalIncome: 0, totalExpense: 0, totalNet: 0 });
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121214] border border-[#26262B] rounded-xl p-4 shadow-lg">
          <p className="text-[#EDEDEF] font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-[#B3B3B8] text-sm capitalize">
                {entry.dataKey}:
              </span>
              <span className={`font-semibold text-sm ${
                entry.dataKey === 'income' ? 'text-emerald-400' :
                entry.dataKey === 'expense' ? 'text-rose-400' :
                'text-cyan-400'
              }`}>
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDEDEF]">Spending Trend</h3>
          <div className="h-8 w-8 rounded-lg bg-[#1E1E22] grid place-items-center">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        
        <div className="h-80 bg-[#0B0B0C] rounded-xl border border-[#26262B] grid place-items-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-[#8A8A92] mx-auto mb-3" />
            <p className="text-[#8A8A92] text-sm">No data available</p>
            <p className="text-xs text-[#6A6A72] mt-1">
              Add some transactions to see spending trends
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#EDEDEF] mb-1">Spending Trend</h3>
          <p className="text-xs text-[#8A8A92]">
            {period === 'thisMonth' ? 'Daily' : period === 'last3Months' ? 'Every 3 days' : 'Weekly'} overview
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-[#1E1E22] grid place-items-center">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B]">
          <div className="text-xs text-[#8A8A92] mb-1">Total Income</div>
          <div className="text-lg font-semibold text-emerald-400">
            ₹{totals.totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B]">
          <div className="text-xs text-[#8A8A92] mb-1">Total Expense</div>
          <div className="text-lg font-semibold text-rose-400">
            ₹{totals.totalExpense.toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B]">
          <div className="text-xs text-[#8A8A92] mb-1">Net Flow</div>
          <div className={`text-lg font-semibold ${
            totals.totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            ₹{totals.totalNet.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#2B2B31" strokeOpacity={0.3} />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A8A92', fontSize: 12 }}
              tickMargin={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A8A92', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                color: '#B3B3B8'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="income"
              stroke="#34D399"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F43F5E"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expense"
            />
            
            <Line
              type="monotone"
              dataKey="net"
              stroke="#22D3EE"
              strokeWidth={2}
              dot={{ fill: '#22D3EE', r: 4 }}
              activeDot={{ r: 6, fill: '#22D3EE' }}
              name="Net Flow"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
