const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");
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
  checkPermission("clients.create"),
  addClientValidation,
  clientController.addClient
);

router.post(
  "/updateClient",
  authMiddleware,
  checkPermission("clients.update"),
  updateClientValidation,
  clientController.updateClient
);

router.post(
  "/deleteClient",
  authMiddleware,
  checkPermission("clients.delete"),
  deleteClientValidation,
  clientController.deleteClient
);

router.post(
  "/viewClient",
  authMiddleware,
  checkPermission("clients.view"),
  viewClientValidation,
  clientController.viewClient
);

router.post(
  "/getClients",
  authMiddleware,
  checkPermission("clients.view"),
  clientController.getClients
);

router.post(
  "/paginateClient",
  authMiddleware,
  checkPermission("clients.view"),
  paginateClientsValidation,
  clientController.paginateClients
);

router.post(
  "/getPanicAlertTransactions",
  authMiddleware,
  // checkPermission("clients.view"),
  // paginateClientsValidation,
  clientController.getPanicAlertTransactions
);
router.post(
  "/setSoSTransactionStatusToFalse",
  authMiddleware,
  // checkPermission("clients.view"),
  // paginateClientsValidation,
  clientController.setSoSTransactionStatusToFalse
);

router.post(
  "/dashboardDetails",
  // authMiddleware,
  // checkPermission("clients.view"),
  // paginateClientsValidation,
  clientController.clientDeviceCount
);


module.exports = router;
