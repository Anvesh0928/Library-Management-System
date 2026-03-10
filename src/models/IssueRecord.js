import mongoose from "mongoose";

const issueRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    returnedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ["issued", "returned"],
      default: "issued"
    }
  },
  { timestamps: true }
);

export const IssueRecord = mongoose.model("IssueRecord", issueRecordSchema);

