"use strict";

const assert = require("../assert");

async function signin(parent, args, ctx, info) {
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
    name: "jinus7542",
  };
}

async function signout(parent, args, ctx, info) {
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
    name: "jinus7542",
  };
}

async function friends(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  return [
    { id: 2222, name: "kangkang" },
    { id: 3333, name: "dokki" },
    { id: 4444, name: "hogu2" },
  ];
}

module.exports = {
  signin,
  signout,
  friends,
};
