const { Nota, Checklist, sequelize } = require("../bd");
const controller = {};

controller.criar = async (usuarioId, titulo, descricao, checklists = []) => {
  const transacao = await sequelize.transaction();

  try {
    const nota = await Nota.create(
      {
        usuarioId,
        titulo,
        descricao,
      },
      {
        transaction: transacao,
      }
    );

    for (const checklist of checklists) {
      const { descricao, concluido } = checklist;

      await Checklist.create(
        {
          notaId: nota.id,
          descricao,
          concluido: concluido === true ? 1 : 0,
        },
        {
          transaction: transacao,
        }
      );
    }

    await transacao.commit();
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
};

module.exports = controller;
