import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  ChevronRight,
  Download,
  FileText
} from 'lucide-react';
import { dataService } from '../services/api';
import { Report } from '../types';
import { formatDate } from '../utils/helpers';

export const HistoryPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await dataService.getReports();
        setReports(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.professional_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8">Carregando histórico...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Histórico de Produção</h2>
          <p className="text-zinc-500">Consulte todos os relatórios enviados pelo grupo.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar profissional ou praça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium text-sm shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
            <Download size={20} className="text-zinc-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Data</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Profissional</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Praça</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{formatDate(report.report_date)}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{report.day_of_week}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-black">
                        {report.professional_name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm">{report.professional_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <MapPin size={14} />
                      <span className="text-sm font-medium">{report.location_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-black text-zinc-900">
                      {report.total_production}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-all font-bold text-xs uppercase tracking-widest">
                      Detalhes
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-400 font-medium">
                    Nenhum relatório encontrado para esta busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
