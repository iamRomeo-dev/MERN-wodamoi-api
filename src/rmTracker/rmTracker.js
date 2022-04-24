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

// TestSchema.pre("save", async function () {
//   const folder = await Folder.findOne({ _id: this.folder });
//   this.set("meta.folder", folder);
// });

export const RmTracker = model("RmTracker", RmTrackerSchema);
