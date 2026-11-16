const { simulateFIFO } = require('./fifo');
const { simulateLRU } = require('./lru');
const { simulateLFU } = require('./lfu');
const { simulateOptimal } = require('./optimal');
const { simulatePrediction } = require('./prediction');
const { validateAndNormalizeInput } = require('./validator');

const ALGORITHM_REGISTRY = {
  FIFO: simulateFIFO,
  LRU: simulateLRU,
  LFU: simulateLFU,
  OPTIMAL: simulateOptimal,
  OPT: simulateOptimal,
  PREDICTION: simulatePrediction,
  PREDICTIVE: simulatePrediction,
  INTELLIGENT: simulatePrediction
};

function runAlgorithm(name, cacheSize, referenceString) {
  const normalizedKey = (name || '').toUpperCase().trim();
  const algorithmFn = ALGORITHM_REGISTRY[normalizedKey];

  if (!algorithmFn) {
    throw new Error(`Unknown algorithm '${name}'. Available: FIFO, LRU, LFU, Optimal, PREDICTION`);
  }

  const startTime = process.hrtime();
  const result = algorithmFn(cacheSize, referenceString);
  const diff = process.hrtime(startTime);
  const executionTimeMs = parseFloat(((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(4));

  return {
    ...result,
    executionTimeMs
  };
}

function runAllAlgorithms(cacheSize, referenceString, algorithmList = ['FIFO', 'LRU', 'LFU', 'Optimal', 'PREDICTION']) {
  const results = {};
  const comparison = [];

  algorithmList.forEach(algoName => {
    const res = runAlgorithm(algoName, cacheSize, referenceString);
    results[res.algorithm] = res;
    comparison.push({
      algorithm: res.algorithm,
      totalRequests: res.totalRequests,
      hits: res.hits,
      misses: res.misses,
      hitRatio: res.hitRatio,
      missRatio: res.missRatio,
      replacements: res.replacements,
      executionTimeMs: res.executionTimeMs,
      memoryOverheadBytes: res.memoryOverheadBytes,
      memoryOverhead: res.memoryOverhead
    });
  });

  comparison.sort((a, b) => b.hitRatio - a.hitRatio);

  return {
    cacheSize: parseInt(cacheSize, 10),
    totalRequests: results[Object.keys(results)[0]]?.steps?.length || 0,
    comparison,
    details: results
  };
}

module.exports = {
  simulateFIFO,
  simulateLRU,
  simulateLFU,
  simulateOptimal,
  simulatePrediction,
  validateAndNormalizeInput,
  runAlgorithm,
  runAllAlgorithms
};