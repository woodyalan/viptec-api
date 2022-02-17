const { Router } = require("express");
const path = require("path");
const router = Router();
const {
  criar,
  buscarPorId,
  listar,
  remover,
  atualizar,
} = require("../controller/nota");

router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req;

    const resultado = id
      ? await buscarPorId(id, usuarioId)
      : await listar(usuarioId);

    res.send(resultado);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

router.post("/", async (req, res) => {
  try {
    const { usuarioId } = req;
    const { titulo, descricao, imagem, checklists } = req.body;

    const notaCriada = await criar(
      usuarioId,
      titulo,
      descricao,
      imagem,
      checklists
    );

    const resultado = await buscarPorId(notaCriada.id, usuarioId);

    res.send(resultado);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await remover(id);

    res.send();
  } catch (erro) {
    res.status(500).send({ erro });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { usuarioId } = req;
    const { id } = req.params;
    const dados = req.body;
    const { checklists } = req.body;

    await atualizar(id, dados, checklists);
    const notaAtualizada = await buscarPorId(id, usuarioId);

    res.send(notaAtualizada);
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { arquivo } = req.files;

    let diretorio = path.join(__dirname, "../public");

    let nomeArquivo = arquivo.md5;
    let extensao = arquivo.mimetype.split("/")[1];

    arquivo.mv(`${diretorio}/${nomeArquivo}.${extensao}`, (erro) => {
      if (erro) {
        throw erro;
      }

      res.json({
        arquivo: `public/${nomeArquivo}.${extensao}`,
        nomeArquivo: arquivo.name,
      });
    });
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ erro });
  }
});

module.exports = router;
