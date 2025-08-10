// components/dashboard/CategoryBreakdown.jsx
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { PieChart as PieChartIcon, BarChart3 } from "lucide-react";

const CategoryBreakdown = ({ expenses, period }) => {
  const [chartType, setChartType] = React.useState('pie'); // 'pie' or 'bar'

  // Process category data
  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Filter only expenses (not income)
    const expenseData = expenses.filter(exp => exp.type === 'expense');
    
    // Group by category
    const categoryTotals = expenseData.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Convert to array and sort
    const sortedCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0 // Will calculate below
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate percentages
    const total = sortedCategories.reduce((sum, item) => sum + item.amount, 0);
    sortedCategories.forEach(item => {
      item.percentage = total > 0 ? (item.amount / total) * 100 : 0;
    });

    return sortedCategories;
  }, [expenses]);

  // Color palette for categories
  const COLORS = [
    '#22D3EE', // Cyan
    '#8B5CF6', // Violet  
    '#34D399', // Emerald
    '#F59E0B', // Amber
    '#F43F5E', // Rose
    '#06B6D4', // Cyan-600
    '#7C3AED', // Violet-600
    '#10B981', // Emerald-600
    '#D97706', // Amber-600
    '#DC2626', // Red-600
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121214] border border-[#26262B] rounded-xl p-4 shadow-lg">
          <p className="text-[#EDEDEF] font-medium">{data.category}</p>
          <p className="text-cyan-400 font-semibold">₹{data.amount.toLocaleString()}</p>
          <p className="text-[#8A8A92] text-sm">{data.percentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#EDEDEF" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Empty state
  if (categoryData.length === 0) {
    return (
      <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDEDEF]">Category Breakdown</h3>
          <div className="h-8 w-8 rounded-lg bg-[#1E1E22] grid place-items-center">
            <PieChartIcon className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        
        <div className="h-64 bg-[#0B0B0C] rounded-xl border border-[#26262B] grid place-items-center">
          <div className="text-center">
            <PieChartIcon className="w-12 h-12 text-[#8A8A92] mx-auto mb-3" />
            <p className="text-[#8A8A92] text-sm">No expense categories yet</p>
            <p className="text-xs text-[#6A6A72] mt-1">
              Add expenses to see category breakdown
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
          <h3 className="text-lg font-semibold text-[#EDEDEF] mb-1">Category Breakdown</h3>
          <p className="text-xs text-[#8A8A92]">
            Top {Math.min(categoryData.length, 10)} expense categories
          </p>
        </div>
        
        {/* Chart type toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('pie')}
            className={`h-8 w-8 rounded-lg grid place-items-center transition-all ${
              chartType === 'pie' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-[#1E1E22] text-[#8A8A92] hover:text-cyan-400'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`h-8 w-8 rounded-lg grid place-items-center transition-all ${
              chartType === 'bar' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-[#1E1E22] text-[#8A8A92] hover:text-cyan-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {chartType === 'pie' ? (
        // Pie Chart View
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData.slice(0, 8)} // Top 8 categories
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        // Bar Chart View
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData.slice(0, 6)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B31" strokeOpacity={0.3} />
              <XAxis 
                dataKey="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A8A92', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A8A92', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#22D3EE"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category List */}
      <div className="mt-6 space-y-3">
        {categoryData.slice(0, 5).map((category, index) => (
          <div key={category.category} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-[#EDEDEF] text-sm font-medium">
                {category.category}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[#EDEDEF] text-sm font-semibold">
                ₹{category.amount.toLocaleString()}
              </div>
              <div className="text-[#8A8A92] text-xs">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
