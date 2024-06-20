const mongoose = require("mongoose")

const ClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    unique: true,
  },
  clientEmail: {
    type: String
  },
  clientPhone: {
    type: String,
    required: true,
  },
  clientAddress: {
    type: String
  },
  clientDetails: String,
  clientLogo: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true })

const Client = mongoose.model("Client", ClientSchema)
module.exports = Client
