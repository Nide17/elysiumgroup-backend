import mongoose from "mongoose";

const PTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
  },
});

const PType = mongoose.model("PType", PTypeSchema);

export default PType;
