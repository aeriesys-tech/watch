const express = require("express");
const router = express.Router();
const clientUserController = require("../controllers/clientUserController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");
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
  checkPermission("client_users.create"),
  addClientUserValidation,
  clientUserController.addClientUser
);

// Update an existing ClientUser
router.post(
  "/updateClientUser",
  authMiddleware,
  checkPermission("client_users.update"),
  updateClientUserValidation,
  clientUserController.updateClientUser
);

// Delete a ClientUser
router.post(
  "/deleteClientUser",
  authMiddleware,
  checkPermission("client_users.delete"),
  deleteClientUserValidation,
  clientUserController.deleteClientUser
);

// View a specific ClientUser by ID
router.post(
  "/viewClientUser",
  authMiddleware,
  checkPermission("client_users.view"),
  viewClientUserValidation,
  clientUserController.viewClientUser
);

// Get all ClientUsers
router.post(
  "/getClientUsers",
  authMiddleware,
  checkPermission("client_users.view"),
  clientUserController.getClientUsers
);

// Paginate ClientUsers
router.post(
  "/paginateClientUsers",
  authMiddleware,
  checkPermission("client_users.view"),
  paginateClientUsersValidation,
  clientUserController.paginateClientUsers
);

module.exports = router;
