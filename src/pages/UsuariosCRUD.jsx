import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Shield, User as UserIcon } from 'lucide-react';
import api from '../services/api'; 

export default function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '', role: 'LEITURISTA' });
  const [loading, setLoading] = useState(true);

  // Função para buscar usuários da API
  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/api/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Atualizar usuário existente
        await api.put(`/api/usuarios/${formData.id}`, formData);
      } else {
        // Criar novo usuário
        await api.post('/api/usuarios', formData);
      }
      
      // Limpa o formulário e recarrega a lista
      setFormData({ id: null, name: '', email: '', password: '', role: 'LEITURISTA' });
      fetchUsuarios();
      alert("Usuário salvo com sucesso!");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao salvar usuário");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/api/usuarios/${id}`);
        fetchUsuarios();
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  const handleEdit = (u) => {
    // Ao editar, limpamos a senha por segurança
    setFormData({ ...u, password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-500">Controle de acesso ao painel e aplicativo móvel</p>
        </div>

        {/* Formulário de Cadastro/Edição */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" 
                   placeholder={formData.id ? "Deixe vazio para manter" : "Senha obrigatória"} 
                   value={formData.password} 
                   onChange={e => setFormData({...formData, password: e.target.value})} 
                   className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                   required={!formData.id} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="LEITURISTA">Leiturista (App)</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex items-center justify-center">
            <UserPlus className="h-4 w-4 mr-2" />
            {formData.id ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>

        {/* Tabela de Listagem */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">E-mail</th>
                <th className="px-6 py-4 font-medium">Permissão</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                      {u.role === 'ADMIN' ? <Shield className="w-3 h-3 mr-1"/> : <UserIcon className="w-3 h-3 mr-1"/>}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button onClick={() => handleEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4"/></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-10 text-center text-gray-500">Carregando usuários...</div>}
          {!loading && usuarios.length === 0 && <div className="p-10 text-center text-gray-500">Nenhum usuário cadastrado além de você.</div>}
        </div>
      </div>
    </div>
  );
}