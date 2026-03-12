import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
     {
          team: [{
               type: Schema.Types.ObjectId,
               ref: "User",
               index: true
          }],
          text: {
               type: String
          },
          task: {
               type: Schema.Types.ObjectId,
               ref: "Task"
          },
          notiType: {
               type: String,
               default: "alert",
               enum: ["alert", "message"]
          },
          isRead: [{
               type: Schema.Types.ObjectId,
               ref: "User"
          }],
     },
     { timestamps: true }
);
// Removed compound index on two array fields (team and isRead)
// MongoDB doesn't allow indexing parallel arrays
// Individual index on team is already set at field level (line 8)

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;