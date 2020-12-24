"use strict";

const assert = require("../assert");

async function signin(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  assert.throw(
    0 <= args.id,
    "invalid arguments",
  );

  return {
    id: args.id,
    name: "jinus7542",
  };
}

async function signout(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  assert.throw(
    0 <= args.id,
    "invalid arguments",
    "INVALID_ARGUMENTS",
    { id: args.id },
  );

  return {
    id: args.id,
    name: "jinus7542",
  };
}

module.exports = {
  signin,
  signout,
};
