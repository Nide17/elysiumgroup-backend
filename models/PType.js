const mongoose = require("mongoose")

const PTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
    unique: true,
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

const PType = mongoose.model("PType", PTypeSchema)

module.exports = PType
