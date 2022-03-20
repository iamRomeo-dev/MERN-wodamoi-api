import { model, Schema } from "mongoose";

const TestSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      default: "planned",
      enum: ["planned", "in_progress", "done"],
    },
    machine: String,
    folder: {
      type: String,
    },
    assignedTaskType: {
      type: String,
    },
    options: [],
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // "meta.folder": Schema.Types.Mixed,
  },
  { timestamps: true }
);

TestSchema.path("createdAt").immutable(true);

// TestSchema.pre("save", async function () {
//   const folder = await Folder.findOne({ _id: this.folder });
//   this.set("meta.folder", folder);
// });

export const Test = model("Test", TestSchema);
