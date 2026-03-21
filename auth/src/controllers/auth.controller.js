import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  // get data
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Some field's are missing, please enter",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length at-least 6 Character.",
      });
    }

    // check 'User' existent
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        // Without return — even after sending error response, the function keeps running below. In production this causes "headers already sent" error because you tried to send two responses.
        success: false,
        message: "User Already exists.",
      });
    }

    // hashing password
    const hashedPassword = await bcryptjs.hash(password, 10);

    //create user in DB
    //   const user = new User({ username, email, password: hashedPassword });
    //   await user.save();
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }); // more cleaner

    sendEmail({
      to: user.email,
      subject: "Welcome to MyApp! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          
          <div style="background-color: #4F46E5; padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome Aboard! 🎉</h1>
              <p style="color: #c7d2fe; margin-top: 10px;">We're glad to have you with us</p>
          </div>

          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hey ${user.username}, 👋</h2>
              <p style="color: #666; line-height: 1.8;">
                  Your account has been successfully created. 
                  You can now login and explore everything we have to offer.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #555;"><strong>Account Details:</strong></p>
                  <p style="margin: 5px 0; color: #666;">📧 Email: ${user.email}</p>
                  <p style="margin: 5px 0; color: #666;">👤 Username: ${user.username}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                  <a href="#" 
                    style="background-color: #4F46E5; color: white; padding: 14px 40px; 
                            border-radius: 6px; text-decoration: none; font-size: 16px;
                            font-weight: bold;">
                      Get Started →
                  </a>
              </div>

              <p style="color: #999; font-size: 13px; line-height: 1.6;">
                  If you didn't create this account, please ignore this email or 
                  contact support immediately.
              </p>
          </div>

          <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
              © 2024 MyApp. All rights reserved.
          </p>

        </div>
      `,
    });

    generateToken(user._id, res);

    const userResponse = await User.findById(user._id).select("-password");

    res.status(201).json({
      success: true,
      message: "User Successfully create",
      userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
  // catch - findOne(if DB not connected) || User.create(if DB connection drops mid-request) || Schema validation fails(if 'required fields' not full-fill)
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email or password field missing.",
      });
    }

    const userExisted = await User.findOne({ email });

    if (!userExisted) {
      return res.status(400).json({
        success: false,
        message: "User not exists, register and login again.",
      });
    }

    const correctPassword = await bcryptjs.compare(
      password,
      userExisted.password,
    );

    if (correctPassword) {
      generateToken(userExisted._id, res);
      return res.status(200).json({
        success: true,
        message: `${userExisted.username} login successfully.`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect, please enter correct password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: "User logout successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { register, login, logout };
