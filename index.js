const express = require("express");
const fileupload = require("express-fileupload");
const app = express();

app.use(express.json());
app.use("/public", express.static("public"));
app.use(fileupload());

const usuario = require("./rotas/usuario");
const nota = require("./rotas/nota");

app.get("/", (req, res) => {
  res.send({ mensagem: "Bem vindo" });
});

app.use("/usuario", usuario);
app.use("/nota", nota);

app.listen(3001, () => {
  console.log("Aplicação iniciada");
});
