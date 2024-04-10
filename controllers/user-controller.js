import User from "../models/user";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import UserVerification from "../models/UserVerification";

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json({ users });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6 digit OTP
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.emailusername,
      pass: process.env.emailpassword, // TO DO ******
    },
  });

  // Email content

  const mailOptions = {
    from: "Elysium",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for registration is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const signup = async (req, res, next) => {
  const { name, email, password, role, otp } = req.body;

  // Name
  if (!name) {
    return es.status(400).json({ message: "Name is required" });
  }

  // Email Validation
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password Validation
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long",
    });
  }
  if (!otp) {
    return res
      .status(400)
      .json({ message: "OTP is required for email verification" });
  }

  console.log("Email entered during signup:", email);

  // check if OTP is valid
  const userOTP = await UserVerification.findOne({ email }, { otp: 1 }).lean();
  console.log("User OTP from database****:", userOTP);
  if (!userOTP || userOTP.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User Alreasy exists,Please login instead." });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    projects: [],
  });

  // Save the user to the database
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  // Check if user is already authenticated
  if (req.session.user) {
    return res.status(200).json({ message: "User is already logged in" });
  }

  const { email, password } = req.body;

  // Email Validation
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password Validation
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Validate the password length
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  // Implement password complexity requirements (e.g., requiring a mix of uppercase and lowercase letters, numbers, and special characters)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long",
    });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Couldn't find user by this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // Upon successful login, set the session user to the authenticated user
  req.session.user = existingUser;

  return res
    .status(200)
    .json({ message: "Login Successfully", user: existingUser });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Generate OTP
  const otp = generateOTP();

  try {
    // Check if the email already exists in the UserVerification collection
    let existingUser = await UserVerification.findOne({ email });

    if (existingUser) {
      // If the email exists, update the existing document with the new OTP
      await UserVerification.updateOne({ email }, { $set: { otp } });
    } else {
      // If the email doesn't exist, create a new document
      await UserVerification.create({ email, otp });
    }

    // Send OTP email
    await sendOTP(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent to email for verification" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};
