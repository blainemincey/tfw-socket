const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.WEBSOCKET_PORT || 4002;

// load webhook value from env file
require('dotenv').config();
const avgClaimStitchWebhook = process.env.AVG_CLAIM_STITCH_WEBHOOK;
const totalClaimStitchWebhook = process.env.TOTAL_CLAIM_WEBHOOK;

const getApiAndEmitResult = async socket => {
    console.info(`Socket ${socket.id} has connected.`);

    socket.on('disconnect', () => {
        console.info(`Socket ${socket.id} has disconnected.`);
    });

    // call stitch webhooks
    try {
        console.info("================");
        const res = await axios.get(
            avgClaimStitchWebhook
        );
        console.info("Received response for Avg Claim: " + JSON.stringify(res.data));

        const totalClaimsRes = await axios.get(
            totalClaimStitchWebhook
        );
        console.info("Received response for Total Claims: " + JSON.stringify(totalClaimsRes.data));
        console.info("================");

        // Emitting a new message. It will be consumed by the client
        socket.emit("FromAvgClaimAPI", JSON.stringify(res.data));
        socket.emit("FromRouteTotalsAPI", JSON.stringify(totalClaimsRes.data));

    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

// start server
function startServer() {
    // create new express app
    const avgClaimApp = express();
    // create http server and wrap the express app
    const server = http.createServer(avgClaimApp);
    // bind socket.io to the newly created server
    const io = socketIo(server);

    // smoke test
    avgClaimApp.get("/", (req, res) => {
        res.send({ response: "I am alive" }).status(200);
    });

    // open socket for every new websocket connection
    let interval;
    io.on("connection", socket => {
        console.log("New client connected");
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getApiAndEmitResult(socket), 1000);
    });

    // listen from the server and not app...socket.io won't work otherwise
    server.listen(port, () => console.info(`Web Socket server listening on port ${port}`));
}

// fire it up
startServer();