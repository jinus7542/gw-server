"use strict";

const assert = require("../assert");

async function signup(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  assert.throw(
    0 <= args.id,
    "invalid parameters",
    "INVALID_PARAMETERS",
    { id: args.id },
  );

  return {
    id: args.id,
    name: args.name,
  };
}

module.exports = {
  signup,
};
