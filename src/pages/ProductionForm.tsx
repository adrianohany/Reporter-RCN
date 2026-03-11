import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Calendar, 
  User, 
  MapPin,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { dataService } from '../services/api';
import { Professional, Location, ProductType } from '../types';
import { getDayOfWeek, cn } from '../utils/helpers';

export const ProductionForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    professionalId: '',
    professionalName: '',
    customProfessionalName: '',
    reportDate: new Date().toISOString().split('T')[0],
    dayOfWeek: getDayOfWeek(new Date().toISOString().split('T')[0]),
    isHoliday: false,
    locationId: '',
    locationName: '',
    production: {} // Stores counts for each product type
  });

  useEffect(() => {
    const loadData = async () => {
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
    loadData();
  }, []);

  const handleDateChange = (date: string) => {
    setFormData({
      ...formData,
      reportDate: date,
      dayOfWeek: getDayOfWeek(date)
    });
  };

  const handleProductionChange = (productId: string, value: number) => {
    setFormData({
      ...formData,
      production: {
        ...formData.production,
        [productId]: value
      }
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.professionalId) return false;
      if (formData.professionalId === 'other' && !formData.customProfessionalName) return false;
      if (!formData.locationId) return false;
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedProf = professionals.find(p => p.id === Number(formData.professionalId));
      const selectedLoc = locations.find(l => l.id === Number(formData.locationId));
      
      const totalProduction = Object.values(formData.production).reduce((a: any, b: any) => a + (Number(b) || 0), 0);

      await dataService.submitReport({
        professional_id: formData.professionalId === 'other' ? undefined : Number(formData.professionalId),
        professional_name: formData.professionalId === 'other' ? formData.customProfessionalName : selectedProf?.name,
        report_date: formData.reportDate,
        day_of_week: formData.dayOfWeek,
        is_holiday: formData.isHoliday,
        location_id: Number(formData.locationId),
        location_name: selectedLoc?.name,
        data: formData.production,
        total_production: Number(totalProduction)
      });
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">Carregando formulário...</div>;

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black mb-4">Relatório Enviado!</h2>
        <p className="text-zinc-500 text-lg mb-10">
          Os dados de produção foram registrados com sucesso e já estão disponíveis no dashboard.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
        >
          Novo Relatório
        </button>
      </motion.div>
    );
  }

  const totalSteps = 3; // Simplified for demo: 1. ID, 2. Production, 3. Review

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Novo Relatório de Produção</h2>
            <p className="text-zinc-500 text-sm">Etapa {step} de {totalSteps}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-zinc-900">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </div>
        <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-zinc-900"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-xl shadow-zinc-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User size={20} className="text-zinc-400" />
                    Identificação do Profissional
                  </h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome do Profissional *</label>
                      <select 
                        value={formData.professionalId}
                        onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium"
                      >
                        <option value="">Selecione um profissional...</option>
                        {professionals.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        <option value="other">Outro (Informar nome)</option>
                      </select>
                    </div>

                    {formData.professionalId === 'other' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Informe o nome completo *</label>
                        <input 
                          type="text"
                          value={formData.customProfessionalName}
                          onChange={(e) => setFormData({ ...formData, customProfessionalName: e.target.value })}
                          className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} /> Data do Relatório *
                    </label>
                    <input 
                      type="date"
                      value={formData.reportDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dia da Semana</label>
                    <input 
                      type="text"
                      readOnly
                      value={formData.dayOfWeek}
                      className="w-full p-4 bg-zinc-100 border border-zinc-200 rounded-2xl text-zinc-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={12} /> Praça *
                    </label>
                    <select 
                      value={formData.locationId}
                      onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all font-medium"
                    >
                      <option value="">Selecione a praça...</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-8">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isHoliday}
                        onChange={(e) => setFormData({ ...formData, isHoliday: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                      <span className="ml-3 text-sm font-bold text-zinc-700">Feriado?</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Quantitativo de Produção</h3>
                  <p className="text-zinc-500 text-sm mb-8">Informe a quantidade produzida para cada tipo de conteúdo.</p>
                  
                  <div className="grid gap-4">
                    {productTypes.map(type => (
                      <div key={type.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="font-bold text-zinc-700">{type.name}</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleProductionChange(type.name, Math.max(0, (formData.production[type.name] || 0) - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-colors"
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            min="0"
                            value={formData.production[type.name] || 0}
                            onChange={(e) => handleProductionChange(type.name, parseInt(e.target.value) || 0)}
                            className="w-16 text-center bg-transparent font-black text-lg focus:outline-none"
                          />
                          <button 
                            onClick={() => handleProductionChange(type.name, (formData.production[type.name] || 0) + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileCheck size={20} className="text-emerald-500" />
                    Revisão dos Dados
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Profissional</p>
                        <p className="font-bold">
                          {formData.professionalId === 'other' ? formData.customProfessionalName : professionals.find(p => p.id === Number(formData.professionalId))?.name}
                        </p>
                      </div>
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Data e Local</p>
                        <p className="font-bold">{formData.reportDate} • {locations.find(l => l.id === Number(formData.locationId))?.name}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900 text-white rounded-[24px] shadow-lg">
                      <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-4">Resumo da Produção</p>
                      <div className="grid grid-cols-2 gap-y-3">
                        {Object.entries(formData.production).map(([name, val]: any) => val > 0 && (
                          <React.Fragment key={name}>
                            <span className="text-sm opacity-80">{name}</span>
                            <span className="text-sm font-black text-right">{val}</span>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                        <span className="font-bold">Total Produzido</span>
                        <span className="text-2xl font-black">
                          {Object.values(formData.production).reduce((a: any, b: any) => a + (Number(b) || 0), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              step === 1 ? "opacity-0 pointer-events-none" : "text-zinc-500 hover:bg-zinc-200"
            )}
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          {step < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              Próximo
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar e Enviar'}
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
      
      {!validateStep() && step === 1 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 text-sm font-medium">
          <AlertCircle size={18} />
          Por favor, preencha todos os campos obrigatórios para continuar.
        </div>
      )}
    </div>
  );
};
