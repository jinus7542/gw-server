"use strict";

const aws = require("aws-sdk");
const gamelift = new aws.GameLift({
  region: process.env.AWS_REGION,
});
const assert = require("../assert");
const aliasID = "alias-da3723bf-e15c-4957-ad8b-19efc0c14bcd"; //NOTE: This could be set as environment variable

async function matchmaking(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  var playerSkill = null;
  const ddb = new aws.DynamoDB({
    apiVersion: "2012-08-10",
  });

  // 1. Get the player data from DynamoDB
  {
    const params = {
      TableName: `PlayerTable-${process.env.STAGE}`,
      Key: {
        ID: {
          S: event.requestContext.identity.cognitoIdentityId,
        },
      },
    };
    const data = await ddb.getItem(params).promise();
    if (data.Item != null && data.Item["Skill"] != null) {
      console.log(`Success ${data.Item["Skill"].N}`);
      playerSkill = parseInt(data.Item["Skill"].N);
    } else {
      console.log("Player skill Data doesn't exist yet, will create");
    }
  }

  // 2. Create player data if it doesn't exist
  if (null == playerSkill) {
    console.log("Adding player to database");
    playerSkill = 10; //The initial skill level
    const params = {
      TableName: `PlayerTable-${process.env.STAGE}`,
      Item: {
        ID: {
          S: event.requestContext.identity.cognitoIdentityId,
        },
        Skill: {
          N: playerSkill.toString(),
        },
      },
    };
    // Call DynamoDB to add the item to the table
    const data = await ddb.putItem(params).promise();
    console.log(`Success ${data}`);
  }

  // Use the player's Cognito Identity as the ID
  console.log(`Cognito ID: ${event.requestContext.identity.cognitoIdentityId}`);
  const playerId = event.requestContext.identity.cognitoIdentityId;

  // 3. Request matchmaking
  {
    //Params for the matchmaking request
    const params = {
      ConfigurationName: process.env.MMCONF,
      Players: [
        {
          PlayerAttributes: {
            skill: {
              N: playerSkill,
            },
          },
          PlayerId: playerId,
        },
      ],
    };
    const data = await gamelift.startMatchmaking(params).promise();
    console.log(data);

    return data.MatchmakingTicket;
  }
}

async function gamesession(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  let gameSessions;
  let selectedGameSession;

  // find any sessions that have available players
  {
    const params = {
      AliasId: aliasID,
      FilterExpression: "hasAvailablePlayerSessions=true",
    };
    const data = await gamelift.searchGameSessions(params).promise();
    gameSessions = data.GameSessions;
  }

  // if there are no sessions, then we need to create a game session
  {
    if (0 == gameSessions.length) {
      console.log("No game session detected, creating a new one");
      const params = {
        MaximumPlayerSessionCount: 2, // only two players allowed per game
        AliasId: aliasID,
      };
      const data = await gamelift.createGameSession(params).promise();
      selectedGameSession = data.GameSession;
    } else {
      // we grab the first session we find and join it
      selectedGameSession = gameSessions[0];
      console.log(
        `Game session exists, will join session ${selectedGameSession.GameSessionId}`,
      );
    }
  }

  // there isn't a logical way selectedGameSession could be null at this point
  // but it's worth checking for in case other logic is added
  {
    assert.throw(
      null != selectedGameSession,
      "Unable to find game session, check GameLift API status",
    );
    const params = {
      GameSessionId: selectedGameSession.GameSessionId,
      PlayerId: event.requestContext.identity.cognitoIdentityId,
    };
    // now we have a game session one way or the other, create a session for this player
    const data = await gamelift.createPlayerSession(params).promise();
    console.log(
      `Created player session ID: ${data.PlayerSession.PlayerSessionId}`,
    );

    return data.PlayerSession;
  }
}

module.exports = {
  matchmaking,
  gamesession,
};
