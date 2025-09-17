// the defines the Inspiration Routes
const express = require('express');
const router = express.Router();
const InspireController = require('../controllers/inspireController');

// Inspiration endpoints
router.post('/fresh-air', InspireController.freshAir);
router.post('/food', InspireController.food);
router.post('/joke', InspireController.joke);
router.post('/game', InspireController.game);
router.post('/physical-care', InspireController.physicalCare);
router.post('/compliment', InspireController.compliment);
router.post('/birthday-cake', InspireController.birthdayCake);

module.exports = router;

