import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  UserCog, 
  LogOut, 
  Droplets 
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Recupera os dados do usuário salvos no login
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} />, show: true },
    { path: '/unidades', name: 'Unidades', icon: <Home size={20} />, show: true },
    { path: '/proprietarios', name: 'Proprietários', icon: <Users size={20} />, show: true },
    { path: '/leituras', name: 'Leituras e Faturas', icon: <Droplets size={20} />, show: true },
    { path: '/faturamento', name: 'Faturamento', icon: FileText, show: isAdmin }, // Validação de ADMIN
    { path: '/configuracoes', name: 'Configurações', icon: Settings, show: isAdmin }, // Validação de ADMIN
    { path: '/usuarios', name: 'Usuários', icon: <UserCog size={20} />, show: isAdmin }, // Validação de ADMIN
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <Droplets className="text-blue-600 mr-2" size={28} />
        <span className="text-xl font-bold text-gray-800">AcquaControl</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {menuItems.map((item) => item.show && (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}
