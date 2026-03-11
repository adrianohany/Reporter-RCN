import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await authService.login(username, password);
      login(user);
    } catch (err) {
      setError('Usuário ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[32px] shadow-2xl shadow-zinc-200 border border-zinc-100 overflow-hidden">
          <div className="p-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg">R</div>
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">Acesso Interno</h2>
              <p className="text-zinc-400 font-medium">Entre com suas credenciais corporativas</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Usuário</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ex: joao.silva"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-200"
              >
                {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-zinc-100">
              <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm font-medium">
                <Lock size={14} />
                Ambiente Seguro e Monitorado
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-zinc-400 text-xs font-bold uppercase tracking-widest">
          Grupo RCN de Comunicação • 2026
        </p>
      </motion.div>
    </div>
  );
};
