# Casos de Uso

## UC01: Cadastrar Usuário
**Ator:** Usuário não registrado  
**Pré-condições:** Acesso à página de cadastro  
**Pós-condições:** Usuário criado no sistema  
**Fluxo Principal:**
1. Usuário preenche formulário (nome, email, senha)
2. Sistema valida dados
3. Sistema cria conta e envia email de confirmação
4. Usuário logado automaticamente

## UC02: Fazer Login
**Ator:** Usuário registrado  
**Pré-condições:** Conta ativa  
**Fluxo Principal:**
1. Usuário informa email e senha
2. Sistema autentica e gera token JWT
3. Usuário acessa área logada

## UC03: Visualizar Catálogo
**Ator:** Qualquer usuário  
**Fluxo Principal:**
1. Usuário acessa página de produtos
2. Sistema lista produtos com paginação
3. Usuário filtra/busca produtos

## UC04: Adicionar ao Carrinho
**Ator:** Usuário logado  
**Pré-condições:** Produto selecionado  
**Fluxo Principal:**
1. Usuário clica "Adicionar ao Carrinho"
2. Sistema adiciona item ao carrinho do usuário
3. Carrinho atualizado

## UC05: Realizar Pedido
**Ator:** Usuário logado  
**Pré-condições:** Carrinho com itens  
**Fluxo Principal:**
1. Usuário revisa carrinho e endereço
2. Sistema calcula total com frete
3. Usuário confirma pagamento
4. Sistema processa pagamento e cria pedido
5. Email de confirmação enviado

## UC06: Gerenciar Pedidos (Admin)
**Ator:** Administrador  
**Pré-condições:** Login admin  
**Fluxo Principal:**
1. Admin visualiza lista de pedidos
2. Atualiza status (enviado, entregue)
3. Sistema notifica usuário por email