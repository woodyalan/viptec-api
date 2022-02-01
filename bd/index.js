const { Sequelize, DataTypes } = require("sequelize");
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

module.exports = { sequelize, Sequelize, Checklist, Nota, Usuario };
