const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const User = require("../models/User");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Elysium Group Ltd",
    to: email,
    subject: "One Time Password (OTP) verification for Elysium Group Ltd account",
    html: `<h1>Your OTP is ${otp}</h1>
      <p>Please do not share this OTP with anyone</p>
      <p>This OTP will expire in 15 minutes</p>
      <p>If you did not request this OTP, please ignore this email</p>
      <p>Thank you for using Elysium Group Ltd.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

exports.getAllUsers = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json(users);
};

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long",
    });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists, please login instead!" });
  }

  const otp = generateOTP();
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role, otp, otp_expiry: Date.now() + 15 * 60 * 1000 });
    await user.save();
    await sendOTP(email, otp);
    return res.status(200).json({ user: { name, email, role }, isSigningUp: true });
  } catch (err) {
    console.error("Error creating user: OTP not sent", err);
    return res.status(500).json({ message: "Error creating user: OTP not sent" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long",
    });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist!" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password!" });
  }

  const otp = generateOTP();
  try {
    await User.findOneAndUpdate({ email }, { otp, otp_expiry: Date.now() + 15 * 60 * 1000 });
    await sendOTP(email, otp);

    const user = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    return res.status(200).json({ user, isLoggingIn: true, message: "Logged in successfully, next is to verify OTP!" });
  } catch (err) {
    console.error("Error logging in: OTP not sent", err);
    return res.status(500).json({ message: "Error logging in: OTP not sent" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.verifyOTP = async (req, res) => {
  const { isLoggingIn, isSigningUp, user, userOTP } = req.body;

  if (!isLoggingIn && !isSigningUp) {
    return res.status(400).json({ message: "Invalid request" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: user.email }).select('-password')
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (isLoggingIn) {
    if (userOTP !== existingUser.otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    if (Date.now() > existingUser.otp_expiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    req.session.user = existingUser

    return res.status(200).json({ user: req.session.user, message: "Logged in successfully and OTP is verified!" });
  }

  if (isSigningUp) {
    if (userOTP !== existingUser.otp) {
      await User.findOneAndDelete({ email: user.email });
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > existingUser.otp_expiry) {
      await User.findOneAndDelete({ email: user.email });
      return res.status(400).json({ message: "OTP has expired" });
    }

    await User.findOneAndUpdate({ email: user.email }, { verified: true });

    return res.status(200).json({ user: existingUser, message: "Signed up successfully, please login!" });
  }
};

exports.loadUser = async (req, res) => {

  if (req.session.user) {
    return res.status(200).json({ user: req.session.user, message: "User loaded successfully" });
  } else {
    return res.status(400).json({ message: "You are not logged in." });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Name, email, and role are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    res.status(200).json({ user: updatedUser, message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.deleteUser = async (req, res) => {

  const userID = req.params.userID

  try {

    const result = await User.findByIdAndDelete(userID)

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}