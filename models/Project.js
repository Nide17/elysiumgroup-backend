const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  pName: {
    type: String,
    required: true,
  },
  pClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: '665808afa8c8170ac951fa17'
  },
  pStartDate: {
    type: String,
  },
  pType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PType",
    default: '665801daa64b63ef19a5f4e2'
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Ongoing", "Blocked", "Completed", "Abandoned"],
  },
  pLocation: {
    type: String,
    required: true,
  },
  pDescription: {
    type: String,
  },
  pGallery: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  lastUpdatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true })

const Project = mongoose.model("Project", ProjectSchema)

module.exports = Project