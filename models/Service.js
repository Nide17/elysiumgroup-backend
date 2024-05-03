const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  serviceTitle: {
    type: String,
    required: true,
  },
  serviceDetail: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true })

const Service = mongoose.model("Service", ServiceSchema)

module.exports = Service
