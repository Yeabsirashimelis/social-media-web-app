import { model, models, Schema } from "mongoose";
const CommunitySchema = new Schema(
  {
    communityName: { type: String, required: true },
    // inviteLink: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    description: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admins: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    communityType: { type: String, default: "public" },
  },
  { timestamps: true }
);

const Community = models.Community || model("Community", CommunitySchema);
export default Community;
