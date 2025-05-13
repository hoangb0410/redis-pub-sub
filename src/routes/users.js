const express = require("express");
const pool = require("../db");
const { publishUserEvent } = require("../pubsub/publisher");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const [result] = await pool.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  const user = { id: result.insertId, name, email };
  await publishUserEvent("create", user);
  res.status(201).json(user);
});

// READ
router.get("/", async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM users");
  const users = rows;
  await publishUserEvent("get", users); // Publish 'GET' event to Redis
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = rows[0];
  await publishUserEvent("get_by_id", user); // Publish 'GET by ID' event to Redis
  res.json(user);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  await pool.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    id,
  ]);
  const user = { id, name, email };
  await publishUserEvent("update", user);
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  await publishUserEvent("delete", { id });
  res.sendStatus(204);
});

module.exports = router;
