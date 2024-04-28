import mongoose from "mongoose"

const Schema = mongoose.Schema

const UserVerification = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
}, { timestamps: true })

export default mongoose.model("UserVerification", UserVerification)
