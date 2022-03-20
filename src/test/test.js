import { model, Schema } from "mongoose";

const TestSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

TestSchema.path("createdAt").immutable(true);

// TestSchema.pre("save", async function () {
//   const folder = await Folder.findOne({ _id: this.folder });
//   this.set("meta.folder", folder);
// });

export const Test = model("Test", TestSchema);
