import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UnidadesCRUD from './pages/UnidadesCRUD';
import ProprietariosCRUD from './pages/ProprietariosCRUD';
import UsuariosCRUD from './pages/UsuariosCRUD';
import LeiturasCRUD from './pages/LeiturasCRUD';

// Componente de Layout para telas autenticadas
const PrivateLayout = () => {
  // Recupera os dados do usuário para exibir no topo
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Coluna da direita (Header + Conteúdo) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior (Canto Direito) */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 font-medium">{user.role === 'ADMIN' ? 'Administrador' : 'Leiturista'}</p>
            </div>
            {/* Círculo com a inicial do nome */}
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Conteúdo dinâmico das páginas (Dashboard, Unidades, etc) */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

// Proteção de Rota para ADMIN
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuthenticated} />} />
        
        {/* Rotas Privadas com Menu */}
        <Route element={authenticated ? <PrivateLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unidades" element={<UnidadesCRUD />} />
          <Route path="/proprietarios" element={<ProprietariosCRUD />} />
          <Route path="/leituras" element={<LeiturasCRUD />} />
          
          {/* Rota Protegida para Usuários (Só Admin acessa via URL também) */}
          <Route path="/usuarios" element={
            <AdminRoute>
              <UsuariosCRUD />
            </AdminRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;