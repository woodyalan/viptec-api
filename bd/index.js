const { Sequelize, DataTypes } = require("sequelize");
const ambiente = process.env.NODE_ENV;
let initChecklist = require("./checklist");
let initUsuario = require("./usuario");
let initNota = require("./nota");

const options = {
  username: "postgres",
  password: "postgres",
  host: "localhost",
  dialect: "postgres",
  database: "notes",
};

if (ambiente === "production") options.logging = false;

const sequelize = new Sequelize(options);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((erro) => {
    console.log(erro);
  });

const Checklist = initChecklist(sequelize, DataTypes);
const Nota = initNota(sequelize, DataTypes);
const Usuario = initUsuario(sequelize, DataTypes);

Nota.hasMany(Checklist, { as: "checklists", foreignKey: "notaId" });
Nota.belongsTo(Usuario, { as: "usuario", foreignKey: "usuarioId" });
// Produto.belongsTo(Marca, { as: "marca", foreignKey: "marcaId" });
// Produto.belongsTo(Cor, { as: "cor", foreignKey: "corId" });

module.exports = { sequelize, Sequelize, Checklist, Nota, Usuario };
