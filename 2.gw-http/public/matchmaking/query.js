"use strict";

const aws = require("aws-sdk");
const gamelift = new aws.GameLift({
  region: process.env.AWS_REGION,
});

async function matchstatus(parent, args, ctx, info) {
  const event = ctx.event;
  const context = ctx.context;

  let responsedata;
  //Get the ticket from request querystring
  const ticketId = args.ticketId;
  //Params for the matchmaking status check
  const params = {
    TicketIds: [ticketId],
  };
  console.log(`Ticket id: ${ticketId}`);
  // Request matchmaking status
  const data = await gamelift.describeMatchmaking(params).promise();
  console.log(data);
  const matchTicket = data.TicketList[0];
  console.log(`Match status: ${matchTicket.Status}`);
  if ("COMPLETED" == matchTicket.Status) {
    responsedata = {
      IpAddress: matchTicket.GameSessionConnectionInfo.IpAddress,
      Port: matchTicket.GameSessionConnectionInfo.Port,
      PlayerSessionId:
        matchTicket.GameSessionConnectionInfo.MatchedPlayerSessions[0]
          .PlayerSessionId,
      DnsName: matchTicket.GameSessionConnectionInfo.DnsName,
    };
  } else {
    responsedata = {
      IpAddress: "",
      Port: 0,
      PlayerSessionId: "NotPlacedYet",
      DnsName: "",
    };
  }

  return responsedata;
}

module.exports = {
  matchstatus,
};
