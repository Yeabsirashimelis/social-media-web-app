import { Schema, model, models } from "mongoose";

const ThreadSchema = new Schema(
  {
    poster: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    medias: [{ type: String }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    privacy: { type: String, default: "public", enum: ["private", "public"] },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }],
    threadType: { type: String, default: "personal", enum: ["personal", "community"] },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: function() {
        return this.threadType === "community";
    } }, // Only required if it's a community thread
  },
  { timestamps: true }
);

const Thread = models.Thread || model("Thread", ThreadSchema);

export default Thread;
