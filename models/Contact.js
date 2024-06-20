const mongoose = require("mongoose")

const ContactSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactMessage: {
    type: String,
    required: true
  },
}, { timestamps: true })

const Contact = mongoose.model("Contact", ContactSchema)
module.exports = Contact
