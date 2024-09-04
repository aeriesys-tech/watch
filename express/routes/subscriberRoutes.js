const express = require("express");
const router = express.Router();
const subscriberController = require('../controllers/subscriberController')
const authMiddleware = require("../middleware/authMiddleware");

router.post('/addSubscriber', authMiddleware, subscriberController.addSubscriber)
router.post('/updateSubscriber', authMiddleware, subscriberController.updateSubscriber)
router.post('/paginateSubscribers', authMiddleware, subscriberController.paginateSubscribers)
router.post('/deleteSubscriber', authMiddleware, subscriberController.deleteSubscriber)
router.post('/getSubscriber', authMiddleware, subscriberController.getSubscriber)

module.exports = router