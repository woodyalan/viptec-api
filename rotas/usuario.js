const { Router } = require("express");
const { criar, listar } = require("../controller/usuario");
const router = Router();

// Devolver uma lista de objetos ou um objeto
router.get("/", async (req, res) => {
  try {
    const usuarios = await listar();

    res.send(usuarios);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

// Criar um novo recurso
router.post("/", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioCriado = await criar(nome, email, senha);

    res.send(usuarioCriado);
  } catch (erro) {
    res.status(500).send({ erro });
  }
});

// Atualizar um recurso existente
router.put("/:id", (req, res) => {
  let id = req.params.id;
  res.send("Rota para atualizar recurso " + id);
});

// Remover recurso existente
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  res.send("Rota para remover recurso " + id);
});

module.exports = router;
