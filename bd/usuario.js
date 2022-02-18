const bcrypt = require("bcrypt");
const { saltos } = require("../config");

module.exports = (sequelize, DataType) => {
  const Usuario = sequelize.define(
    "usuario",
    {
      id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataType.STRING(200),
        allowNull: false,
      },
      email: {
        type: DataType.STRING(200),
        allowNull: false,
      },
      senha: {
        type: DataType.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: "usuario",
      timestamps: false,
      hooks: {
        beforeValidate: (usuario) => {
          if (usuario.senha)
            usuario.senha = bcrypt.hashSync(usuario.senha, saltos);
        },
      },
      defaultScope: {
        attributes: {
          exclude: ["senha"],
        },
      },
      scopes: {
        login: {
          attributes: ["id", "senha"],
        },
      },
    }
  );

  return Usuario;
};
