const { Router } = require('express');
const apiUserController = require('../controllers/api/users');
const apiUserRouter = Router();

apiUserRouter.get('/getBlogData/:id', apiUserController.getBlogData);

const baseRouter = Router();
baseRouter.use('/users', apiUserRouter);

module.exports = baseRouter;