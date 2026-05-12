import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Home, User } from 'lucide-react';
import api from '../services/api';

export default function UnidadesCRUD() {
  const [unidades, setUnidades] = useState([]);
  const [proprietarios, setProprietarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, numero: '', bloco: '', proprietarioId: '' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [resUnidades, resProps] = await Promise.all([
        api.get('/api/unidades', config),
        api.get('/api/proprietarios', config)
      ]);
      setUnidades(resUnidades.data);
      setProprietarios(resProps.data);
    } catch (err) {
      console.error("Erro ao carregar dados");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/api/unidades/${formData.id}`, formData, config);
      } else {
        await api.post('/api/unidades', formData, config);
      }
      setFormData({ id: null, numero: '', bloco: '', proprietarioId: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("Erro ao salvar unidade");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir esta unidade?")) {
      await api.delete(`/api/unidades/${id}`, config);
      fetchData();
    }
  };

  const handleEdit = (u) => {
    setFormData({ 
      id: u.id, 
      numero: u.numero, 
      bloco: u.bloco || '', 
      proprietarioId: u.proprietarioId || '' 
    });
    setShowForm(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Unidades do Condomínio</h1>
          <button 
            onClick={() => { setFormData({id: null, numero: '', bloco: '', proprietarioId: ''}); setShowForm(!showForm); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancelar' : 'Nova Unidade'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-blue-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
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
              >
                <option value="">Selecione um proprietário</option>
                {proprietarios.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white p-2 rounded h-10 hover:bg-green-700">
              {formData.id ? 'Atualizar Unidade' : 'Salvar Unidade'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unidades.map((u) => (
            <div key={u.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                    <Home size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Unidade {u.numero}</h3>
                    <p className="text-sm text-gray-500">{u.bloco ? `Bloco ${u.bloco}` : 'Bloco Único'}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="flex items-center text-gray-600 text-sm border-t pt-4">
                <User size={14} className="mr-2 text-gray-400" />
                <span className="font-medium">Proprietário:</span>
                <span className="ml-1">{u.proprietario?.nome || 'Não vinculado'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}