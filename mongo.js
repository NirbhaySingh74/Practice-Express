const express = require("express");

const userRouter = require("./routes/user");
const { connectMongoDb } = require("./connection");

const app = express();
const PORT = 5000;

//Connecting
connectMongoDb("mongodb://127.0.0.1:27017/youtube-app").then(() =>
  console.log("MongoDb Connected")
);
//SCHEMA

//middleware
app.use(express.json());

//Router
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
