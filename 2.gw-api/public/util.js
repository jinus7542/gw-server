"use strict";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function ksort(obj) {
  const keys = Object.keys(obj).sort(),
    sorted = {};

  for (const i in keys) {
    sorted[keys[i]] = obj[keys[i]];
  }

  return sorted;
}

async function glob(pattern) {
  const g = require("glob");

  return new Promise((resolve, reject) => {
    g(pattern, function (error, result) {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

module.exports = {
  sleep,
  isNumber,
  ksort,
  glob,
};
