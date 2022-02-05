const { Router } = require("express");
const router = Router();
const { criar, buscarPorId, listar } = require("../controller/nota");

router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = id ? await buscarPorId(id) : await listar();

    res.send(resultado);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

router.post("/", async (req, res) => {
  try {
    const { usuarioId, titulo, descricao, checklists } = req.body;

    const notaCriada = await criar(usuarioId, titulo, descricao, checklists);
    const resultado = await buscarPorId(notaCriada.id);

    res.send(resultado);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
