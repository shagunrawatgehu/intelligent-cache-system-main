function validateAndNormalizeInput(cacheSize, referenceString) {
  const parsedSize = parseInt(cacheSize, 10);
  if (isNaN(parsedSize) || parsedSize <= 0) {
    return {
      validSize: 0,
      pages: [],
      error: 'Cache size must be a positive integer greater than 0.'
    };
  }

  if (referenceString === null || referenceString === undefined) {
    return {
      validSize: parsedSize,
      pages: [],
      error: null
    };
  }

  let pages = [];

  if (Array.isArray(referenceString)) {
    pages = referenceString
      .map(p => parseInt(p, 10))
      .filter(p => !isNaN(p));
  } else if (typeof referenceString === 'string') {
    const cleanStr = referenceString.trim();
    if (cleanStr.length > 0) {
      pages = cleanStr
        .split(/[\s,]+/)
        .map(p => parseInt(p, 10))
        .filter(p => !isNaN(p));
    }
  } else {
    return {
      validSize: parsedSize,
      pages: [],
      error: 'Invalid reference string format. Expected an array of numbers or a comma/space-separated string.'
    };
  }

  return {
    validSize: parsedSize,
    pages,
    error: null
  };
}

module.exports = {
  validateAndNormalizeInput
};