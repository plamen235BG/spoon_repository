const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Subject",
  tableName: "subjects",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    code: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    credits: {
      type: "integer",
      nullable: false,
    },
  },
  relations: {
    students: {
      target: "Student",
      type: "many-to-many",
      inverseSide: "subjects",
    },
  },
});