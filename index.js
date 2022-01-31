const express = require("express");
const app = express();

app.use(express.json());

const usuario = require("./rotas/usuario");
const { sequelize } = require("./bd");

app.get("/", (req, res) => {
  res.send({ mensagem: "Bem vindo" });
});

app.use("/usuario", usuario);

app.listen(3001, () => {
  console.log("Aplicação iniciada");
});
