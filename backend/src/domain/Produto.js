//#region Entity Produto - Domínio
class Produto {
  constructor(id, nome, descricao, preco, tamanho, cor, imagemUrl, estoque, dataCriacao) {
    this.id = id; // ID único gerado pelo banco
    this.nome = nome; // Nome do produto
    this.descricao = descricao; // Descrição detalhada
    this.preco = preco; // Preço em reais (decimal)
    this.tamanho = tamanho; // P, M, G, GG
    this.cor = cor; // Cor do produto
    this.imagemUrl = imagemUrl; // URL da imagem
    this.estoque = estoque; // Quantidade em estoque
    this.dataCriacao = dataCriacao || new Date(); // Data de criação (default now)
  }

  //#region estaDisponivel - Verifica se há estoque
  estaDisponivel() { 
    return this.estoque > 0; // Retorna true se estoque > 0
  }
  //#endregion

  //#region reduzirEstoque - Decremente estoque
  reduzirEstoque(quantidade) {
    if (this.estoque >= quantidade) { // Verifica se há suficiente
      this.estoque -= quantidade; // Subtrai quantidade
      return true; // Sucesso
    }
    return false; // Estoque insuficiente
  }
  //#endregion

  //#region atualizarPreco - Modifica preço
  atualizarPreco(novoPreco) { 
    if (novoPreco > 0) this.preco = novoPreco; // Apenas se positivo
  }
  //#endregion
}

module.exports = Produto; // Exporta módulo CommonJS
//#endregion