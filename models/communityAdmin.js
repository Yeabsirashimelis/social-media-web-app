import { model, models, Schema } from "mongoose";

const CommunityFollowSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // the current user
    communityId: { type: Schema.Types.ObjectId, ref: "Community" }, // the followed community
  },
  { timestamps: true }
);

const CommunityFollow =
  models.CommunityFollow || model("CommunityFollow", CommunityFollowSchema);

export default CommunityFollow;
