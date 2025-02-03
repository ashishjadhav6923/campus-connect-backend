import mongoose from "mongoose";
import { dbName } from "../constant.js";

const connectDB = async () => {
  const mongoAtlasURI = `${process.env.MONGODB_URI}/${dbName}`;
  const localMongoURI = `mongodb://localhost:27017/${dbName}`;
  try {
    const connectionInstance = await mongoose.connect(
      process.env.NODE_ENV === "dev" ? localMongoURI : mongoAtlasURI
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
