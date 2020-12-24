"use strict";

const fs = require("fs");
const path = require("path");
const { makeExecutableSchema } = require("graphql-tools");

let typeDefs = "";
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      "node_modules" != file &&
      true === fs.lstatSync(path.join(__dirname, file)).isDirectory()
    );
  })
  .forEach((file) => {
    const p = path.join(__dirname, file, "type.gql");
    if (true === fs.existsSync(p)) {
      typeDefs += fs.readFileSync(p);
    }
  });

const Query = {};
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      "node_modules" != file &&
      true === fs.lstatSync(path.join(__dirname, file)).isDirectory()
    );
  })
  .forEach((file) => {
    const p = path.join(__dirname, file, "query.js");
    if (true === fs.existsSync(p)) {
      const func = require(p);
      for (const [key, value] of Object.entries(func)) {
        Query[key] = value;
      }
    }
  });

const Mutation = {};
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      "node_modules" != file &&
      true === fs.lstatSync(path.join(__dirname, file)).isDirectory()
    );
  })
  .forEach((file) => {
    const p = path.join(__dirname, file, "mutation.js");
    if (true === fs.existsSync(p)) {
      const func = require(p);
      for (const [key, value] of Object.entries(func)) {
        Mutation[key] = value;
      }
    }
  });

const resolvers = {
  Query,
  Mutation,
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
