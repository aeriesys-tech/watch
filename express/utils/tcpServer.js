const net = require("net");

const activeServers = new Map(); // To keep track of active servers

function createTCPServer(port) {
    if (activeServers.has(port)) {
        console.log(`TCP server already running on port ${port}`);
        return;
    }

    const server = net.createServer((socket) => {
        console.log(`Watch connected on port ${port}`);

        socket.on("data", (data) => {
            const receivedData = data.toString();
            console.log(`Received data on port ${port}:`, receivedData);

            let response = "";

            if (receivedData.includes("AP00")) {
                response = "IWBP00202406271152238#";
            } else if (receivedData.includes("AP01")) {
                response = "IWBP01#";
            } else if (receivedData.includes("AP02")) {
                response = "IWBP02#";
            } else if (receivedData.includes("AP03")) {
                response = "IWBP03#";
            } else if (receivedData.includes("AP07")) {
                response = "IWBP0720140818064408611#";
            } else if (receivedData.includes("AP10")) {
                response = "IWBP10#";
                // Future: Implement database updates or other actions
            } else if (receivedData.includes("AP49")) {
                response = "IWBP49#";
            } else if (receivedData.includes("APHT")) {
                response = "IWBPHT#";
            } else if (receivedData.includes("APHP")) {
                response = "IWBPHP#";
                // Future: Implement health data updates
            } else if (receivedData.includes("AP50")) {
                response = "IWBP50#";
            } else if (receivedData.includes("AP97")) {
                response = "IWBP97#";
            } else if (receivedData.includes("APWT")) {
                response = "IWBPWT#";
            } else {
                response = "IWBP00,20240504125223,8#";
            }

            socket.write(response, () => {
                console.log(`Response sent to client on port ${port}: ${response}`);
            });
        });

        socket.on("error", (err) => {
            console.error(`Socket error on port ${port}:`, err);
        });

        socket.on("end", () => {
            console.log(`Watch disconnected on port ${port}`);
        });
    });

    server.listen(port, () => {
        console.log(`TCP server listening on port ${port}`);
    });

    activeServers.set(port, server);
}

function closeTCPServer(port) {
    const server = activeServers.get(port);
    if (server) {
        server.close(() => {
            console.log(`TCP server on port ${port} closed`);
        });
        activeServers.delete(port);
    } else {
        console.log(`No TCP server found on port ${port}`);
    }
}

module.exports = { createTCPServer, closeTCPServer };
