import { model, models, Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    target: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, required: true, enum: ["Thread", "Comment"] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Like = models.Like || model("Like", LikeSchema);

export default Like;
