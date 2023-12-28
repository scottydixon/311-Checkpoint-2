const db = require("../models/db");

// async bc await
async function createTask(req, res) {
  const { taskName } = req.body;
  const userId = req.userId;

  try {
    // Save task to the database, associated w/ the user
    await db.execute("INSERT INTO tasks (taskName, userId) VALUES (?, ?)", [
      taskName,
      userId,
    ]);

    res.json({ success: true, message: "Task created successfully" });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// async bc await
async function getTasks(req, res) {
  try {
    const [rows] = await db.execute(
      "SELECT id, taskName, completed FROM tasks WHERE userId = ?",
      [req.userId]
    );
    const tasks = rows;

    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// async bc await
async function updateTask(req, res) {
  const { taskId, completed } = req.body;

  try {
    // Check if the task belongs to the authenticated user
    const [task] = await db.execute(
      "SELECT id FROM tasks WHERE id = ? AND userId = ?",
      [taskId, req.userId]
    );

    if (task.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });
    }

    // Update task completion status
    await db.execute("UPDATE tasks SET completed = ? WHERE id = ?", [
      completed,
      taskId,
    ]);

    res.json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// async bc await
async function deleteTask(req, res) {
  const { taskId } = req.body;

  try {
    // Check if the task belongs to the authenticated user
    const [task] = await db.execute(
      "SELECT id FROM tasks WHERE id = ? AND userId = ?",
      [taskId, req.userId]
    );

    if (task.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });
    }

    // Delete the task
    await db.execute("DELETE FROM tasks WHERE id = ?", [taskId]);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Unable to delete Task" });
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
