import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Droplet, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function Faturamento() {
  const [leituras, setLeituras] = useState([]);
  const [tarifa, setTarifa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/config').then(res => {
      setTarifa(res.data.valorMetroCubico);
    });
    carregarLeituras();
  }, []);

  const carregarLeituras = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/leituras');
      setLeituras(response.data);
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarFaturamento = async (id, valorCalculado) => {
    try {
      // Atualiza o valor total no banco de dados e muda o status
      await api.put(`/api/leituras/${id}`, { 
        valorTotal: Number(valorCalculado.toFixed(2)),
        statusPagamento: 'FATURADO'
      });
      alert('Fatura gerada com sucesso!');
      carregarLeituras(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao gerar fatura. Verifique a API.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Faturamento Mensal</h1>
            <p className="text-gray-500">Cálculo de consumo e geração de faturas</p>
          </div>
          
          {/* Caixa de configuração da Tarifa */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-lg">
              <Calculator className="h-5 w-5 mr-2" />
              <span className="font-semibold">Valor da Tarifa (m³)</span>
            </div>
            <div className="flex items-center text-xl font-bold">
              R$ <input 
                type="number" 
                step="0.01"
                className="ml-2 w-24 border-b-2 border-blue-500 outline-none text-center bg-transparent"
                value={tarifa}
                onChange={(e) => setTarifa(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Faturamentos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Unidade</th>
                <th className="px-6 py-4 font-medium">Proprietário</th>
                <th className="px-6 py-4 font-medium text-center">Consumo (m³)</th>
                <th className="px-6 py-4 font-medium text-right">Valor a Cobrar</th>
                <th className="px-6 py-4 font-medium text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leituras.map(leitura => {
                const consumo = leitura.leituraAtual - leitura.leituraAnterior;
                const valorCalculado = consumo * tarifa;

                return (
                  <tr key={leitura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">
                      Apto {leitura.unidade.numero} {leitura.unidade.bloco && `- Bl. ${leitura.unidade.bloco}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {leitura.unidade.proprietario?.nome || 'Sem proprietário'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center text-blue-600 font-medium">
                        <Droplet className="h-4 w-4 mr-1" />
                        {consumo.toFixed(2)} m³
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ({leitura.leituraAnterior} → {leitura.leituraAtual})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {leitura.statusPagamento === 'FATURADO' ? (
                        <span className="text-green-600 font-bold">
                          R$ {leitura.valorTotal.toFixed(2).replace('.', ',')}
                        </span>
                      ) : (
                        <span className="text-gray-900 font-bold text-lg">
                          R$ {valorCalculado.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {leitura.statusPagamento === 'FATURADO' ? (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" /> Faturado
                        </span>
                      ) : (
                        <button 
                          onClick={() => confirmarFaturamento(leitura.id, valorCalculado)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          Gerar Fatura
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center text-gray-500">Buscando medições...</div>}
          {!loading && leituras.length === 0 && (
            <div className="p-8 text-center text-gray-500">Nenhuma leitura encontrada para faturar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
