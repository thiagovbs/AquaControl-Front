import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Droplets, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '../services/api';

export default function LeiturasCRUD() {
  const [leituras, setLeituras] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState({ 
    id: null, unidadeId: '', mesReferencia: new Date().getMonth() + 1, anoReferencia: new Date().getFullYear(),
    leituraAnterior: '', leituraAtual: '', valorTotal: '', dataVencimento: '', statusPagamento: 'PENDENTE'
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [resLeituras, resUnidades] = await Promise.all([
        api.get('/api/leituras', config),
        api.get('/unidades', config)
      ]);
      setLeituras(resLeituras.data);
      setUnidades(resUnidades.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/api/leituras/${formData.id}`, formData, config);
      } else {
        await api.post('/api/leituras', formData, config);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("Erro ao salvar leitura.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir esta leitura?")) {
      await api.delete(`/api/leituras/${id}`, config);
      fetchData();
    }
  };

  const handleEdit = (l) => {
    // Formata a data para o input type="date" (YYYY-MM-DD)
    const dataFormatada = new Date(l.dataVencimento).toISOString().split('T')[0];
    setFormData({ ...l, dataVencimento: dataFormatada });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ 
      id: null, unidadeId: '', mesReferencia: new Date().getMonth() + 1, anoReferencia: new Date().getFullYear(),
      leituraAnterior: '', leituraAtual: '', valorTotal: '', dataVencimento: '', statusPagamento: 'PENDENTE'
    });
    setShowForm(!showForm);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Controle de Leituras</h1>
            <p className="text-gray-500">Gerenciamento de consumo e faturamento de água</p>
          </div>
          <button onClick={resetForm} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition">
            <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancelar' : 'Nova Leitura'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 border border-blue-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <select disabled={!!formData.id} value={formData.unidadeId} onChange={e => setFormData({...formData, unidadeId: e.target.value})} className="w-full border p-2 rounded bg-gray-50" required>
                <option value="">Selecione...</option>
                {unidades.map(u => <option key={u.id} value={u.id}>Apto {u.numero} {u.bloco && `- Bloco ${u.bloco}`}</option>)}
              </select>
            </div>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                <input type="number" min="1" max="12" value={formData.mesReferencia} onChange={e => setFormData({...formData, mesReferencia: e.target.value})} className="w-full border p-2 rounded" required />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <input type="number" value={formData.anoReferencia} onChange={e => setFormData({...formData, anoReferencia: e.target.value})} className="w-full border p-2 rounded" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leitura Anterior (m³)</label>
              <input type="number" step="0.01" value={formData.leituraAnterior} onChange={e => setFormData({...formData, leituraAnterior: e.target.value})} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leitura Atual (m³)</label>
              <input type="number" step="0.01" value={formData.leituraAtual} onChange={e => setFormData({...formData, leituraAtual: e.target.value})} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
              <input type="number" step="0.01" value={formData.valorTotal} onChange={e => setFormData({...formData, valorTotal: e.target.value})} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
              <input type="date" value={formData.dataVencimento} onChange={e => setFormData({...formData, dataVencimento: e.target.value})} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Pagamento</label>
              <select value={formData.statusPagamento} onChange={e => setFormData({...formData, statusPagamento: e.target.value})} className="w-full border p-2 rounded">
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="ATRASADO">Atrasado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-green-600 text-white p-2 rounded h-10 hover:bg-green-700 font-medium">
                {formData.id ? 'Salvar Alterações' : 'Registrar Leitura'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Ref / Vencimento</th>
                <th className="px-6 py-4 font-medium">Unidade</th>
                <th className="px-6 py-4 font-medium">Consumo</th>
                <th className="px-6 py-4 font-medium">Valor (R$)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leituras.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{l.mesReferencia}/{l.anoReferencia}</div>
                    <div className="text-sm text-gray-500">Venc: {new Date(l.dataVencimento).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    Apto {l.unidade.numero} {l.unidade.bloco && `(${l.unidade.bloco})`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Droplets size={14} className="mr-1" /> {l.consumo} m³
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">R$ {l.valorTotal.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {l.statusPagamento === 'PAGO' && <span className="flex items-center w-fit px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"><CheckCircle size={12} className="mr-1"/> PAGO</span>}
                    {l.statusPagamento === 'PENDENTE' && <span className="flex items-center w-fit px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full"><Clock size={12} className="mr-1"/> PENDENTE</span>}
                    {l.statusPagamento === 'ATRASADO' && <span className="flex items-center w-fit px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"><AlertCircle size={12} className="mr-1"/> ATRASADO</span>}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button onClick={() => handleEdit(l)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4"/></button>
                    <button onClick={() => handleDelete(l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
              {leituras.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Nenhuma leitura registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}