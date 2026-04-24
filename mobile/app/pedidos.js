import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PedidosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pedidos</Text>
      <Text style={styles.text}>Nenhum pedido ainda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d63384',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});