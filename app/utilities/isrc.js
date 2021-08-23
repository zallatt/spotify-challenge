/**
 * @constant {RegExp} isrcRegex - ISRC format regular expression
 */
const isrcRegex = /^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/;

/**
 * Check if ISRC is valid format
 *
 * @param {string} isrc - Track ISRC
 * @returns {boolean} True if ISRC is valid format
 */
 const isValidISRC = (isrc) => {
  return isrcRegex.test(isrc);
};

module.exports = {
  isValidISRC,
};
