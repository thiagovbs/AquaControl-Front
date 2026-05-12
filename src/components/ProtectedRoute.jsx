import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roleRequired }) {
  // Recuperamos os dados do usuário salvos no login
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Se não estiver logado, manda para o login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Se o papel (role) do usuário não for o exigido (ex: ADMIN), manda para o dashboard
  if (roleRequired && user.role !== roleRequired) {
    alert("Acesso negado: Esta área é restrita a administradores.");
    return <Navigate to="/" />;
  }

  return children;
}
