const jwt = require("jsonwebtoken");
const { Usuario } = require("../bd");
const { palavraChave } = require("../config");

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
    return await Usuario.findAll({
      attributes: ["id", "nome", "email"],
      order: [["nome", "ASC"]],
    });
  } catch (erro) {
    throw erro;
  }
};

controller.buscarPorId = async (id) => {
  try {
    return await Usuario.findByPk(id);
  } catch (erro) {
    throw erro;
  }
};

controller.atualizar = async (id, { nome, email, senha }) => {
  try {
    return await Usuario.update(
      {
        nome,
        email,
        senha,
      },
      {
        where: {
          id,
        },
      }
    );
  } catch (erro) {
    throw erro;
  }
};

controller.remover = async (id) => {
  try {
    return await Usuario.destroy({
      where: {
        id,
      },
    });
  } catch (erro) {
    throw erro;
  }
};

controller.login = async (email, senha) => {
  try {
    const usuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (usuario.senha != senha) return false;

    return jwt.sign({ id: usuario.id }, palavraChave, {
      expiresIn: "3h",
    });
  } catch (erro) {
    throw erro;
  }
};

module.exports = controller;
