const express = require("express");
const router = express.Router();
const clientUserController = require("../controllers/clientUserController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addClientUserValidation,
  updateClientUserValidation,
  deleteClientUserValidation,
  viewClientUserValidation,
  paginateClientUsersValidation,
} = require("../validations/clientUserValidation");

// Routes

// Add a new ClientUser
router.post(
  "/addClientUser",
  authMiddleware,
  addClientUserValidation,
  clientUserController.addClientUser
);

// Update an existing ClientUser
router.post(
  "/updateClientUser",
  authMiddleware,
  updateClientUserValidation,
  clientUserController.updateClientUser
);

// Delete a ClientUser
router.post(
  "/deleteClientUser",
  authMiddleware,
  deleteClientUserValidation,
  clientUserController.deleteClientUser
);

// View a specific ClientUser by ID
router.post(
  "/viewClientUser",
  authMiddleware,
  viewClientUserValidation,
  clientUserController.viewClientUser
);

// Get all ClientUsers
router.post(
  "/getClientUsers",
  authMiddleware,
  clientUserController.getClientUsers
);

// Paginate ClientUsers
router.post(
  "/paginateClientUsers",
  authMiddleware,
  paginateClientUsersValidation,
  clientUserController.paginateClientUsers
);

module.exports = router;
