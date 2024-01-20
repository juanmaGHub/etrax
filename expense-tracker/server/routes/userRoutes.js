const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');


router.post('/login', userControllers.login);
router.post('/register', userControllers.register);
router.put('/update', userControllers.update);
router.get('/:id', userControllers.get);
router.delete('/:id', userControllers.remove);


module.exports = router;