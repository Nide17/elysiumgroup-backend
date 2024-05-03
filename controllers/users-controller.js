const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const User = require("../models/User");
const { cloudinary, uploadImagesToCloudinary } = require("../utils/cloudinary");

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Helper function to send OTP via email
const sendOTP = async (email, otp) => {

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true,

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
  } catch (error) {
    return error
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  }
  catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists, please login instead!" });
  }

  try {
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ name, email, password: hashedPassword, role, otp, otp_expiry: Date.now() + 15 * 60 * 1000 });
    await user.save();

    // await sendOTP(email, otp);
    console.log(email, otp)

    return res.status(200).json({ email, message: 'User is saved. Now verify the OTP' })
  } catch (err) {
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

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist!" });
  }

  if (!bcrypt.compareSync(password, existingUser.password)) {
    return res.status(400).json({ message: "Incorrect Password!" });
  }

  try {
    const otp = generateOTP();
    await User.findOneAndUpdate({ email }, { otp, otp_expiry: Date.now() + 15 * 60 * 1000 });
    // await sendOTP(email, otp);
    console.log(email, otp)

    return res.status(200).json({ email, message: 'Valid credentials. Now verify the OTP' })
  } catch (err) {
    return res.status(500).json({ message: "Error logging in: OTP not sent" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, userOTP } = req.body;

  if (!email || !userOTP) {
    return res.status(400).json({ message: "Email and OTP required!" });
  }

  try {
    const existingUser = await User.findOne({ email }).select('-password')

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (userOTP !== existingUser.otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > existingUser.otp_expiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (!existingUser.verified) {
      await User.findOneAndUpdate({ email }, { verified: true });
      return res.status(200).json({ message: "Successfully verified, login!" });
    }

    req.session.user = existingUser
    return res.status(200).json({ user: existingUser, message: "Successfully verified, welcome!" });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    const otp = generateOTP();
    await User.findOneAndUpdate({ email }, { otp, otp_expiry: Date.now() + 15 * 60 * 1000 });
    // await sendOTP(email, otp);
    console.log(email, otp)

    return res.status(200).json({ email, message: 'OTP to change password is sent to email' })
  } catch (err) {
    return res.status(500).json({ message: "Error sending OTP" });
  }
}

exports.resetPassword = async (req, res) => {
  const { email, userOTP, password } = req.body;

  if (!email || !userOTP || !password) {
    return res.status(400).json({ message: "Email, OTP, and password are required" });
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

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (userOTP !== existingUser.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (Date.now() > existingUser.otp_expiry) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate({ email }, { password: hashedPassword, otp: null, otp_expiry: null });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};


exports.loadUser = async (req, res) => {

  if (req.session.user) {
    return res.status(200).json({ user: req.session.user, message: "User loaded successfully" });
  } else {
    return res.status(400).json({ message: "You are not logged in." });
  }
};

exports.updateUser = async (req, res) => {

  const userID = req.params.userID;
  const { name, bio, phone } = req.body;

  try {
    const existingUser = await User.findById(userID);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      { name, bio, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    // update the user in the session
    req.session.user = updatedUser;
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

exports.updateProfilePicture = async (req, res) => {

  const userID = req.params.userID;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a profile picture" });
  }

  try {
    const existingUser = await User.findById(userID);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Delete existing profile picture from cloudinary
    if (existingUser.picture && existingUser.picture.public_id) {
      await cloudinary.uploader.destroy(existingUser.picture.public_id);
    }

    const uploadResults = await uploadImagesToCloudinary(req.file, 'ProfilePictures', existingUser.email);

    if (!uploadResults) {
      return res.status(500).json({ message: "Failed to upload profile picture" });
    }

    const successfulUploads = uploadResults && uploadResults.filter(result => result !== null);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      { picture: { public_id: successfulUploads[0].public_id, url: successfulUploads[0].url } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update profile picture" });
    }

    // update the user's image in the session
    req.session.user.picture = updatedUser.picture;
    res.status(200).json({ user: updatedUser, message: "Profile picture updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.updateUserPlatformSettings = async (req, res) => {
  const userID = req.params.userID;
  const { settingID, optionID, isChecked } = req.body;

  if (!settingID || !optionID || isChecked === undefined) {
    return res.status(400).json({ message: "Setting ID, option ID, and isChecked are required" });
  }

  try {
    const existingUser = await User.findById(userID);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const updatedSettings = existingUser.platformSettingsData.map(setting => {
      if (setting._id.toString() === settingID) {
        setting.options.map(option => {
          if (option._id.toString() === optionID) {
            option.checked = isChecked;
          }
          return option;
        });
      }
      return setting;
    });

    const updated = await User.findOneAndUpdate({ _id: userID }, { platformSettingsData: updatedSettings }, { new: true });

    if (!updated) {
      return res.status(500).json({ message: "Failed to update platform settings" });
    }

    // update the user's platform settings in the session
    req.session.user.platformSettingsData = updated.platformSettingsData;
    res.status(200).json({ user: updated, message: "Platform settings updated successfully" });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.deleteProfilePicture = async (req, res) => {

  const userID = req.params.userID;

  try {
    const existingUser = await User.findById(userID);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Delete profile picture from cloudinary
    await cloudinary.uploader.destroy(existingUser.picture.public_id);

    const updated = await User.findOneAndUpdate(
      { _id: userID },
      { picture: null },
      { new: true }
    );

    if (!updated) {
      return res.status(500).json({ message: "Failed to delete profile picture" });
    }

    res.status(200).json({ user: updated, message: "Profile picture deleted successfully" });
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}