const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers');


router.get('/all', categoryControllers.fetchAll);


module.exports = router;