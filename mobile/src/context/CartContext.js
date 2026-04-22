import React, { createContext, useState, useContext } from 'react'; // Imports React

const CartContext = createContext(null); // Cria contexto do carrinho

// Provider do carrinho
export const CartProvider = ({ children }) => {
  const [itens, setItens] = useState([]); // Estado dos itens

  // Adiciona produto ao carrinho
  const adicionarItem = (produto, quantidade = 1) => {
    setItens(prev => {
      const existente = prev.find(item => item.produto.id === produto.id); // Verifica se existe
      if (existente) {
        // Atualiza quantidade se existir
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      // Adiciona novo item
      return [...prev, { produto, quantidade }];
    });
  };

  // Remove produto do carrinho
  const removerItem = (produtoId) => {
    setItens(prev => prev.filter(item => item.produto.id !== produtoId));
  };

  // Atualiza quantidade
  const atualizarQuantidade = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removerItem(produtoId); // Remove se 0
      return;
    }
    setItens(prev =>
      prev.map(item =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  // Limpa carrinho
  const limparCarrinho = () => setItens([]);

  // Calcula total
  const getTotal = () => {
    return itens.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  };

  // Conta itens
  const getTotalItens = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  // Disponibiliza contexto
  return (
    <CartContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      getTotal,
      getTotalItens
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};

export default CartContext;