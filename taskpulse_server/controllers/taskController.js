const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  const task = await Task.create({ title, description, status, priority, user: req.user._id });

  req.io.emit("task:created", task); // broadcast
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });

  req.io.emit("task:updated", task); // broadcast
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  req.io.emit("task:deleted", req.params.id); // broadcast
  res.json({ message: "Task deleted" });
};
