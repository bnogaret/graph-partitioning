'use strict';

/**
 * Transform the keys /value of the object options into a string with the format: -key=value -key=value.
 * If options is null or not an object, it returns an empty string.
 * @param {Object} options
 * @return {String}
 */
function getStringFromOptionsWithKeys(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` -${key}=${options[key]}`;
      }
    }
  }
  return option.trim();
}

function getStringFromOptions(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` ${options[key]}`;
      }
    }
  }
  return option.trim();
}

module.exports.getStringFromOptionsWithKeys = getStringFromOptionsWithKeys;
module.exports.getStringFromOptions = getStringFromOptions;
