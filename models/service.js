import mongoose from "mongoose";

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
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
