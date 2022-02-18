const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  remover,
} = require("../controller/usuario");
const router = Router();

// Devolver uma lista de objetos ou um objeto
router.get("/:id?", check("id").optional().isInt(), async (req, res) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(400).send({ erros });
  }

  try {
    const { id } = req.params;
    let resposta;

    if (id) {
      resposta = await buscarPorId(id);
    } else {
      resposta = await listar();
    }

    res.send(resposta);
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
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let dados = req.body;

    await atualizar(id, dados);
    const resultado = await buscarPorId(id);

    res.send(resultado);
  } catch (erro) {
    res.status(500).send({ erro });
  }
});

// Remover recurso existente
router.delete("/:id", async (req, res) => {
  try {
    await remover(req.params.id);

    res.send();
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
