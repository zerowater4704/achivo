import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE!)
    console.log("DB接続中")
  } catch(err) {
    console.log("DB接続エラー",err)
  }
}

export default connectDB