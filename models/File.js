import mongoose, { Schema } from "mongoose";
const fileSchema = mongoose.Schema(
  {
    filename: { type: String },
    file:{type:Buffer},
    contentType: { type: String },

  },
  {
    timestamps: true,
  }
);

const fileModel = mongoose.model("files", fileSchema);

export default fileModel;
