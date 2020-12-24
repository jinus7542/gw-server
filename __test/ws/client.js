const aws = require("aws-sdk");
const W3CWebSocket = require("websocket").w3cwebsocket;
const {
  Signer
} = require("aws-amplify");

let client = null;
exports.client = async () => {
  if (client) {
    return client;
  }

  aws.config.credentials = new aws.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:cebe9ee6-4131-4cd3-88c4-45fec8658b56",
  }, {
    region: "us-east-1",
  });
  await aws.config.credentials.getPromise();
  //console.log(aws.config.credentials);

  const accessInfo = {
    access_key: aws.config.credentials.accessKeyId,
    secret_key: aws.config.credentials.secretAccessKey,
    session_token: aws.config.credentials.sessionToken,
  };
  const url = "wss://7pku1n3dk2.execute-api.us-east-1.amazonaws.com/stage";
  const signedUrl = Signer.signUrl(url, accessInfo);
  //console.log(signedUrl);
  client = new W3CWebSocket(signedUrl);
  client.onerror = function() {
    console.log("[client]: Connection Error");
  };
  client.onopen = function() {
    console.log("[client]: WebSocket Client Connected");
  };
  client.onclose = function() {
    console.log("[client]: Client Closed");
  };
  client.onmessage = function(e) {
    if ("string" == typeof e.data) {
      console.log(`Received: ${e.data}`);
    }
  };
  return client;
};
