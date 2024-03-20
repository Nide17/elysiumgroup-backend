import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  projects: [{ type: mongoose.Types.ObjectId, ref: "Project", required: true }],
});

export default mongoose.model("User", UserSchema);
