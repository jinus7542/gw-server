"use strict";

const { ApolloError } = require("apollo-server-lambda");

module.exports = {
  throw: function (condition, message, code, extensions) {
    if (false === condition) {
      throw new ApolloError(message, code, extensions);
    }
  },
};
