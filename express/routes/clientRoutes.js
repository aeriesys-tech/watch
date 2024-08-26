const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addClientValidation,
  updateClientValidation,
  deleteClientValidation,
  viewClientValidation,
  paginateClientsValidation,
} = require("../validations/clientValidation");

// Routes
router.post(
  "/addClient",
  authMiddleware,
  addClientValidation,
  clientController.addClient
);

router.post(
  "/updateClient",
  authMiddleware,
  updateClientValidation,
  clientController.updateClient
);

router.post(
  "/deleteClient",
  authMiddleware,
  deleteClientValidation,
  clientController.deleteClient
);

router.post(
  "/viewClient",
  authMiddleware,
  viewClientValidation,
  clientController.viewClient
);

router.post("/getClients", authMiddleware, clientController.getClients);

router.post(
  "/paginateClient",
  authMiddleware,
  paginateClientsValidation,
  clientController.paginateClients
);

module.exports = router;
