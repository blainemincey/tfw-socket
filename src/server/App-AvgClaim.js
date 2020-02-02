const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.AVG_CLAIM_WEBSOCKET_PORT || 4002;
const index = require("../routes/index");
const appAvgClaim = express();
require('dotenv').config();
const avgClaimStitchWebhook = process.env.AVG_CLAIM_STITCH_WEBHOOK;

appAvgClaim.use(index);

const server = http.createServer(appAvgClaim);

const io = socketIo(server);

const getApiAndEmitAvgClaim = async socket => {
    try {

        const res = await axios.get(
            avgClaimStitchWebhook
        );
        console.log("Received response for Avg Claim: " + JSON.stringify(res.data));
        socket.emit("FromAvgClaimAPI", JSON.stringify(res.data)); // Emitting a new message. It will be consumed by the client
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

let interval;

io.on("connection", socket => {
    console.log("New client connected-Avg Claim");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmitAvgClaim(socket), 2000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Avg Claim Server listening on port ${port}`));