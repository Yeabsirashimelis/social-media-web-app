import { model, models, Schema } from "mongoose";

const FollowSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followers: { type: [Schema.Types.ObjectId], default: [], ref: "User" },
    following: { type: [Schema.Types.ObjectId], default: [], ref: "User" },
  },
  { timestamps: true }
);

const Follows = models.Follows || model("Follows", FollowSchema);

export default Follows;
