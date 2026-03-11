import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, BarChart3, Users } from 'lucide-react';

export const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-zinc-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-zinc-100 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-black text-2xl">R</div>
          <span className="font-bold text-xl tracking-tight">Grupo RCN</span>
        </div>
        <button 
          onClick={onEnter}
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 font-medium hover:bg-zinc-50 transition-all"
        >
          Acesso Restrito
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={14} />
              Sistema Interno Corporativo
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              Indicadores de <span className="text-zinc-400">Produção.</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-lg mb-10 leading-relaxed">
              Metrificação de Produção de Conteúdo do Grupo RCN de Comunicação. 
              Gestão inteligente para resultados excepcionais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onEnter}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                Entrar no Sistema
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold text-lg hover:bg-zinc-50 transition-all">
                Saiba Mais
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-zinc-100 pt-12">
              <div>
                <p className="text-3xl font-black">100%</p>
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest mt-1">Digital</p>
              </div>
              <div>
                <p className="text-3xl font-black">24/7</p>
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest mt-1">Disponível</p>
              </div>
              <div>
                <p className="text-3xl font-black">Real</p>
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest mt-1">Time Data</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-zinc-50 rounded-[40px] border border-zinc-200 p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-center">
              <div className="space-y-6">
                <div className="h-4 w-1/3 bg-zinc-200 rounded-full"></div>
                <div className="h-12 w-full bg-zinc-300 rounded-2xl"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-zinc-900 rounded-3xl p-6 flex flex-col justify-between">
                    <BarChart3 className="text-white opacity-50" />
                    <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="h-32 bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between">
                    <Users className="text-zinc-400" />
                    <div className="h-2 w-1/2 bg-zinc-100 rounded-full"></div>
                  </div>
                </div>
                <div className="h-24 w-full bg-zinc-200 rounded-3xl"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-900 rounded-full opacity-5"></div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-bold">Sistema Ativo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-zinc-400 font-medium">© 2026 Grupo RCN de Comunicação. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest">Privacidade</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest">Termos</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
