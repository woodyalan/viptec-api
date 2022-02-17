const { Router } = require("express");
const router = Router();
const { login } = require("../controller/usuario");

router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const token = await login(email, senha);

    if (token) {
      res.send({ token });
    } else {
      res.status(401).send({ erro: "Login ou senha inválidos" });
    }
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
