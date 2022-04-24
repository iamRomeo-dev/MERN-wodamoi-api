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
  },
  { timestamps: true }
);

WodCreatorSchema.path("createdAt").immutable(true);

// TestSchema.pre("save", async function () {
//   const folder = await Folder.findOne({ _id: this.folder });
//   this.set("meta.folder", folder);
// });

export const WodCreator = model("WodCreator", WodCreatorSchema);
