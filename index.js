const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const mongodbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.rh05iiz.mongodb.net/taskDB`;

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb Connected");
  })
  .catch((err) => console.error("Failed to connect with mongoDB", err));

//defining task schema and model

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

//API endpoints
app.get("/", (req, res) => {
  res.send("server running");
});

//C= Create
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//R= Read
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//R= Read single task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//U= Update by task id
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    console.log(body);
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//D= Delete by task id
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//checking server
app.listen(port, () => {
  console.log("Server is running in port", port);
});
