const jwt = require("jsonwebtoken");
const { palavraChave } = require("../config");

const tokenVerify = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ erro: "Token não informado" });
  }

  //validação do token;
  jwt.verify(token, palavraChave, (erro, decoded) => {
    if (erro) return res.status(500).send({ erro });

    const { id } = decoded;

    req.usuarioId = id;

    next();
  });
};

module.exports = tokenVerify;
