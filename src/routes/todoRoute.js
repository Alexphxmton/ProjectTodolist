const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');


router.get('/todos', todoController.listar);
router.get('/todos/in-progress', todoController.inProgress);
router.get('/todos/completed', todoController.completed);

router.post('/todos', todoController.crear);

router.patch('/todos/mark-all', todoController.marcarTodos);
router.patch('/todos/:id', todoController.actualizar);


router.delete('/todos/clear-all', todoController.clearAll)
router.delete('/todos/:id', todoController.eliminar);




module.exports = router;
