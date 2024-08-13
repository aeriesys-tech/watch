const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");

const {
    addUnitValidation,
    updateUnitValidation,
    deleteUnitValidation,
    viewUnitValidation,
    getUnitsValidation,
    paginateUnitsValidation,
} = require("../validations/unitValidation");

// Routes for units
router.post(
    "/addUnit",
    authMiddleware,
    // checkPermission("units.create"), // Check for create unit permission
    addUnitValidation,
    unitController.addUnit
);

router.post(
    "/updateUnit",
    authMiddleware,
    // checkPermission("units.update"), // Check for update unit permission
    updateUnitValidation,
    unitController.updateUnit
);

router.post(
    "/deleteUnit",
    authMiddleware,
    // checkPermission("units.delete"), // Check for delete unit permission
    deleteUnitValidation,
    unitController.deleteUnit
);

router.post(
    "/viewUnit",
    authMiddleware,
    // checkPermission("units.view"), // Check for view unit permission
    viewUnitValidation,
    unitController.viewUnit
);

router.post(
    "/getUnits",
    authMiddleware,
    // checkPermission("units.view"), // Check for view units permission
    getUnitsValidation,
    unitController.getUnits
);

router.post(
    "/paginateUnits",
    authMiddleware,
    // checkPermission("units.view"), // Check for view units permission
    paginateUnitsValidation,
    unitController.paginateUnits
);

module.exports = router;
