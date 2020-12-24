"use strict";

async function hello(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  return JSON.stringify({
    date: new Date(),
  });
}

module.exports = {
  hello,
};
