import { model, Schema } from "mongoose";

const RmTrackerSchema = new Schema(
  {
    movment: String,
    weight: String,
    createdBy: String,
  },
  { timestamps: true }
);

RmTrackerSchema.path("createdAt").immutable(true);

export const RmTracker = model("RmTracker", RmTrackerSchema);
