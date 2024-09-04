const { UserCheckParameter, DeviceUser, } = require("../models");
const responseService = require("../services/responseService");

const addUserCheckParameter = async (req, res) => {
    try {
        const { device_user_id, check_parameter_ids } = req.body;

        // Validate the check_parameter_ids field
        if (!Array.isArray(check_parameter_ids) || check_parameter_ids.length === 0) {
            const errors = { check_parameter_ids: "Must provide an array of check parameter IDs" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Check if the device_user_id exists
        const userExists = await DeviceUser.findOne({ where: { device_user_id } });
        if (!userExists) {
            const errors = { device_user_id: "Device user ID does not exist" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Find existing entries
        const existingEntries = await UserCheckParameter.findAll({
            where: { device_user_id, check_parameter_id: check_parameter_ids }
        });
        const existingCheckParameterIds = existingEntries.map(entry => entry.check_parameter_id);

        // Filter out the check parameter IDs that already exist
        const newCheckParameterIds = check_parameter_ids.filter(id => !existingCheckParameterIds.includes(id));

        // Create new UserCheckParameter entries
        const newEntries = await Promise.all(newCheckParameterIds.map(id =>
            UserCheckParameter.create({ device_user_id, check_parameter_id: id })
        ));

        return responseService.success(req, res, "User Check Parameters created successfully", newEntries, 201);
    } catch (error) {
        console.error("Error in addUserCheckParameter function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};







const updateUserCheckParameter = async (req, res) => {
    try {
        const { user_check_parameter_id, device_user_id, check_parameter_ids } = req.body;

        // Ensure check_parameter_ids is an array
        if (!Array.isArray(check_parameter_ids) || check_parameter_ids.some(id => !Number.isInteger(id))) {
            const errors = { check_parameter_ids: "Check Parameter IDs must be an array of integers" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Check if any new check_parameter_id already exists for the user
        const existingEntries = await UserCheckParameter.findAll({
            where: {
                device_user_id,
                check_parameter_id: check_parameter_ids,
                user_check_parameter_id: { [Op.ne]: user_check_parameter_id }
            }
        });

        if (existingEntries.length > 0) {
            const errors = { parameter: "One or more check parameters already exist for the user" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Update the UserCheckParameter
        await UserCheckParameter.update(
            { check_parameter_id: check_parameter_ids },
            { where: { user_check_parameter_id } }
        );

        // Fetch the updated record
        const updatedUserCheckParameter = await UserCheckParameter.findByPk(user_check_parameter_id);
        return responseService.success(req, res, "User Check Parameter updated successfully", updatedUserCheckParameter);
    } catch (error) {
        console.error("Error in updateUserCheckParameter function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};



const deleteUserCheckParameter = async (req, res) => {
    try {
        const { user_check_parameter_id } = req.body;

        // Fetch the entry, including those marked as deleted (paranoid: false)
        const entry = await UserCheckParameter.findByPk(user_check_parameter_id, { paranoid: false });
        if (!entry) {
            return responseService.error(req, res, "User Check Parameter not found", {}, 404);
        }

        if (entry.deleted_at) {
            // Restore the entry
            await entry.restore();
            return responseService.success(req, res, "User Check Parameter restored successfully");
        } else {
            // Soft delete the entry
            await entry.destroy();
            return responseService.success(req, res, "User Check Parameter soft deleted successfully");
        }
    } catch (error) {
        console.error("Error in deleteUserCheckParameter function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};


const viewUserCheckParameter = async (req, res) => {
    try {
        const { user_check_parameter_id } = req.body;
        const entry = await UserCheckParameter.findByPk(user_check_parameter_id);
        if (!entry) {
            return responseService.error(req, res, "User Check Parameter not found", {}, 404);
        }
        return responseService.success(req, res, "User Check Parameter retrieved successfully", entry);
    } catch (error) {
        console.error("Error in viewUserCheckParameter function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};


const getUserCheckParameters = async (req, res) => {
    try {
        const entries = await UserCheckParameter.findAll({ paranoid: false });
        return responseService.success(req, res, "User Check Parameters retrieved successfully", entries);
    } catch (error) {
        console.error("Error in getUserCheckParameters function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};


const paginateUserCheckParameters = async (req, res) => {
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
        const sort = [[sortBy, order.toUpperCase()]];

        // Implement search and status filter
        const where = {
            ...(search && {
                [Op.or]: [
                    { '$deviceUser.name$': { [Op.like]: `%${search}%` } }, // Assuming deviceUser has a 'name' field
                    { '$checkParameter.name$': { [Op.like]: `%${search}%` } }, // Assuming checkParameter has a 'name' field
                ],
            }),
            ...(status && { status: status === "active" ? true : false }),
        };

        const entries = await UserCheckParameter.findAndCountAll({
            where,
            include: [
                { model: DeviceUser, as: 'deviceUser' },
                { model: CheckParameter, as: 'checkParameter' }
            ],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: sort,
            paranoid: false,
        });

        const responseData = {
            data: entries.rows,
            totalPages: Math.ceil(entries.count / limit),
            currentPage: parseInt(page, 10),
            totalItems: entries.count,
        };

        return responseService.success(req, res, "User Check Parameters fetched successfully", responseData);
    } catch (error) {
        console.error("Error in paginateUserCheckParameters function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};


module.exports = {
    addUserCheckParameter,

    updateUserCheckParameter,
    deleteUserCheckParameter,
    viewUserCheckParameter,
    getUserCheckParameters,
    paginateUserCheckParameters,
};
