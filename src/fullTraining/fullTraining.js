import { model, Schema } from "mongoose";

const FullTrainingSchema = new Schema(
  {
    name: String,
    description: String,
  },
  { timestamps: true }
);

FullTrainingSchema.path("createdAt").immutable(true);

// TestSchema.pre("save", async function () {
//   const folder = await Folder.findOne({ _id: this.folder });
//   this.set("meta.folder", folder);
// });

export const FullTraining = model("FullTraining", FullTrainingSchema);
