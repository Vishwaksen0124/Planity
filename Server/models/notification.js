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
noticeSchema.index({ team: 1, isRead: 1 });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;