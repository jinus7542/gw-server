"use strict";

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed, 
// $disconnect is a best-effort event. 
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.
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
      Key: {
        connectionId: event.requestContext.connectionId
      }
    };
    await ddb.delete(params).promise();
    response.body = "Disconnected.";
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
