import React, { useState, useEffect } from 'react'; // Imports React
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native'; // Imports React Native
import { useCart } from '../context/CartContext'; // Context do carrinho

// Tela Home - Catálogo de produtos
const HomeScreen = ({ navigation }) => {
  const [produtos, setProdutos] = useState([]); // Estado dos produtos
  const [loading, setLoading] = useState(true); // Estado de loading
  const [filtros, setFiltros] = useState({ nome: '', tamanho: '', cor: '' }); // Estado dos filtros
  const { adicionarItem } = useCart(); // Hook do carrinho

  // Função para buscar produtos
  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.nome) params.nome = filtros.nome;
      if (filtros.tamanho) params.tamanho = filtros.tamanho;
      if (filtros.cor) params.cor = filtros.cor;
      
      // Chama API diretamente
      const response = await fetch(`http://10.0.2.2:3000/produtos?${new URLSearchParams(params)}`);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect inicial - carrega produtos
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Renderiza item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>{item.nome.charAt(0)}</Text>
      </View>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.preco}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
      <Text style={styles.details}>Tamanho: {item.tamanho} | Cor: {item.cor}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => adicionarItem(item)} // Adiciona ao carrinho
        disabled={item.estoque <= 0}
      >
        <Text style={styles.buttonText}>
          {item.estoque > 0 ? 'Adicionar' : 'Indisponível'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Renderiza tela
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Beleza Mulher</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒 Carrinho</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          value={filtros.nome}
          onChangeText={(text) => setFiltros({ ...filtros, nome: text })}
        />
        <TouchableOpacity style={styles.searchButton} onClick={buscarProdutos}>
          <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" />
      ) : (
        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#e91e63' },
  cartIcon: { fontSize: 16, color: '#333' },
  filters: { flexDirection: 'row', padding: 8 },
  input: { flex: 1, backgroundColor: '#fff', padding: 8, borderRadius: 4, marginRight: 8 },
  searchButton: { backgroundColor: '#333', padding: 10, borderRadius: 4 },
  searchText: { color: '#fff' },
  list: { padding: 8 },
  card: { flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 8, padding: 12 },
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: '#eee', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  imageText: { fontSize: 40, color: '#ccc' },
  nome: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  preco: { fontSize: 16, color: '#e91e63', fontWeight: 'bold' },
  details: { fontSize: 12, color: '#666', marginVertical: 4 },
  button: { backgroundColor: '#e91e63', padding: 10, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default HomeScreen;