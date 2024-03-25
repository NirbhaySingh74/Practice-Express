const express = require("express");

const router = express.Router();
const {
  handleGetAllUsers,
  handlegetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateUserById,
} = require("../controllers/user");

router.post("/", handleCreateUserById);

//Getting All the users from the database
router.get("/", handleGetAllUsers);

//Getting users by Id
router.get("/:id", handlegetUserById);

//updating the data
router.patch("/:id", handleUpdateUserById);

//Deleting the data
router.delete("/:id", handleDeleteUserById);

module.exports = router;
