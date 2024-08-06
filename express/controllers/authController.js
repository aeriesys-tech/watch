const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Login function
// const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find the user by email
//     const user = await db.User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({
//         message: "Email not found",
//         errors: { email: "Invalid email or email not found" },
//       });
//     }

//     // Compare the provided password with the stored hashed password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({
//         message: "Password is incorrect",
//         errors: { password: "Invalid password" },
//       });
//     }

//     await db.UserToken.destroy({
//       where: { user_id: user.user_id },
//     });

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
//     await db.UserToken.create({
//       user_id: user.user_id,
//       token: token,
//       expire_at: expireAt,
//     });

//     // Exclude password from user object
//     const { password: userPassword, ...userWithoutPassword } = user.dataValues;

//     // Respond with token and user object
//     res.json({ token, user: userWithoutPassword });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.Role,
          include: [
            {
              model: db.RoleAbility,
              as: "roleAbilities", // Use the alias defined in the Role model
              include: [
                {
                  model: db.Ability,
                  as: "ability", // Use the alias defined in the Ability model if needed
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        errors: { email: "Invalid email or email not found" },
      });
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Password is incorrect",
        errors: { password: "Invalid password" },
      });
    }

    await db.UserToken.destroy({
      where: { user_id: user.user_id },
    });

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
    await db.UserToken.create({
      user_id: user.user_id,
      token: token,
      expire_at: expireAt,
    });

    // Extract user's abilities
    const abilities = user.Role.roleAbilities.map(
      (roleAbility) => roleAbility.ability.ability
    );

    // Construct user object with only required fields
    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      username: user.username,
      mobile_no: user.mobile_no,
      role_id: user.role_id,
      address: user.address,
      avatar: user.avatar,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
      abilities, // Add abilities directly here
    };

    // Respond with token and user object
    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Profile function
const updateProfile = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated user object
  const { name, username, mobile_no, address, avatar } = req.body;

  try {
    // Update user details in the database
    await db.User.update(
      { name, username, mobile_no, address, avatar },
      { where: { user_id: userId } } // Use user_id instead of id
    );

    // Retrieve updated user details, explicitly excluding the password and duplicate timestamp fields
    const user = await db.User.findByPk(userId, {
      attributes: {
        exclude: ["password", "created_at", "updated_at", "deleted_at"],
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const userId = req.user.id; // Extract user ID from the authenticated user object
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate the new password and confirm password
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  try {
    // Find the user by ID
    const user = await db.User.findByPk(userId);

    // Check if the old password is valid
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.User.update(
      { password: hashedPassword },
      { where: { user_id: userId } } // Ensure you are using the correct user_id field
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password function
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errors: { email: "User not found" },
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const expireAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    await db.UserToken.create({
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
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Reset password email sent" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Reset Password function
const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
      errors: { confirmPassword: "Passwords do not match" },
    });
  }

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userToken = await db.UserToken.findOne({
      where: {
        user_id: user.user_id,
        token: otp,
        expire_at: { [db.Sequelize.Op.gt]: new Date() }, // Ensure OTP is not expired
      },
    });

    if (!userToken) {
      return res.status(400).json({
        message: "Invalid otp",
        errors: { otp: "Invalid or expired OTP" },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.User.update({ password: hashedPassword }, { where: { email } });

    // Optionally, delete the used token
    await db.UserToken.destroy({
      where: { user_id: user.user_id, token: otp },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Me function
const me = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Logout function
const logout = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Delete the token from the UserToken table
    await db.UserToken.destroy({
      where: {
        token: token,
        user_id: decoded.id,
      },
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
