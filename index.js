const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));

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
    return res.json(user);
  })
  .patch((req, res) => {
    //Edit user with id
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //Delete user with id
    return res.json({ status: "Pending" });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  // console.log(body);
  users.push({
    ...body,
    id: users.length + 1,
  });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to add user" });
    }
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
