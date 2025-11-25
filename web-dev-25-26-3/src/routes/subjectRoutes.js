const express = require("express");
const router = express.Router();
const AppDataSource = require("../config/database");

// TODO: Implement all CRUD operations for subjects
// Reference: Look at studentRoutes.js and universityRoutes.js for patterns

// POST / - Create a new subject
router.post("/", async (req, res) => {
  try {
    // TODO: Extract name, code, credits from req.body
    // TODO: Validate that name, code, and credits are provided
    // TODO: Check if code already exists (must be unique)
    // TODO: Create and save the subject
    // TODO: Return the created subject with 201 status
    // TODO: Handle errors appropriately
    const { name, code, credits } = req.body;
  
    if (!name || !code || !credits) {
      return res.status(400).json({
        error: "name, code, credits are required",
      });
    }
  
    const subjectRepo = AppDataSource.getRepository("Subject");

    const existing = await subjectRepo.findOne({ where: { code } });
    if (existing) {
      return res.status(409).json({ error: "Subject code already exists" });
    }

    const subject = subjectRepo.create({ name, code, credits: Number(credits) });
    const saved = await subjectRepo.save(subject);

    res.status(201).json(saved);
    
  } catch (error) {
    // TODO: Return appropriate error response
    res.status(500).json({ error: error.message });
  }
});

// GET / - Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjectRepo = AppDataSource.getRepository("Subject");
    const subjects = await subjectRepo.find();
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /:id - Get a subject by ID

router.get("/:id", async (req, res) => {
  try {
    const subjectRepo = AppDataSource.getRepository("Subject");
    const id = parseInt(req.params.id);

    const subject = await subjectRepo.findOne({
      where: { id },
      relations: ["students"], // optional
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(subject);
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /:id - Update a subject
// Update Subject
router.put("/:id", async (req, res) => {
  try {
    const subjectRepo = AppDataSource.getRepository("Subject");
    const id = parseInt(req.params.id);
    const { name, code, credits } = req.body;

    const subject = await subjectRepo.findOne({ where: { id } });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (credits !== undefined) subject.credits = Number(credits);

    const saved = await subjectRepo.save(subject);
    res.json(saved);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /:id - Delete a subject
router.delete("/:id", async (req, res) => {
  try {
    const subjectRepo = AppDataSource.getRepository("Subject");
    const id = parseInt(req.params.id);

    const subject = await subjectRepo.findOne({ where: { id } });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    await subjectRepo.remove(subject);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;

