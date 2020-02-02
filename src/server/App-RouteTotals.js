const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.TOTAL_CLAIM_WEBSOCKET_PORT || 4001;
const index = require("../routes/index");
const appRouteTotals = express();
require('dotenv').config();
const totalClaimStitchWebhook = process.env.TOTAL_CLAIM_WEBHOOK;

appRouteTotals.use(index);

const server = http.createServer(appRouteTotals);

const io = socketIo(server); // < Interesting!

const getApiAndEmitRouteTotals = async socket => {
    try {

        const res = await axios.get(
            totalClaimStitchWebhook
        );
        console.log("Received response for Route Totals: " + JSON.stringify(res.data));
        socket.emit("FromRouteTotalsAPI", JSON.stringify(res.data)); // Emitting a new message. It will be consumed by the client
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

let interval;

io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmitRouteTotals(socket), 2000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`RouteTotals Server listening on port ${port}`));
