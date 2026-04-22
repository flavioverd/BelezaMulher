import React from 'react'; // Imports React
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Imports React Native
import { useCart } from '../context/CartContext'; // Context carrinho
import { useAuth } from '../context/AuthContext'; // Context autenticação
import ApiService from '../services/ApiService'; // Service API

// Tela do Carrinho
const CartScreen = ({ navigation }) => {
  const { itens, atualizarQuantidade, removerItem, getTotal } = useCart(); // Hooks do carrinho
  const { usuario } = useAuth(); // Hook de autenticação

  // Função de checkout
  const handleCheckout = async () => {
    if (!usuario) {
      Alert.alert('Atenção', 'Faça login para continuar');
      navigation.navigate('Login'); // Redireciona para login
      return;
    }

    try {
      const pedidoItens = itens.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade
      }));

      await ApiService.criarPedido(usuario.id, pedidoItens); // Cria pedido
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Pedidos') } // Redireciona
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  // Renderiza item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.nome}>{item.produto.nome}</Text>
        <Text style={styles.preco}>R$ {parseFloat(item.produto.preco).toFixed(2)}</Text>
      </View>
      <View style={styles.quantity}>
        <TouchableOpacity onPress={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}>
          <Text style={styles.qtyButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantidade}</Text>
        <TouchableOpacity onPress={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}>
          <Text style={styles.qtyButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removerItem(item.produto.id)}>
        <Text style={styles.remove}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderiza tela
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {itens.length === 0 ? (
        // Carrinho vazio
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Carrinho vazio</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shop}>Ver produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Lista de itens */}
          <FlatList
            data={itens}
            renderItem={renderItem}
            keyExtractor={item => item.produto.id.toString()}
          />
          {/* Rodapé com total e botão */}
          <View style={styles.footer}>
            <Text style={styles.total}>Total: R$ {getTotal().toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkout} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  back: { color: '#e91e63', fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16 },
  shop: { color: '#e91e63', fontSize: 16 },
  item: { flexDirection: 'row', backgroundColor: '#fff', margin: 8, padding: 12, borderRadius: 8, alignItems: 'center' },
  itemInfo: { flex: 1 },
  nome: { fontSize: 14, fontWeight: 'bold' },
  preco: { color: '#e91e63', fontWeight: 'bold' },
  quantity: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  qtyButton: { fontSize: 20, padding: 8, color: '#333' },
  qtyText: { fontSize: 16, marginHorizontal: 8 },
  remove: { color: '#f44336', fontSize: 12 },
  footer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'right' },
  checkout: { backgroundColor: '#e91e63', padding: 14, borderRadius: 4, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CartScreen;