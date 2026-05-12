import React, { useState, useEffect } from 'react';
import { Droplets, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({
    stats: { receitaPrevista: 0, contasPagas: 0, contasAtrasadas: 0, consumoTotal: 0 },
    inadimplentes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Formatador de Moeda (R$)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Carregando dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Controle de Água</h1>
          <p className="text-gray-500">Resumo financeiro e monitoramento de unidades</p>
        </header>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<DollarSign/>} title="Receita Prevista (Total)" value={formatCurrency(data.stats.receitaPrevista)} color="blue" />
          <StatCard icon={<CheckCircle/>} title="Contas Pagas" value={data.stats.contasPagas} color="green" />
          <StatCard icon={<AlertTriangle/>} title="Em Atraso" value={data.stats.contasAtrasadas} color="red" />
          <StatCard icon={<Droplets/>} title="Consumo Total" value={`${data.stats.consumoTotal.toFixed(2)} m³`} color="cyan" />
        </div>

        {/* Tabela de Unidades em Atraso */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center">
            <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
            <h2 className="text-xl font-semibold text-gray-800">Unidades com Pendências</h2>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Ref.</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Proprietário</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.inadimplentes.map((conta) => (
                <tr key={conta.id} className="hover:bg-red-50 transition">
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {conta.mesReferencia}/{conta.anoReferencia}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    Apto {conta.unidade.numero} {conta.unidade.bloco && `(${conta.unidade.bloco})`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {conta.unidade.proprietario ? conta.unidade.proprietario.nome : 'Não vinculado'}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatCurrency(conta.valorTotal)}
                  </td>
                </tr>
              ))}
              
              {data.inadimplentes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">
                    Excelente! Nenhuma unidade em atraso no momento. 🎉
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

const StatCard = ({ icon, title, value, color }) => {
  // Ajuste de cores do Tailwind via mapeamento seguro
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 text-blue-600',
    green: 'border-green-500 bg-green-50 text-green-600',
    red: 'border-red-500 bg-red-50 text-red-600',
    cyan: 'border-cyan-500 bg-cyan-50 text-cyan-600'
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;
  const [borderColor, bgColor, textColor] = selectedColor.split(' ');

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${bgColor} ${textColor}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;