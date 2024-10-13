import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String },
    phoneNumber: { type: String },
    email: { type: String, required: true },
    interestedIn: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
