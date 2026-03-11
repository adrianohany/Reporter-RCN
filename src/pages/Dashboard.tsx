import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MapPin
} from 'lucide-react';
import { dataService } from '../services/api';
import { DashboardData } from '../types';
import { motion } from 'motion/react';
import { cn } from '../utils/helpers';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const dashboardData = await dataService.getDashboardData(filters);
        setData(dashboardData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [filters]);

  if (isLoading || !data) return <div className="flex items-center justify-center h-96 font-bold text-zinc-400">Carregando indicadores...</div>;

  const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8'];

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Dashboard Executivo</h2>
          <p className="text-zinc-500">Visão geral da produção de conteúdo do grupo.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm">
          <Filter size={18} className="text-zinc-400 ml-2" />
          <select 
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            className="bg-transparent font-bold text-sm focus:outline-none p-2"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            className="bg-transparent font-bold text-sm focus:outline-none p-2"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Produzido', value: data.summary.totalContents, icon: FileText, color: 'bg-zinc-900', textColor: 'text-white' },
          { label: 'Relatórios Enviados', value: data.summary.totalReports, icon: Users, color: 'bg-white', textColor: 'text-zinc-900' },
          { label: 'Média por Relatório', value: data.summary.avgPerReport, icon: TrendingUp, color: 'bg-white', textColor: 'text-zinc-900' },
          { label: 'Dias com Envio', value: data.summary.uniqueDays, icon: Calendar, color: 'bg-white', textColor: 'text-zinc-900' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-[32px] border border-zinc-200 shadow-sm flex flex-col justify-between h-40",
              stat.color,
              stat.textColor
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl", stat.color === 'bg-zinc-900' ? 'bg-white/10' : 'bg-zinc-100')}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={20} className="opacity-30" />
            </div>
            <div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className={cn("text-[10px] uppercase font-black tracking-widest opacity-50", stat.textColor === 'text-white' ? 'text-white' : 'text-zinc-400')}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Journalist Ranking */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight">Top 5 Jornalistas</h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Volume de Produção</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topJournalists} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#71717a' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={32}>
                  {data.topJournalists.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-8">Distribuição por Produto</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                >
                  {data.topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-xs font-bold text-zinc-600">{p.name}</span>
                </div>
                <span className="text-xs font-black">{p.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* High Production Days */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-6">Dias de Maior Produção</h3>
          <div className="space-y-4">
            {data.topDays.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:bg-zinc-900 hover:text-white transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs shadow-sm">
                    {i + 1}º
                  </div>
                  <div>
                    <p className="font-bold">{new Date(day.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-50">Data do Relatório</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">{day.total}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-50">Conteúdos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Production */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-6">Produção por Praça</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(data.locationProduction).map(([name, total]) => ({ name, total }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '16px', border: 'none' }}
                />
                <Bar dataKey="total" fill="#18181b" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
