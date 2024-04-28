import mongoose from "mongoose"

const ClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  clientDetails: String,
  clientLogo: {
    type: String,
    required: true,
  },
}, { timestamps: true })

const Client = mongoose.model("Client", ClientSchema)

export default Client
