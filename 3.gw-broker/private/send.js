"use strict";

async function main(event, context) {
  const response = {
    statusCode: 200
  }

  try {
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
