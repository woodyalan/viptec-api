const { Router } = require("express");
const router = Router();

// Devolver uma lista de objetos ou um objeto
router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      nome: "Alan",
    },
    {
      id: 2,
      nome: "João",
    },
  ]);
});

// Criar um novo recurso
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("Rota para criar usuários");
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
