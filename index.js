const express = require("express");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/public", express.static("public"));
app.use(fileupload());

const usuario = require("./rotas/usuario");
const nota = require("./rotas/nota");
const login = require("./rotas/login");
const tokenVerify = require("./middleware/tokenVerify");

app.use("/login", login);
app.use(tokenVerify);
app.use("/usuario", usuario);
app.use("/nota", nota);

app.listen(3001, () => {
  console.log("Aplicação iniciada");
});
