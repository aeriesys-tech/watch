const { Client, Device, ClientUser, DeviceType, User } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new client
const addClient = async (req, res) => {
  try {
    const {
      client_code,
      client_name,
      contact_person,
      mobile_no,
      email,
      address,
      logo,
      status,
    } = req.body;

    // Object to collect validation errors 
    const errors = {};

    // Check if the client code already exists in the database
    const existingClientCode = await Client.findOne({
      where: { client_code },
    });

    if (existingClientCode) {
      errors.client_code = "Client code already exists";
    }

    // Check if the email already exists in the database
    const existingEmail = await Client.findOne({
      where: { email },
    });

    if (existingEmail) {
      errors.email = "Email already exists";
    }

    // Check if the mobile number already exists in the database
    const existingMobile = await Client.findOne({
      where: { mobile_no },
    });

    if (existingMobile) {
      errors.mobile_no = "Mobile number already exists";
    }

    // If there are any errors, return them
    if (Object.keys(errors).length > 0) {
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create the new client if it does not exist
    const newClient = await Client.create({
      client_code,
      client_name,
      contact_person,
      mobile_no,
      email,
      address,
      logo,
      status,
    });

    return responseService.success(
      req,
      res,
      "Client created successfully",
      newClient,
      201
    );
  } catch (error) {
    console.error("Error in addClient function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Update an existing client
const updateClient = async (req, res) => {
  try {
    const {
      client_id,
      client_code,
      client_name,
      contact_person,
      mobile_no,
      email,
      address,
      logo,
      status,
    } = req.body;

    // Check if the new client code already exists in the database
    const existingClient = await Client.findOne({
      where: { client_code },
    });
    if (existingClient && existingClient.client_id !== client_id) {
      const errors = { client_code: "Client code already exists" };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Update the client
    await Client.update(
      {
        client_code,
        client_name,
        contact_person,
        mobile_no,
        email,
        address,
        logo,
        status,
      },
      { where: { client_id } }
    );

    // Fetch the updated client
    const updatedClient = await Client.findByPk(client_id);
    return responseService.success(
      req,
      res,
      "Client updated successfully",
      updatedClient
    );
  } catch (error) {
    console.error("Error in updateClient function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Delete or restore a client
const deleteClient = async (req, res) => {
  try {
    const { client_id } = req.body;

    // Fetch the client, including those marked as deleted (paranoid: false)
    const client = await Client.findByPk(client_id, {
      paranoid: false,
    });
    if (!client) {
      return responseService.error(req, res, "Client not found", {}, 404);
    }

    if (client.deleted_at) {
      // Restore the client
      await client.restore(); // Restore the record
      client.status = true; // Update status after restoring
      await client.save(); // Save the changes
      return responseService.success(req, res, "Client restored successfully");
    } else {
      // Soft delete the client
      client.status = false; // Update status before deleting
      await client.save(); // Save the status change
      await client.destroy(); // Soft delete the record
      return responseService.success(
        req,
        res,
        "Client soft deleted successfully"
      );
    }
  } catch (error) {
    console.error("Error in deleteClient function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

const viewClient = async (req, res) => {
  try {
    const { client_id } = req.body;

    // Fetch client details along with associated devices, device types, and users
    const client = await Client.findByPk(client_id, {
      include: [
        {
          model: Device,
          as: "devices",
          include: [
            {
              model: DeviceType,
              as: "deviceType", // Alias should match the association in Device model
            },
          ],
        },
        {
          model: ClientUser,
          as: "clientUsers",
          include: [
            {
              model: User,
              as: "user", // Alias should match the association in ClientUser model
            },
          ],
        },
      ],
    });

    if (!client) {
      return responseService.error(req, res, "Client not found", {}, 404);
    }

    // Convert Sequelize instance to plain object
    const clientData = client.toJSON();

    // Format the response to include user names and device types
    const formattedClient = {
      ...clientData,
      clientUsers: clientData.clientUsers.map((clientUser) => ({
        ...clientUser,
        userName: clientUser.user ? clientUser.user.name : null, // Ensure correct field name
        user: undefined, // Remove user property to avoid circular reference
      })),
      devices: clientData.devices.map((device) => ({
        ...device,
        deviceTypeName: device.deviceType
          ? device.deviceType.device_type
          : null, // Ensure correct field name
        deviceType: undefined, // Remove deviceType property to avoid circular reference
      })),
    };

    return responseService.success(
      req,
      res,
      "Client retrieved successfully",
      formattedClient
    );
  } catch (error) {
    console.error("Error in viewClient function:", error); // Log the full error
    return responseService.error(
      req,
      res,
      "Internal Server Error",
      { error: error.message },
      500
    );
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ paranoid: false });
    return responseService.success(
      req,
      res,
      "Clients retrieved successfully",
      clients
    );
  } catch (error) {
    console.error("Error in getClients function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Paginate clients
const paginateClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      order = "asc",
      search = "",
      status,
    } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object dynamically
    const sort = [[sortBy, order.toUpperCase()]];

    // Implement search and status filter
    const where = {
      ...(search && {
        [Op.or]: [
          { client_code: { [Op.like]: `%${search}%` } },
          { client_name: { [Op.like]: `%${search}%` } },
          { contact_person: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { mobile_no: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const clients = await Client.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      paranoid: false,
    });

    const responseData = {
      data: clients.rows,
      totalPages: Math.ceil(clients.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: clients.count,
    };

    return responseService.success(
      req,
      res,
      "Clients fetched successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateClients function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addClient,
  updateClient,
  deleteClient,
  viewClient,
  getClients,
  paginateClients,
};
