import { model, Schema } from "mongoose";

const WodCreatorSchema = new Schema(
  {
    name: String,
    time: String,
    description: String,
    movementOne: String,
    movementTwo: String,
    movementThree: String,
    wodType: String,
    createdBy: String,
  },
  { timestamps: true }
);

WodCreatorSchema.path("createdAt").immutable(true);

export const WodCreator = model("WodCreator", WodCreatorSchema);
