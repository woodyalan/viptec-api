const { Usuario } = require("../bd");

let controller = {};

controller.criar = async (nome, email, senha) => {
  try {
    return await Usuario.create({
      nome,
      email,
      senha,
    });
  } catch (erro) {
    throw erro;
  }
};

controller.listar = async () => {
  try {
    return await Usuario.findAll();
  } catch (erro) {
    throw erro;
  }
};

module.exports = controller;
