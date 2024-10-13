import mongoose from "mongoose";

let connected = false;
const connectDB = async function () {
  mongoose.set("strictQuery", true);

  //if the database is already connected, don't connect again
  if (connected) {
    console.log("mongoDB is already connected");
  }

  //connect to mongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("mongodb is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
