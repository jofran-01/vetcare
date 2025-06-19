import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, utils } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se usuário está logado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = utils.getToken();
        const savedUser = utils.getUser();

        if (token && savedUser) {
          // Verificar se o token ainda é válido
          const response = await authAPI.verifyToken();
          if (response.valid) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            // Token inválido, fazer logout
            utils.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        utils.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email, senha, tipo) => {
    try {
      const response = await authAPI.login(email, senha, tipo);
      
      // Salvar token e dados do usuário
      utils.saveToken(response.token);
      utils.saveUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Função de cadastro de tutor
  const registerTutor = async (userData) => {
    try {
      const response = await authAPI.registerTutor(userData);
      
      // Salvar token e dados do usuário
      utils.saveToken(response.token);
      utils.saveUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Função de cadastro de clínica
  const registerClinica = async (userData) => {
    try {
      const response = await authAPI.registerClinica(userData);
      
      // Salvar token e dados do usuário
      utils.saveToken(response.token);
      utils.saveUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      utils.logout();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Verificar se é tutor
  const isTutor = () => {
    return user?.type === 'tutor';
  };

  // Verificar se é clínica
  const isClinica = () => {
    return user?.type === 'clinica';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    registerTutor,
    registerClinica,
    isTutor,
    isClinica
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

