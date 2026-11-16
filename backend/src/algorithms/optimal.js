const { validateAndNormalizeInput } = require('./validator');
const { formatBytes } = require('./memoryHelper');

function simulateOptimal(cacheSize, referenceString) {
  const { validSize, pages, error } = validateAndNormalizeInput(cacheSize, referenceString);
  if (error) throw new Error(`[Optimal Error] ${error}`);

  const totalRequests = pages.length;
  const memoryOverheadBytes = (validSize + totalRequests) * 4;
  const memoryOverhead = formatBytes(memoryOverheadBytes);

  if (totalRequests === 0) {
    return {
      algorithm: 'Optimal',
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
  let timeClock = 0;

  for (let i = 0; i < totalRequests; i++) {
    const page = pages[i];
    timeClock++;
    let result = 'MISS';
    let evictedPage = null;

    const existingIndex = cache.findIndex(item => item.page === page);

    if (existingIndex !== -1) {
      hits++;
      result = 'HIT';
    } else {
      misses++;
      result = 'MISS';

      if (cache.length < validSize) {
        cache.push({ page, arrivalTime: timeClock });
      } else {
        let farthestDistance = -1;
        let victimIndex = 0;
        let oldestArrivalTime = Infinity;

        for (let c = 0; c < cache.length; c++) {
          const cachedPage = cache[c].page;
          let nextOccurrence = Infinity;

          for (let f = i + 1; f < totalRequests; f++) {
            if (pages[f] === cachedPage) {
              nextOccurrence = f;
              break;
            }
          }

          if (nextOccurrence > farthestDistance) {
            farthestDistance = nextOccurrence;
            victimIndex = c;
            oldestArrivalTime = cache[c].arrivalTime;
          } else if (nextOccurrence === farthestDistance) {
            if (cache[c].arrivalTime < oldestArrivalTime) {
              oldestArrivalTime = cache[c].arrivalTime;
              victimIndex = c;
            }
          }
        }

        evictedPage = cache[victimIndex].page;
        cache[victimIndex] = { page, arrivalTime: timeClock };
        replacements++;
      }
    }

    steps.push({
      request: page,
      cacheState: cache.map(item => item.page),
      result,
      evictedPage
    });
  }

  const hitRatio = parseFloat((hits / totalRequests).toFixed(4));
  const missRatio = parseFloat((misses / totalRequests).toFixed(4));

  return {
    algorithm: 'Optimal',
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
  simulateOptimal
};