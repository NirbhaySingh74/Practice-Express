const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();
const PORT = 5000;

app.use(express.json());

//Connecting
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app")
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log("Mongo Errr", err));

//SCHEMA
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("This is home page");
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.jobTitle ||
    !body.gender
  ) {
    return res.status(400).json({ msg: "All fields are requires.." });
  }
  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    jobTitle: body.jobTitle,
    gender: body.gender,
  });
  //   console.log(result);
  return res.status(201).json({ msg: "success" });
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));

//Getting All the users from the database
app.get("/users", async (req, res) => {
  const allUSers = await User.find({});
  const html = `
  <ul>
  ${allUSers.map((user) => `<li>${user.firstName} - ${user.email}</li>`)}
  </ul>
  `;
  res.send(html);
});

//Getting users by Id
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).json({ error: "user not found" });
  return res.json(user);
});

//updating the data
app.patch("/api/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { jobTitle: "mern stack" });
  return res.send(200).json({ message: "updated succesfully" });
});

//Deleting the data
app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).json({ status: "success" });
});
