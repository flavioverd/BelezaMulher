import React, { useState } from 'react'; // Imports React
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'; // Imports React Native
import ApiService from '../services/ApiService'; // Service API

// Tela de Cadastro
const RegisterScreen = ({ navigation }) => {
  const [dados, setDados] = useState({ // Estado dos dados
    nome: '',
    email: '',
    senha: '',
    endereco: ''
  });
  const [loading, setLoading] = useState(false); // Estado de loading

  // Atualiza campo
  const handleChange = (field, value) => {
    setDados({ ...dados, [field]: value });
  };

  // Função de cadastro
  const handleRegister = async () => {
    setLoading(true);
    try {
      await ApiService.registrar(dados); // Chama API
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      navigation.navigate('Login'); // Redireciona para login
    } catch (err) {
      Alert.alert('Erro', err.message); // Exibe erro
    } finally {
      setLoading(false);
    }
  };

  // Renderiza tela
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={dados.nome}
        onChangeText={(text) => handleChange('nome', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={dados.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        value={dados.senha}
        onChangeText={(text) => handleChange('senha', text)}
        secureTextEntry
        minLength={6}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={dados.endereco}
        onChangeText={(text) => handleChange('endereco', text)}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
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
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#e91e63', fontSize: 14 }
});

export default RegisterScreen;