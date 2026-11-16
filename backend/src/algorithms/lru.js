const { validateAndNormalizeInput } = require('./validator');
const { formatBytes } = require('./memoryHelper');

function simulateLRU(cacheSize, referenceString) {
  const { validSize, pages, error } = validateAndNormalizeInput(cacheSize, referenceString);
  if (error) throw new Error(`[LRU Error] ${error}`);

  const totalRequests = pages.length;
  const memoryOverheadBytes = validSize * 8;
  const memoryOverhead = formatBytes(memoryOverheadBytes);

  if (totalRequests === 0) {
    return {
      algorithm: 'LRU',
      totalRequests: 0,
      hits: 0,
      misses: 0,
      hitRatio: 0,
      missRatio: 0,
      replacements: 0,
      memoryOverheadBytes,
      memoryOverhead,
      steps: []
    };
  }

  const cache = [];
  const steps = [];
  let hits = 0;
  let misses = 0;
  let replacements = 0;

  for (let i = 0; i < totalRequests; i++) {
    const page = pages[i];
    let result = 'MISS';
    let evictedPage = null;

    const pageIndex = cache.indexOf(page);

    if (pageIndex !== -1) {
      hits++;
      result = 'HIT';
      cache.splice(pageIndex, 1);
      cache.push(page);
    } else {
      misses++;
      result = 'MISS';

      if (cache.length < validSize) {
        cache.push(page);
      } else {
        evictedPage = cache.shift();
        cache.push(page);
        replacements++;
      }
    }

    steps.push({
      request: page,
      cacheState: [...cache],
      result,
      evictedPage
    });
  }

  const hitRatio = parseFloat((hits / totalRequests).toFixed(4));
  const missRatio = parseFloat((misses / totalRequests).toFixed(4));

  return {
    algorithm: 'LRU',
    totalRequests,
    hits,
    misses,
    hitRatio,
    missRatio,
    replacements,
    memoryOverheadBytes,
    memoryOverhead,
    steps
  };
}

module.exports = {
  simulateLRU
};