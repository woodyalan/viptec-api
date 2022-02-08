const { unlink } = require("fs");
const { Usuario, Nota, Checklist, sequelize } = require("../bd");
const { Op } = require("sequelize");
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

controller.atualizar = async (id, { titulo, descricao, imagem }) => {
  const transacao = await sequelize.transaction();
  console.log(titulo);

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

    await transacao.commit();
  } catch (erro) {
    await transacao.rollback();

    throw erro;
  }
};

module.exports = controller;
