//#region Validação Middleware - Interface (Joi)
const Joi = require('joi'); // Import Joi (validation library)

//#region validarUsuario - Schema usuário
const validarUsuario = (req, res, next) => {
  const schema = Joi.object({ // Joi.object = schema JSON
    nome: Joi.string().min(2).required(), // string, min 2 chars, obrigatório
    email: Joi.string().email().required(), // string, formato email, obrigatório
    senha: Joi.string().min(6).required(), // string, min 6 chars, obrigatório
    endereco: Joi.string().optional() // string, opcional
  });

  const { error } = schema.validate(req.body); // validate() retorna objeto {error, value}
  if (error) return res.status(400).json({ erro: error.details[0].message }); // 400 Bad Request
  next(); // Próximo middleware
};
//#endregion

//#region validarLogin - Schema login
const validarLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(), // Email obrigatório
    senha: Joi.string().required() // Senha obrigatória (qualquer string)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });
  next();
};
//#endregion

//#region validarProduto - Schema produto
const validarProduto = (req, res, next) => {
  const schema = Joi.object({
    nome: Joi.string().required(), // Obrigatório
    descricao: Joi.string().optional(), // Opcional
    preco: Joi.number().positive().required(), // Número positivo obrigatório
    tamanho: Joi.string().optional(), // Opcional
    cor: Joi.string().optional(), // Opcional
    imagemUrl: Joi.string().uri().optional(), // URI válida opcional
    estoque: Joi.number().integer().min(0).optional() // Inteiro >= 0 opcional
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });
  next();
};
//#endregion

//#region validarPedido - Schema pedido
const validarPedido = (req, res, next) => {
  const schema = Joi.object({
    usuarioId: Joi.number().integer().required(), // Inteiro obrigatório
    itens: Joi.array().items( // Array de objetos
      Joi.object({
        produtoId: Joi.number().integer().required(), // Produto ID obrigatório
        quantidade: Joi.number().integer().min(1).required() // Qty >= 1 obrigatória
      })
    ).min(1).required() // Mínimo 1 item, obrigatório
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });
  next();
};
//#endregion

module.exports = { validarUsuario, validarLogin, validarProduto, validarPedido }; // Export objeto
//#endregion