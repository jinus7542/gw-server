"use strict";

const {
  client
} = require("./client");

async function main() {
  try {
    await client();
  } catch (error) {
    console.log(error);
  }
}

main();
