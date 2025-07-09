import { model, Schema } from "mongoose";

const FullTrainingSchema = new Schema(
  {
    name: String,
    description: String,
    createdBy: String,
  },
  { timestamps: true }
);

FullTrainingSchema.path("createdAt").immutable(true);

export const FullTraining = model("FullTraining", FullTrainingSchema);
