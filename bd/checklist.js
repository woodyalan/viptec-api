module.exports = (sequelize, DataType) => {
  const Checklist = sequelize.define(
    "checklist",
    {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      notaId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: "nota",
          key: "id",
        },
      },
      descricao: {
        type: DataType.TEXT,
        allowNull: false,
      },
      concluido: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "checklist",
      timestamps: false,
    }
  );

  return Checklist;
};
