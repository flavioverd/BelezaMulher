import React, { useState, useEffect } from 'react'; // Imports React
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'; // Imports React Native
import { useAuth } from '../context/AuthContext'; // Context autenticação
import ApiService from '../services/ApiService'; // Service API

// Tela de Pedidos
const PedidosScreen = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]); // Estado dos pedidos
  const [loading, setLoading] = useState(true); // Estado de loading
  const { usuario } = useAuth(); // Hook de autenticação

  // Effect para buscar pedidos
  useEffect(() => {
    const buscarPedidos = async () => {
      if (!usuario) {
        setLoading(false);
        return;
      }
      try {
        const data = await ApiService.buscarPedidosPorUsuario(usuario.id); // Chama API
        setPedidos(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    buscarPedidos();
  }, [usuario]);

  // Formata data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Obtém label do status
  const getStatusLabel = (status) => {
    const labels = { pendente: 'Pendente', pago: 'Pago', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado' };
    return labels[status] || status;
  };

  // Obtém cor do status
  const getStatusColor = (status) => {
    const colors = { pendente: '#ff9800', pago: '#2196f3', enviado: '#9c27b0', entregue: '#4caf50', cancelado: '#f44336' };
    return colors[status] || '#666';
  };

  // Renderiza item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.id}>Pedido #{item.id}</Text>
        <Text style={styles.date}>{formatDate(item.dataPedido)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.itens}>{item.itens?.length || 0} item(s)</Text>
        <View style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.total}>R$ {parseFloat(item.total).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // Renderiza tela
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerBar}>
        <Text style={styles.title}>Meus Pedidos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        // Loading
        <ActivityIndicator size="large" color="#e91e63" />
      ) : pedidos.length === 0 ? (
        // Sem pedidos
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Você ainda não tem pedidos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shop}>Fazer primeiro pedido</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Lista de pedidos
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  back: { color: '#e91e63', fontSize: 16 },
  list: { padding: 8 },
  card: { backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  id: { fontWeight: 'bold', color: '#333' },
  date: { color: '#666', fontSize: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itens: { color: '#666', fontSize: 14 },
  status: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: 'bold', color: '#e91e63', textAlign: 'right' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16 },
  shop: { color: '#e91e63', fontSize: 16 }
});

export default PedidosScreen;