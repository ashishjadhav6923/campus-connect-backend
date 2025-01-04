import mongoose from "mongoose";
import { dbName } from "../constant.js";

const localMongoURI = `mongodb://localhost:27017/${dbName}`;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${dbName}`
    );
    console.log(
      `Connected to \nDB : ${dbName}, DB HOST :`,
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Error while connecting to DB : ", error);
    process.exit(1);
  }
};

export default connectDB;
