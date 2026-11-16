const { validateAndNormalizeInput } = require('./validator');
const { formatBytes } = require('./memoryHelper');

function simulateLFU(cacheSize, referenceString) {
  const { validSize, pages, error } = validateAndNormalizeInput(cacheSize, referenceString);
  if (error) throw new Error(`[LFU Error] ${error}`);

  const totalRequests = pages.length;
  const memoryOverheadBytes = validSize * 8;
  const memoryOverhead = formatBytes(memoryOverheadBytes);

  if (totalRequests === 0) {
    return {
      algorithm: 'LFU',
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

  let cache = [];
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

    const existingEntry = cache.find(item => item.page === page);

    if (existingEntry) {
      hits++;
      result = 'HIT';
      existingEntry.freq += 1;
    } else {
      misses++;
      result = 'MISS';

      if (cache.length < validSize) {
        cache.push({
          page,
          freq: 1,
          arrivalTime: timeClock
        });
      } else {
        let victimIndex = 0;
        let minFreq = cache[0].freq;
        let oldestTime = cache[0].arrivalTime;

        for (let j = 1; j < cache.length; j++) {
          const item = cache[j];
          if (item.freq < minFreq) {
            minFreq = item.freq;
            oldestTime = item.arrivalTime;
            victimIndex = j;
          } else if (item.freq === minFreq && item.arrivalTime < oldestTime) {
            oldestTime = item.arrivalTime;
            victimIndex = j;
          }
        }

        evictedPage = cache[victimIndex].page;
        cache.splice(victimIndex, 1);
        cache.push({
          page,
          freq: 1,
          arrivalTime: timeClock
        });
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
    algorithm: 'LFU',
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
  simulateLFU
};