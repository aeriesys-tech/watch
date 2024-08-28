const { User, Role, RoleAbility, Ability, UserToken } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
const responseService = require("../services/responseService");
const { Op } = require("sequelize");

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find the user by email
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Role,
//           include: [
//             {
//               model: RoleAbility,
//               as: "roleAbilities",
//               include: [
//                 {
//                   model: Ability,
//                   as: "ability",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!user) {
//       return responseService.error(req, res, "Email not found", { email: "Invalid email or email not found" }, 400);
//     }

//     // Compare the provided password with the stored hashed password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return responseService.error(req, res, "Password is incorrect", { password: "Invalid password" }, 400);
//     }

//     await UserToken.destroy({ where: { user_id: user.user_id } });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.user_id, role: user.role_id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.TOKEN_EXPIRY }
//     );

//     // Calculate token expiration date
//     const expireAt = new Date();
//     expireAt.setHours(expireAt.getHours() + parseInt(process.env.TOKEN_EXPIRY)); // Token expiry in hours

//     // Save the token to the UserToken table
//     await UserToken.create({
//       user_id: user.user_id,
//       token: token,
//       expire_at: expireAt,
//     });

//     // Extract user's abilities if Role and roleAbilities are not null
//     const abilities =
//       user.Role && user.Role.roleAbilities
//         ? user.Role.roleAbilities.map(
//           (roleAbility) => roleAbility.ability && roleAbility.ability.ability
//         )
//         : [];

//     // Construct user object with only required fields
//     const userWithoutPassword = {
//       user_id: user.user_id,
//       name: user.name,
//       email: user.email,
//       username: user.username,
//       mobile_no: user.mobile_no,
//       role_id: user.role_id,
//       address: user.address,
//       avatar: user.avatar,
//       status: user.status,
//       created_at: user.created_at,
//       updated_at: user.updated_at,
//       deleted_at: user.deleted_at,
//       abilities,
//     };

//     // Respond with token and user object
//     return responseService.success(req, res, "Login successful", {
//       token,
//       user: userWithoutPassword,
//     });
//   } catch (error) {
//     console.error("Error in login function:", error.message);
//     return responseService.error(req, res, "Internal server error", null, 500);
//   }
// };

// Update Profile function

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          include: [
            {
              model: RoleAbility,
              as: "roleAbilities",
              include: [
                {
                  model: Ability,
                  as: "ability",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return responseService.error(
        req,
        res,
        "Email not found",
        { email: "Invalid email or email not found" },
        400
      );
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return responseService.error(
        req,
        res,
        "Password is incorrect",
        { password: "Invalid password" },
        400
      );
    }

    await UserToken.destroy({ where: { user_id: user.user_id } });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    // Calculate token expiration date
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + parseInt(process.env.TOKEN_EXPIRY)); // Token expiry in hours

    // Save the token to the UserToken table
    await UserToken.create({
      user_id: user.user_id,
      token: token,
      expire_at: expireAt,
    });

    // Extract user's abilities if Role and roleAbilities are not null
    const abilities =
      user.Role && user.Role.roleAbilities
        ? user.Role.roleAbilities.map(
            (roleAbility) => roleAbility.ability && roleAbility.ability.ability
          )
        : [];

    // Construct user object with only required fields
    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      username: user.username,
      mobile_no: user.mobile_no,
      role_id: user.role_id,
      role: user.Role ? user.Role.role : null, // Add role field here
      address: user.address,
      avatar: user.avatar,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
      abilities,
    };

    // Respond with token and user object
    return responseService.success(req, res, "Login successful", {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in login function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, username, mobile_no, address } = req.body;
  const avatar = req.file ? req.file.filename : null;

  try {
    // Check if the username or mobile number already exists in the database and belongs to a different user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { mobile_no }],
        user_id: { [Op.ne]: userId },
      },
    });

    if (existingUser) {
      const errors = {};
      if (existingUser.username === username) {
        errors.username = "User with the same username already exists";
      }
      if (existingUser.mobile_no === mobile_no) {
        errors.mobile_no = "User with the same mobile number already exists";
      }
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Update user details in the database
    const updateData = { name, username, mobile_no, address };
    if (avatar) {
      updateData.avatar = avatar;
    }

    await User.update(updateData, { where: { user_id: userId } });

    // Retrieve updated user details, explicitly excluding the password and duplicate timestamp fields
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "created_at", "updated_at", "deleted_at"],
      },
    });

    return responseService.success(
      req,
      res,
      "Profile updated successfully",
      user
    );
  } catch (error) {
    console.error("Error in updateProfile function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Update Password function
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return responseService.error(
      req,
      res,
      "New password and confirm password do not match",
      {},
      400
    );
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    // Check if the old password is valid
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return responseService.error(req, res, "Invalid old password", {}, 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.update(
      { password: hashedPassword },
      { where: { user_id: userId } }
    );

    return responseService.success(req, res, "Password updated successfully");
  } catch (error) {
    console.error("Error in updatePassword function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Forgot Password function
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return responseService.error(
        req,
        res,
        "User not found",
        { email: "User not found" },
        404
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const expireAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    await UserToken.create({
      user_id: user.user_id,
      token: otp,
      expire_at: expireAt,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return responseService.error(
          req,
          res,
          "Failed to send email",
          error,
          500
        );
      }
      return responseService.success(req, res, "Reset password email sent");
    });
  } catch (error) {
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Reset Password function
const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return responseService.error(
      req,
      res,
      "Passwords do not match",
      { confirmPassword: "Passwords do not match" },
      400
    );
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return responseService.error(
        req,
        res,
        "User not found",
        { email: "User not found" },
        404
      );
    }

    const userToken = await UserToken.findOne({
      where: {
        user_id: user.user_id,
        token: otp,
        expire_at: { [Op.gt]: new Date() }, // Ensure OTP is not expired
      },
    });

    if (!userToken) {
      return responseService.error(
        req,
        res,
        "Invalid OTP",
        { otp: "Invalid or expired OTP" },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    // Optionally, delete the used token
    await UserToken.destroy({
      where: { user_id: user.user_id, token: otp },
    });

    return responseService.success(req, res, "Password reset successfully");
  } catch (error) {
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Me function
const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return responseService.error(req, res, "User not found", {}, 404);
    }

    return responseService.success(
      req,
      res,
      "User retrieved successfully",
      user
    );
  } catch (error) {
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Logout function
const logout = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return responseService.error(
      req,
      res,
      "Access denied. No token provided.",
      {},
      401
    );
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Delete the token from the UserToken table
    await UserToken.destroy({
      where: {
        token: token,
        user_id: decoded.id,
      },
    });

    return responseService.success(req, res, "Logged out successfully");
  } catch (error) {
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

module.exports = {
  login,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  me,
  logout,
};
