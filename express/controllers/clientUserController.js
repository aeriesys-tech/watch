const { ClientUser, Client, User } = require("../models");
const responseService = require("../services/responseService"); // Assuming you have a response service for handling responses
const { Op } = require("sequelize");

// Controller to add a new ClientUser
const addClientUser = async (req, res) => {
  try {
    const { client_id, user_id } = req.body;

    // Check if the client-user combination already exists
    const existingClientUser = await ClientUser.findOne({
      where: { client_id, user_id },
    });
    if (existingClientUser) {
      const errors = {
        combination: "Client and User combination already exists",
      };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create new ClientUser
    const newClientUser = await ClientUser.create({ client_id, user_id });
    return responseService.success(
      req,
      res,
      "ClientUser created successfully",
      newClientUser,
      201
    );
  } catch (error) {
    console.error("Error in addClientUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to update an existing ClientUser
const updateClientUser = async (req, res) => {
  try {
    const { client_user_id, client_id, user_id } = req.body;

    // Check if the ClientUser exists
    const clientUser = await ClientUser.findByPk(client_user_id);
    if (!clientUser) {
      return responseService.error(req, res, "ClientUser not found", {}, 404);
    }

    // Update the ClientUser
    clientUser.client_id = client_id || clientUser.client_id;
    clientUser.user_id = user_id || clientUser.user_id;
    await clientUser.save();

    return responseService.success(
      req,
      res,
      "ClientUser updated successfully",
      clientUser,
      200
    );
  } catch (error) {
    console.error("Error in updateClientUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to delete a ClientUser (hard delete)
const deleteClientUser = async (req, res) => {
  try {
    const { client_user_id } = req.body;

    // Check if the ClientUser exists
    const clientUser = await ClientUser.findByPk(client_user_id);
    if (!clientUser) {
      return responseService.error(req, res, "ClientUser not found", {}, 404);
    }

    // Hard delete the ClientUser
    await clientUser.destroy();
    return responseService.success(
      req,
      res,
      "ClientUser deleted successfully",
      {},
      200
    );
  } catch (error) {
    console.error("Error in deleteClientUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to view a specific ClientUser by ID
const viewClientUser = async (req, res) => {
  try {
    const { client_user_id } = req.body;

    // Fetch the ClientUser with associated Client and User data
    const clientUser = await ClientUser.findByPk(client_user_id, {
      include: [
        { model: Client, as: "client" },
        { model: User, as: "user" },
      ],
    });

    if (!clientUser) {
      return responseService.error(req, res, "ClientUser not found", {}, 404);
    }

    return responseService.success(
      req,
      res,
      "ClientUser fetched successfully",
      clientUser,
      200
    );
  } catch (error) {
    console.error("Error in viewClientUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to get all ClientUsers
const getClientUsers = async (req, res) => {
  try {
    // Fetch all ClientUsers with associated Client and User data
    const clientUsers = await ClientUser.findAll({
      include: [
        { model: Client, as: "client" },
        { model: User, as: "user" },
      ],
    });

    return responseService.success(
      req,
      res,
      "ClientUsers fetched successfully",
      clientUsers,
      200
    );
  } catch (error) {
    console.error("Error in getClientUsers function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to paginate ClientUsers
const paginateClientUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      order = "asc",
      search = "",
      status,
      client_id, // Adding client_id from query parameters
    } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object dynamically
    let sort;
    if (sortBy === "user") {
      // Sorting by associated User's name
      sort = [[{ model: User, as: "user" }, "name", order.toUpperCase()]];
    } else {
      // Default sorting
      sort = [[sortBy, order.toUpperCase()]];
    }

    // Implement search, status filter, and client_id filter
    const where = {
      ...(search && {
        [Op.or]: [
          { "$client.client_code$": { [Op.like]: `%${search}%` } },
          { "$client.client_name$": { [Op.like]: `%${search}%` } },
          { "$user.name$": { [Op.like]: `%${search}%` } },
          { "$user.email$": { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
      ...(client_id && { client_id }), // Adding client_id filter
    };

    console.log("Constructed where clause:", where); // Debugging line

    // Fetch paginated ClientUsers with associated Client and User data
    const { rows: clientUsers, count } = await ClientUser.findAndCountAll({
      where,
      include: [
        { model: Client, as: "client" },
        { model: User, as: "user" },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      clientUsers,
      totalPages,
      currentPage: parseInt(page, 10),
      totalItems: count,
    };

    return responseService.success(
      req,
      res,
      "ClientUsers paginated successfully",
      responseData,
      200
    );
  } catch (error) {
    console.error("Error in paginateClientUsers function:", error); // Improved error logging
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addClientUser,
  updateClientUser,
  deleteClientUser,
  viewClientUser,
  getClientUsers,
  paginateClientUsers,
};
