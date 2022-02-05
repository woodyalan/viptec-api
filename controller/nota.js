const { Usuario, Nota, Checklist, sequelize } = require("../bd");
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

    return nota;
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
};

controller.buscarPorId = async (id) => {
  try {
    return await Nota.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Checklist,
          as: "checklists",
        },
      ],
    });
  } catch (erro) {
    throw erro;
  }
};

controller.listar = async () => {
  try {
    return await Nota.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Checklist,
          as: "checklists",
        },
      ],
    });
  } catch (erro) {
    throw erro;
  }
};

controller.remover = async (id) => {
  const transacao = await sequelize.transaction();

  try {
    await Checklist.destroy({
      where: {
        notaId: id,
      },
      transaction: transacao,
    });

    await Nota.destroy({
      where: {
        id,
      },
      transaction: transacao,
    });

    await transacao.commit();
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
};

module.exports = controller;
