import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  pName: {
    type: String,
    required: true,
  },
  pClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  pDate: {
    type: String,
    required: true,
  },
  pType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PType",
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  pLocation: {
    type: String,
    required: true,
  },
  pDescription: {
    type: String,
    required: true,
  },
  pGallery: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Project", ProjectSchema);
