"use strict";

const aws = require("aws-sdk");
const ddb = new aws.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

const {
  CONNECTIONS_TABLE
} = process.env;

async function main(event, context) {
  const response = {
    statusCode: 200
  }

  try {
    const params = {
      TableName: CONNECTIONS_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId
      }
    };
    await ddb.put(params).promise();
    response.body = "Connected.";
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: error.message
    });
  } finally {
    return response;
  }
}

exports.handler = main;
