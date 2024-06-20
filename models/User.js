const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  checked: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  }
});

const PlatformSettingsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  options: [NotificationSchema]
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Unassigned',
  },
  department: {
    type: String,
    default: 'Unassigned',
  },
  bio: {
    type: String,
    default: 'Hello everyone! I am glad to be here',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: null,
  },
  picture: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },
  otp: {
    type: String,
    default: null,
  },
  otp_expiry: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  platformSettingsData: [PlatformSettingsSchema]
}, { timestamps: true });

// Pre-save hook to ensure default values for platformSettingsData
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.platformSettingsData.length === 0) {
      this.platformSettingsData.push(
        {
          title: "account",
          options: [
            {
              checked: true,
              label: "Notify me when someone send me a DM",
            }
          ]
        },
        {
          title: "company",
          options: [
            {
              checked: true,
              label: "New project added",
            },
            {
              checked: false,
              label: "New contact message",
            }
          ]
        }
      );
    }
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User
