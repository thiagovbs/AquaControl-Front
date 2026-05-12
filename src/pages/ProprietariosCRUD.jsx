import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import api from '../services/api';

export default function ProprietariosCRUD() {
  const [proprietarios, setProprietarios] = useState([]);
  const [formData, setFormData] = useState({ id: null, nome: '', telefone: '', email: '' });

  // Exemplo de como a integração funcionará
  const fetchProprietarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/proprietarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProprietarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar proprietários", error);
    }
  };

  useEffect(() => {
    fetchProprietarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (formData.id) {
        await api.put(`/api/proprietarios/${formData.id}`, formData, config);
      } else {
        await api.post('/api/proprietarios', formData, config);
      }
      setFormData({ id: null, nome: '', telefone: '', email: '' });
      fetchProprietarios();
    } catch (error) {
      alert("Erro ao salvar proprietário.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir? Unidades vinculadas perderão o proprietário.")) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/proprietarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProprietarios();
      } catch (error) {
        alert("Erro ao excluir proprietário.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Proprietários</h1>
          <p className="text-gray-500">Cadastro de donos e responsáveis pelas unidades</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
            <input type="text" placeholder="(21) 99999-9999" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
              <UserPlus className="h-4 w-4 mr-2" />
              {formData.id ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>

        {/* Listagem */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Contatos</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proprietarios.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{p.nome}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.telefone && <div className="flex items-center text-sm mb-1"><Phone className="h-3 w-3 mr-2 text-gray-400"/> {p.telefone}</div>}
                    {p.email && <div className="flex items-center text-sm"><Mail className="h-3 w-3 mr-2 text-gray-400"/> {p.email}</div>}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button onClick={() => setFormData(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4"/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}