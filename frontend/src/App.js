import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/DashboardPage';
import CalendarPage from './components/CalendarPage';
import Layout from './components/layout/Layout';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<LoginRedirect><Layout title="Login"><LoginPage /></Layout></LoginRedirect>} />
          <Route path="/signup" element={<LoginRedirect><Layout title="Signup"><SignupPage /></Layout></LoginRedirect>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout title="Dashboard"><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Layout title="Calendar"><CalendarPage /></Layout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['admin']}><Layout title="Users"><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// 🔑 Prevent logged-in users from seeing login/signup again
const LoginRedirect = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default App;
