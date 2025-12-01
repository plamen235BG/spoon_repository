const express = require("express");
const router = express.Router();
const AppDataSource = require("../config/database");
const { In } = require("typeorm");

router.post("/", async (req, res) => {
  try {
    const { facultyNumber, firstName, middleName, lastName, universityId, subjectIds } = req.body;

    if (!facultyNumber || !firstName || !lastName || !universityId || !Array.isArray(subjectIds)) {
      return res.status(400).json({
        error: "Faculty number, first name, last name, university ID and subjectID are required",
      });
    }

    const universityRepo = AppDataSource.getRepository("University");
    const subjectRepo = AppDataSource.getRepository("Subject");

    const university = await universityRepo.findOne({
      where: { id: parseInt(universityId) },
    });

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    let subjects = [];
    if (Array.isArray(subjectIds) && subjectIds.length > 0) {
      const ids = subjectIds.map((id) => parseInt(id));
      subjects = await subjectRepo.find({
        where: { id: In(ids) },
      });

      if (subjects.length !== ids.length) {
        return res
          .status(400)
          .json({ error: "One or more subjects do not exist" });
      }
    }

    const studentRepo = AppDataSource.getRepository("Student");
    const student = studentRepo.create({
      facultyNumber,
      firstName,
      middleName,
      lastName,
      university,
      subjects,
    });

    const savedStudent = await studentRepo.save(student);
    const result = await studentRepo.findOne({
      where: { id: savedStudent.id },
      relations: ["university", "subjects"],
    });


    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const studentRepo = AppDataSource.getRepository("Student");
    const students = await studentRepo.find({
      relations: ["university", "subjects"],
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const studentRepo = AppDataSource.getRepository("Student");
    const student = await studentRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["university", "subjects"],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { facultyNumber, firstName, middleName, lastName, universityId, subjectIds } = req.body;
    const studentRepo = AppDataSource.getRepository("Student");
    const subjectRepo = AppDataSource.getRepository("Subject");

    const student = await studentRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["subjects", "university"],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (facultyNumber) student.facultyNumber = facultyNumber;
    if (firstName) student.firstName = firstName;
    if (middleName !== undefined) student.middleName = middleName;
    if (lastName) student.lastName = lastName;

    if (universityId) {
      const universityRepo = AppDataSource.getRepository("University");
      const university = await universityRepo.findOne({
        where: { id: parseInt(universityId) },
      });

      if (!university) {
        return res.status(404).json({ error: "University not found" });
      }

      student.university = university;
    }

    if (Array.isArray(subjectIds)) {
      if (subjectIds.length === 0) {
        student.subjects = [];
      } else {
        const ids = subjectIds.map((id) => parseInt(id));
        const subjects = await subjectRepo.find({
          where: { id: In(ids) },
        });

        if (subjects.length !== ids.length) {
          return res
            .status(400)
            .json({ error: "One or more subjects do not exist" });
        }
        student.subjects = subjects;
      }
    }

    const updatedStudent = await studentRepo.save(student);
    const result = await studentRepo.findOne({
      where: { id: updatedStudent.id },
      relations: ["university", "subjects"],
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const studentRepo = AppDataSource.getRepository("Student");
    const student = await studentRepo.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await studentRepo.remove(student);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
