const { Router } = require("express");
const router = Router();
const { login, buscarPorEmail } = require("../controller/usuario");

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

router.post("/esqueci", async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await buscarPorEmail(email);

    if (usuario.id) {
      //gerar uma senha temporária
      //enviar senha temporária via email
    }

    res.send({ email });
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
