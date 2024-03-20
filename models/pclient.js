import mongoose from "mongoose";

const ClienSchema = new mongoose.Schema({
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
});

const Client = mongoose.model("Client", ClienSchema);

export default Client;
