const express = require('express');
const router = express.Router();

const healthRouter = require('./health.router');
const simulationRouter = require('./simulation.router');

router.use('/health', healthRouter);
router.use('/simulations', simulationRouter);

module.exports = router;