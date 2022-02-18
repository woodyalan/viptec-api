const { Router } = require("express");
const router = Router();
const { login, buscarPorEmail, atualizar } = require("../controller/usuario");
const { send } = require("../controller/mail");

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

    if (usuario) {
      const novaSenha = (Math.random() + 1).toString(36).substring(7);

      await atualizar(usuario.id, { senha: novaSenha });

      const from = '"API da Viptec" <viptecapi@gmail.com>';
      const subject = "Recuperação de Senha";
      const html = `
        <p>Olá!</p>

        <p>Utilize sua senha temporária para acessar: <strong>${novaSenha}</strong></p>
        
        <br>
        --
        <p><strong>Viptec API</strong></p>`;

      await send(from, email, subject, html);

      return res.send({
        sucesso: `A senha foi enviada para o e-mail ${email}`,
      });
    }

    res.status(400).send({ erro: "E-mail informado é inválido" });
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
