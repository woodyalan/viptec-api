const { unlink } = require("fs");
const { Usuario, Nota, Checklist, sequelize } = require("../bd");
const { Op } = require("sequelize");
const checklist = require("../bd/checklist");
const controller = {};

controller.criar = async (
  usuarioId,
  titulo,
  descricao,
  imagem,
  checklists = []
) => {
  const transacao = await sequelize.transaction();

  try {
    const nota = await Nota.create(
      {
        usuarioId,
        titulo,
        descricao,
        imagem,
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

controller.buscarPorId = async (id, usuarioId) => {
  try {
    return await Nota.findOne({
      where: {
        id,
        usuarioId,
      },
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

controller.listar = async (usuarioId) => {
  try {
    return await Nota.findAll({
      where: {
        usuarioId,
      },
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

    const notaParaRemover = await Nota.findByPk(id);
    const notasComMesmaImagem = await Nota.findAll({
      where: {
        imagem: notaParaRemover.imagem,
        id: {
          [Op.notIn]: [id],
        },
      },
    });

    await Nota.destroy({
      where: {
        id,
      },
      transaction: transacao,
    });

    if (notaParaRemover.imagem && notasComMesmaImagem.length === 0) {
      unlink(notaParaRemover.imagem, (erro) => {
        if (erro) throw erro;
      });
    }

    await transacao.commit();
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
};

controller.atualizar = async (
  id,
  { titulo, descricao, imagem },
  checklists
) => {
  const transacao = await sequelize.transaction();

  try {
    await Nota.update(
      {
        titulo,
        descricao,
        imagem,
      },
      {
        where: {
          id,
        },
        transaction: transacao,
      }
    );

    await Checklist.destroy({
      where: {
        notaId: id,
        id: {
          [Op.notIn]: checklists.filter((i) => i.id).map((i) => i.id),
        },
      },
      transaction: transacao,
    });

    if (checklists && checklists.length > 0) {
      for (const item of checklists) {
        if (item.id) {
          await Checklist.update(
            {
              descricao: item.descricao,
              concluido: item.concluido,
            },
            {
              where: {
                id: item.id,
              },
              transaction: transacao,
            }
          );
        } else {
          await Checklist.create(
            {
              notaId: id,
              descricao: item.descricao,
              concluido: item.concluido,
            },
            {
              transaction: transacao,
            }
          );
        }
      }
    }

    await transacao.commit();
  } catch (erro) {
    await transacao.rollback();

    throw erro;
  }
};

module.exports = controller;
