const argon2 = require("argon2");
const db = require("../models/db");

async function createUser(req, res) {
    const { email, password, name } = req.body;
  
    try {
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required" });
        return;
      }
  
      // Hash the password
      const passwordHash = await argon2.hash(password);
  
      // Insert user into the database
      const sql = "INSERT INTO users(email, password_hash, name) VALUES (?, ?, ?)";
      const params = [email, passwordHash, name];
  
      await db.query(sql, params);
  
      res.status(200).json({ success: true, message: "User registered" });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

async function updateUser(req, res) {
  const { email, newPassword } = req.body;

  try {
    // Retrieve user information
    const [user] = await db.query(
      "SELECT id, password FROM users WHERE id = ?",
      [req.userId]
    );

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // check if the email is already in use by another user
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, req.userId]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is already in use by another user",
        });
    }

    // hash the new password
    let newPasswordHash;
    if (newPassword) {
      newPasswordHash = await argon2.hash(newPassword);
    }

    // udpate user info
    const updateParams = newPasswordHash
      ? [email, newPasswordHash, req.userId]
      : [email, req.userId];
    await db.query(
      "UPDATE users SET email = ?, password = ? WHERE id = ?",
      updateParams
    );

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    // Delete the user
    await db.query("DELETE FROM users WHERE id = ?", [req.userId]);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "failed to delete user" });
  }
}

async function getUser(req, res) {
    try {
      // Retrieve user information
      const [user] = await db.query(
        "SELECT id, email, name FROM users WHERE id = ?",
        [req.userId]
      );
  
      if (user.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, user: user[0] });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser
};
