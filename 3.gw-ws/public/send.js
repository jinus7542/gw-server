"use strict";

const aws = require("aws-sdk");
const ddb = new aws.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
const assert = require("./assert");

const {
  CONNECTIONS_TABLE
} = process.env;

async function main(event, context) {
  const response = {
    statusCode: 200
  }
  try {
    let params = {
      TableName: CONNECTIONS_TABLE,
      ProjectionExpression: "connectionId"
    }
    const connectionData = await ddb.scan(params).promise();
    params = {
      apiVersion: "2018-11-29",
      endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`
    }
    const managementApi = new aws.ApiGatewayManagementApi(params);
    const postData = JSON.parse(event.body).data;
    const postCalls = connectionData.Items.map(async ({
      connectionId
    }) => {
      try {
        const params = {
          ConnectionId: connectionId,
          Data: postData
        }
        await managementApi.postToConnection(params).promise();
      } catch (error) {
        assert.throw(410 == error.statusCode, error.message);
        console.log(`Found stale connection, deleting ${connectionId}`);
        const params = {
          TableName: CONNECTIONS_TABLE,
          Key: {
            connectionId
          }
        }
        await ddb.delete(params).promise();
      }
    });
    await Promise.all(postCalls);
    response.body = "Data sent.";
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
