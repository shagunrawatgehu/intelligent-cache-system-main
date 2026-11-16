const express = require('express');
const router = express.Router();
const SimulationController = require('../controllers/simulation.controller');

router.post('/run', SimulationController.runSimulation);
router.post('/', SimulationController.createSimulation);
router.get('/', SimulationController.getSimulationHistory);
router.get('/:id', SimulationController.getSimulationDetails);
router.delete('/:id', SimulationController.deleteSimulation);

router.post('/:id/requests', SimulationController.saveRequests);
router.post('/:id/results', SimulationController.saveAlgorithmResults);
router.post('/:id/cache-states', SimulationController.saveCacheStates);
router.get('/:id/cache-states', SimulationController.getCacheStates);

module.exports = router;