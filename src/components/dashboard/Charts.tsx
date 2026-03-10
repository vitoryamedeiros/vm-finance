"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#D81176', '#000000', '#FFFFFF', '#333333', '#666666'];

interface ChartProps {
  expenses: any[];
  incomes: any[];
}

export function DashboardCharts({ expenses, incomes }: ChartProps) {
  // Category Data
  const categoryData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value = Number((existing.value + Number(curr.amount)).toFixed(2));
    } else {
      acc.push({ name: curr.category, value: Number(Number(curr.amount).toFixed(2)) });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Payment Method Data
  const paymentData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.payment_method);
    if (existing) {
      existing.value = Number((existing.value + Number(curr.amount)).toFixed(2));
    } else {
      acc.push({ name: curr.payment_method, value: Number(Number(curr.amount).toFixed(2)) });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Daily Trend (Bar)
  const dailyData = expenses.reduce((acc: any[], curr) => {
    const day = curr.date.split('-')[2];
    const existing = acc.find(item => item.day === day);
    if (existing) {
      existing.amount = Number((existing.amount + Number(curr.amount)).toFixed(2));
    } else {
      acc.push({ day, amount: Number(Number(curr.amount).toFixed(2)) });
    }
    return acc;
  }, []).sort((a, b) => Number(a.day) - Number(b.day));

  const formatValue = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Category Pie */}
      <div className="bg-white text-black border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h3 className="font-heading uppercase text-2xl mb-8 border-b-2 border-black pb-4">
          Gastos por Categoria
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#000', strokeWidth: 2 }}
              >
                {categoryData.map((_entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#D81176' : index === 1 ? '#111' : index === 2 ? '#666' : '#999'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatValue(Number(value || 0))}
                contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '0', color: '#000', fontWeight: 'bold' }}
                itemStyle={{ color: '#D81176', fontWeight: 'black' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h3 className="font-heading uppercase text-2xl mb-8 border-b-2 border-black pb-4">
          Fluxo Diário
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
               <XAxis 
                dataKey="day" 
                stroke="#000" 
                fontSize={12} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={{ stroke: '#000', strokeWidth: 2 }} 
               />
               <YAxis 
                stroke="#000" 
                fontSize={10} 
                fontWeight="bold"
                tickFormatter={(val) => `R$${val}`}
                tickLine={false}
                axisLine={false}
               />
               <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  formatter={(value: any) => formatValue(Number(value || 0))}
                  contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '0', color: '#000', fontWeight: 'bold' }}
                  itemStyle={{ color: '#D81176', fontWeight: 'black' }}
               />
               <Bar dataKey="amount" fill="#111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
