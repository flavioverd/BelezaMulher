-- Script SQL para criar tabelas do banco de dados
-- Beleza Mulher - E-commerce de roupas femininas

-- Cria banco de dados (se não existir)
-- CREATE DATABASE belezamulher;

-- Usa o banco
-- \c belezamulher;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    tamanho VARCHAR(10),
    cor VARCHAR(50),
    imagem_url VARCHAR(500),
    estoque INTEGER DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pendente',
    total DECIMAL(10,2) DEFAULT 0
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);

-- Dados de exemplo
INSERT INTO produtos (nome, descricao, preco, tamanho, cor, estoque) VALUES
('Vestido Floral', 'Vestido leve e confortável para o verão', 89.90, 'M', 'Azul', 10),
('Blusa Básica', 'Blusa de algodão para o dia a dia', 49.90, 'P', 'Branco', 15),
('Calça Jeans', 'Calça jeans skinny com lavagem escura', 129.90, 'G', 'Azul Escuro', 8);

-- Usuário admin de exemplo (senha: admin123)
-- Senha hashada com bcrypt
INSERT INTO usuarios (nome, email, senha, endereco) VALUES
('Admin', 'admin@belezamulher.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rua Admin, 123');