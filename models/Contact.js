import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true
  },
}, { timestamps: true })

const Contact = mongoose.model("Contact", ContactSchema)

export default Contact
