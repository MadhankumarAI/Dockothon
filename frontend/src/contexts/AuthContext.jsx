import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUser({ id: parseInt(storedUserId), role: storedRole });
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    const response = await authAPI.signin({ email, password });
    const { access_token, role: userRole, user_id } = response.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('userId', user_id.toString());
    
    setToken(access_token);
    setRole(userRole);
    setUser({ id: user_id, role: userRole });
    
    return response.data;
  };

  const signupDoctor = async (data) => {
    const response = await authAPI.signupDoctor(data);
    return response.data;
  };

  const signupPatient = async (data) => {
    const response = await authAPI.signupPatient(data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    isDoctor,
    isPatient,
    signin,
    signupDoctor,
    signupPatient,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
