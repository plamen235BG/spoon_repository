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
    // обратната страна на many-to-many
    students: {
      target: "Student",
      type: "many-to-many",
      inverseSide: "subjects", // името на relation-а в Student.js
    },
  },
});