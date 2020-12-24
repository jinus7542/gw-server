"use strict";

const { ApolloServer } = require("apollo-server-lambda");
const schema = require("./schema");

const config = {
  schema,
  playground: {
    endpoint: `/${process.env.STAGE}/public`, // playground 의 기본 경로
  },
  context: ({ event, context }) => ({
    event,
    context,
  }),
};
if ("prod" === process.env.STAGE) {
  // 프로덕션에서는 playground 비활성화
  config.introspection = false;
  config.playground = false;
}

const server = new ApolloServer(config);

exports.handler = server.createHandler();
