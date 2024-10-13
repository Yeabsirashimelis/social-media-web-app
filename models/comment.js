import { model, models, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    thread: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
    commenter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likesCount: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, default: null },
    content: { type: String, required: true },
    media: { type: String },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
