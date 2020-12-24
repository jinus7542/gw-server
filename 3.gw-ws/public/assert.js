"use strict";

module.exports = {
  throw: function(condition, message) {
    if (false === condition) {
      throw new Error(message);
    }
  },
};
