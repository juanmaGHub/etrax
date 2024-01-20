const express = require('express');
const router = express.Router();
const expenseControllers = require('../controllers/expenseControllers');


router.post('/add', expenseControllers.add);
router.get('/all/:userId', expenseControllers.getByUserId);
router.get('/:id', expenseControllers.get);
router.put('/:id', expenseControllers.update);
router.delete('/:id', expenseControllers.remove);


module.exports = router;