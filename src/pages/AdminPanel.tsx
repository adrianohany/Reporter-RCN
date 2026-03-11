import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Settings,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { dataService, adminService } from '../services/api';
import { Professional, Location, ProductType } from '../types';
import { motion } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [newProfName, setNewProfName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profs, locs, types] = await Promise.all([
        dataService.getProfessionals(),
        dataService.getLocations(),
        dataService.getProductTypes()
      ]);
      setProfessionals(profs);
      setLocations(locs);
      setProductTypes(types);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProfessional = async () => {
    if (!newProfName) return;
    try {
      await adminService.addProfessional(newProfName);
      setNewProfName('');
      setMessage('Profissional adicionado com sucesso!');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      alert('Erro ao adicionar profissional');
    }
  };

  const handleDeleteProfessional = async (id: number) => {
    if (confirm('Tem certeza que deseja desativar este profissional?')) {
      await adminService.deleteProfessional(id);
      loadData();
    }
  };

  if (isLoading) return <div className="p-8">Carregando painel...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Painel Administrativo</h2>
        <p className="text-zinc-500">Gerencie as configurações e cadastros do sistema.</p>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 flex items-center gap-2 font-bold"
        >
          <CheckCircle2 size={18} />
          {message}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Professionals Management */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Users size={20} className="text-zinc-400" />
              Profissionais
            </h3>
            <span className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {professionals.length} Ativos
            </span>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Nome do novo profissional..."
              value={newProfName}
              onChange={(e) => setNewProfName(e.target.value)}
              className="flex-1 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium"
            />
            <button 
              onClick={handleAddProfessional}
              className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all"
            >
              <Plus />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
            {professionals.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group">
                <span className="font-bold text-zinc-700">{p.name}</span>
                <button 
                  onClick={() => handleDeleteProfessional(p.id)}
                  className="p-2 text-zinc-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
              <Settings size={20} className="text-zinc-400" />
              Configurações do Sistema
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all">
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-zinc-400" />
                  <span className="font-bold text-sm">Exportar Configuração (JSON)</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all">
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-zinc-400" />
                  <span className="font-bold text-sm">Importar Configuração</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-xl shadow-zinc-200">
            <h3 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
              <ShieldAlert size={20} className="text-white/50" />
              Zona de Perigo
            </h3>
            <p className="text-white/50 text-sm mb-6">Ações irreversíveis que afetam toda a base de dados histórica do sistema.</p>
            <button className="w-full py-4 border border-white/20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Limpar Cache de Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
