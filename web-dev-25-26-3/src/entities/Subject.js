const EntitySchema = require("typeorm").EntitySchema;

// TODO: Complete the Subject entity definition
// Reference: Look at Student.js and University.js for patterns
module.exports = new EntitySchema({
  name: "Subject",
  tableName: "subjects",
  columns: {
    id: {
      // TODO: Define as primary key, integer, auto-generated
      // Hint: Look at Student.js line 7-11
      primary: true,
      type: "integer",
      generated: true,
    },
    name: {
      // TODO: Define as varchar, required (nullable: false)
      // Hint: Look at University.js line 12-15
      type: "varchar",
      nullable: false,
      unique: true,
    },
    code: {
      // TODO: Define as varchar, required, unique
      // Examples: "CS101", "MATH201", "ENG102"
      // Hint: Look at Student.js line 12-16 for unique constraint
      type: "varchar",
      nullable: false,
      unique: true,
    },
    credits: {
      // TODO: Define as integer, required
      // Examples: 3, 4, 6 credits
      // Hint: Use type: "integer"
      type: "integer",
      nullable: false,
      unique: false,
    },
  },
  relations: {
    students: {
      // TODO: Define many-to-many relationship with Student
      // type: "many-to-many"
      // Create a join table (e.g., "student_subjects")
      // Set inverseSide to "subjects" (the relation name in Student entity)
      // Hint: Look at University.js relations for one-to-many example
      // For many-to-many, you'll need:
      // - target: "Student"
      // - type: "many-to-many"
      // - joinTable: { name: "student_subjects" }
      // - inverseSide: "subjects"
      target: "Student",
      type: "many-to-many",
      inverseSide: "subjects",
      
      joinTable: {
        name: "student_subjects",
      },
    },
  },
});

