const net = require("net");
const { Device, DeviceUser, UserCheckParameter, CheckParameter, Transaction } = require("../models"); // Adjust the path to your Sequelize models
const { where } = require("sequelize");

const activeServers = new Map(); // To keep track of active servers

async function fetchDeviceAndUserInfo(port) {
    try {
        // Assuming the port_no is mapped to the Device, fetch the device info
        const device = await Device.findOne({
            where: { port_no: port },
            include: [
                {
                    model: DeviceUser,
                    as: "deviceUsers",
                    include: [
                        {
                            model: UserCheckParameter,
                            as: "userCheckParameters",
                            where: { status: true }, // Only fetch active user check parameters

                            include: [{
                                model: CheckParameter,
                                as: "checkParameter",
                            }]
                        },
                    ],
                },
            ],
        });

        if (!device) {
            throw new Error(`Device not found for port ${port}`);
        }

        // Extract necessary info (assuming there's one active DeviceUser for the device)
        const deviceUser = device.deviceUsers[0];
        let checkParameter_ids = []
        let checkParameter_names = []
        for (let i = 0; i < deviceUser.userCheckParameters.length; i++) {
            checkParameter_ids.push(deviceUser.userCheckParameters[i].check_parameter_id)
            checkParameter_names.push(deviceUser?.userCheckParameters[i]?.checkParameter?.parameter_name)
        }
        return {
            device_id: device.device_id,
            client_id: device.client_id,
            device_user_id: deviceUser.device_user_id,
            user_id: deviceUser.user_id,
            check_parameter_id: checkParameter_ids,
            checkParameter_names: checkParameter_names,
        };
    } catch (error) {
        console.error("Error fetching device and user info:", error.message);
        return null;
    }
}

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

            // Move the async part into a separate function
            handleData(port, receivedData, socket);
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

// This function handles async operations for the received data
async function handleData(port, receivedData, socket) {
    const deviceAndUserInfo = await fetchDeviceAndUserInfo(port);
    console.log('deviceAndUserInfo:----', deviceAndUserInfo)

    if (!deviceAndUserInfo) {
        console.error("No device or user info found for this port.");
        return;
    }

    const { device_user_id, client_id, device_id, user_id, check_parameter_ids, checkParameter_names } = deviceAndUserInfo;
    let transactionData = {};
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

        const valueAfterV = receivedData.split('V' || 'A')[1];

        const parts = valueAfterV.split(/[N,E,#]/);
        const vValue = parts[0];
        const latitude = parts[1];
        const longitude = parts[2];
        const longitudeFirst4 = longitude.slice(0, 5);
        for (let i = 0; i < checkParameter_names.length; i++) {
            try {
                // Await the resolution of the promise
                let check_parameter = await CheckParameter.findOne({
                    where: { parameter_name: checkParameter_names[i] },
                });
                if (check_parameter.parameter_name === 'Panic Alert') {

                    const val = vValue + 'N' + latitude + 'E' + longitudeFirst4
                    transactionData = {
                        device_user_id,
                        client_id,
                        device_id,
                        user_id,
                        timestamp: new Date(),
                        check_parameter_id: check_parameter.check_parameter_id,
                        value: val,
                    };

                    try {
                        await Transaction.create(transactionData);
                        console.log("Transaction data saved:", transactionData);
                    } catch (error) {
                        console.error("Error saving transaction data:", error.message);
                    }
                }


            } catch (error) {
                console.error('Error fetching check parameter:', error.message);
            }
        }




        // Future: Implement database updates or other actions
    } else if (receivedData.includes("AP49")) {
        response = "IWBP49#";
    } else if (receivedData.includes("APHT")) {
        response = "IWBPHT#";
    } else if (receivedData.includes("APHP")) {
        response = "IWBPHP#";
        const parts = receivedData.split(",");
        for (let i = 0; i < checkParameter_names.length; i++) {
            try {
                // Await the resolution of the promise
                let check_parameter = await CheckParameter.findOne({
                    where: { parameter_name: checkParameter_names[i] },
                });
                let val;
                if (check_parameter.parameter_name === 'Heart Rate') {
                    val = parts[1];
                }
                if (check_parameter.parameter_name === 'Blood Pressure') {
                    val = parts[2] + ',' + parts[3];
                }
                if (check_parameter.parameter_name === 'SPO2') {
                    val = parts[4];
                }
                if (check_parameter.parameter_name === 'Blood Sugar') {
                    val = parts[5];
                }
                if (check_parameter.parameter_name === 'Body Temperature') {
                    val = parts[6];
                }
                if (val) {
                    transactionData = {
                        device_user_id,
                        client_id,
                        device_id,
                        user_id,
                        timestamp: new Date(),
                        check_parameter_id: check_parameter.check_parameter_id,
                        value: val,
                    };

                    try {
                        await Transaction.create(transactionData);
                        console.log("Transaction data saved:", transactionData);
                    } catch (error) {
                        console.error("Error saving transaction data:", error.message);
                    }
                }


            } catch (error) {
                console.error('Error fetching check parameter:', error.message);
            }
        }

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
