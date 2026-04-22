import React from 'react'; // Imports React
import { NavigationContainer } from '@react-navigation/native'; // Container de navegação
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Navigator Stack
import { AuthProvider, useAuth } from '../context/AuthContext'; // Provider auth
import { CartProvider } from '../context/CartContext'; // Provider carrinho

import HomeScreen from '../screens/HomeScreen'; // Tela Home
import LoginScreen from '../screens/LoginScreen'; // Tela Login
import RegisterScreen from '../screens/RegisterScreen'; // Tela Cadastro
import CartScreen from '../screens/CartScreen'; // Tela Carrinho
import PedidosScreen from '../screens/PedidosScreen'; // Tela Pedidos

const Stack = createNativeStackNavigator(); // Cria navigator

// Navigator principal
const AppNavigator = () => {
  const { usuario, loading } = useAuth(); // Hook de autenticação

  if (loading) return null; // Aguarda carregamento

  // Define rotas conforme autenticação
  return (
    <Stack.Navigator>
      {!usuario ? (
        // Rotas públicas (não autenticado)
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        // Rotas privadas (autenticado)
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Pedidos" component={PedidosScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Componente App principal
const App = () => {
  return (
    // Providers
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;