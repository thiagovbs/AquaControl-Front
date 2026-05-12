import React, { useState, useEffect } from 'react';
import { Home, User, Edit2, Trash2, PlusCircle, Search } from 'lucide-react';
import api from '../services/api';

export default function UnidadesCRUD() {
  const [unidades, setUnidades] = useState([]);
  const [proprietarios, setProprietarios] = useState([]); // Para o select do formulário
  const [formData, setFormData] = useState({ id: null, numero: '', bloco: '', proprietarioId: '' });
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Procuramos as unidades (que agora trazem o proprietário e a última leitura)
      const resUnidades = await api.get('/api/unidades');
      // Procuramos a lista de proprietários para preencher o select do formulário
      const resProps = await api.get('/api/proprietarios');
      
      setUnidades(resUnidades.data);
      setProprietarios(resProps.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/api/unidades/${formData.id}`, formData);
      } else {
        await api.post('/api/unidades', formData);
      }
      setFormData({ id: null, numero: '', bloco: '', proprietarioId: '' });
      fetchData();
      alert("Unidade guardada com sucesso!");
    } catch (error) {
      alert("Erro ao guardar unidade.");
    }
  };

  const unidadesFiltradas = unidades.filter(u => 
    u.numero.toString().includes(busca) || 
    u.proprietario.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerir Unidades</h1>
            <p className="text-gray-500">Registo de apartamentos e blocos do condomínio</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Procurar apto ou dono..." 
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número Apto</label>
            <input type="text" value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bloco</label>
            <input type="text" value={formData.bloco} onChange={e => setFormData({...formData, bloco: e.target.value})} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proprietário</label>
            <select 
              value={formData.proprietarioId} 
              onChange={e => setFormData({...formData, proprietarioId: e.target.value})} 
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Selecione o dono...</option>
              {proprietarios.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            {formData.id ? 'Atualizar' : 'Adicionar'}
          </button>
        </form>

        {/* Tabela de Unidades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Unidade</th>
                <th className="px-6 py-4 font-medium">Bloco</th>
                <th className="px-6 py-4 font-medium">Proprietário</th>
                <th className="px-6 py-4 font-medium">Última Leitura</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {unidadesFiltradas.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">Apto {u.numero}</td>
                  <td className="px-6 py-4 text-gray-600">{u.bloco || '-'}</td>
                  <td className="px-6 py-4 text-gray-900">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {/* O ?. protege o código e o || define um valor padrão */}
                      {u.proprietario?.nome || 'Sem proprietário'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {u.ultimaLeitura} m³
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button onClick={() => setFormData(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18}/></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-10 text-center text-gray-500">A carregar dados...</div>}
        </div>
      </div>
    </div>
  );
}
