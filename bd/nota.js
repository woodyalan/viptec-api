module.exports = (sequelize, DataType) => {
  const Nota = sequelize.define(
    "nota",
    {
      id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id",
        },
      },
      titulo: {
        type: DataType.STRING(100),
        allowNull: false,
      },
      descricao: {
        type: DataType.TEXT,
        allowNull: true,
      },
      imagem: {
        type: DataType.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "nota",
      timestamps: false,
    }
  );

  return Nota;
};
