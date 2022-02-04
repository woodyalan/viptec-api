const { Router } = require("express");
const router = Router();
const { criar } = require("../controller/nota");

router.post("/", async (req, res) => {
  try {
    const { usuarioId, titulo, descricao, checklists } = req.body;

    await criar(usuarioId, titulo, descricao, checklists);

    res.send();
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
