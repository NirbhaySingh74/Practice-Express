const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

//ROUTES
app.get("/users", (req, res) => {
  const html = `
      <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
      `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);
    if (!user) return res.status(400).json({ error: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    //Edit user with id
    return res.json({ status: "Pending" });
  });

//POST REQUEST
app.post("/api/users", (req, res) => {
  const { body } = req;
  console.log(req.body);
  if (!body.first_name || !body.last_name || !body.email || !body.job_title)
    return res.status(400);
  const newUSer = {
    ...body,
    id: users.length + 1,
  };

  users.push(newUSer);

  // Update the JSON file with the new user (if needed)
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to add user" });
    }
    // Send a success response with the newly created user
    return res.status(201).json({ status: "success", newUSer });
  });
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));

//DELETE
app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = users.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  // Remove 1 element at the found index
  users.splice(findUserIndex, 1);

  // Update the JSON file with the modified user data
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update user data" });
    }
    // Send a success response
    return res.status(200).json({ status: "success" });
  });
});
