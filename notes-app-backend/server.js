const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/notes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({
    title,
    content,
  });
  await newNote.save();
  res.json(newNote);
});

app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { title, content },
    { new: true }
  );
  res.json(updatedNote);
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.json({ message: "Note deleted" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
