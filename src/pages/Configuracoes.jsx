import React, { useState, useEffect } from 'react';
import { Settings, Save, DollarSign } from 'lucide-react';
import api from '../services/api';

export default function Configuracoes() {
  const [valor, setValor] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/config').then(res => setValor(res.data.valorMetroCubico));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/config', { valorMetroCubico: valor });
      alert("Valor do m³ atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <Settings className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Metro Cúbico (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">R$</span>
              <input 
                type="number" 
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Este valor será utilizado como base para todos os cálculos de faturas.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            {loading ? "Salvando..." : <><Save className="mr-2 h-5 w-5" /> Salvar Configuração</>}
          </button>
        </div>
      </div>
    </div>
  );
}
