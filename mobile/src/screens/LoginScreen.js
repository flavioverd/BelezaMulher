import React, { useState } from 'react'; // Imports React
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'; // Imports React Native
import { useAuth } from '../context/AuthContext'; // Hook de autenticação

// Tela de Login
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Estado do email
  const [senha, setSenha] = useState(''); // Estado da senha
  const [erro, setErro] = useState(''); // Estado de erro
  const [loading, setLoading] = useState(false); // Estado de loading
  const { login } = useAuth(); // Hook de autenticação

  // Função de login
  const handleLogin = async () => {
    setErro('');
    setLoading(true);
    try {
      await login(email, senha); // Chama função de login
      navigation.replace('Home'); // Redireciona para home
    } catch (err) {
      setErro(err.message); // Exibe erro
    } finally {
      setLoading(false);
    }
  };

  // Renderiza tela
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      
      {/* Input email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Input senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
      
      {/* Link para cadastro */}
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#333' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 4, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#e91e63', padding: 14, borderRadius: 4, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  erro: { color: '#f44336', textAlign: 'center', marginBottom: 12 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#e91e63', fontSize: 14 }
});

export default LoginScreen;