import React, { createContext, useState, useContext, useEffect } from 'react'; // Imports React
import AsyncStorage from '@react-native-async-storage/async-storage'; // Storage nativo
import ApiService from '../services/ApiService'; // Service API

const AuthContext = createContext(null); // Cria contexto

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // Estado do usuário
  const [loading, setLoading] = useState(true); // Estado de loading

  // Effect para carregar dados ao iniciar
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Carrega token
        const usuarioData = await AsyncStorage.getItem('usuario'); // Carrega usuário
        if (token && usuarioData) {
          ApiService.setToken(token); // Configura token
          setUsuario(JSON.parse(usuarioData)); // Restaura usuário
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStorage();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    const data = await ApiService.login(email, senha); // Chama API
    await AsyncStorage.setItem('token', data.token); // Salva token
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario)); // Salva usuário
    setUsuario(data.usuario);
    return data;
  };

  // Função de logout
  const logout = async () => {
    ApiService.setToken(null); // Limpa token
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Disponibiliza contexto
  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;