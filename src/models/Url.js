import mongoose from "../db/connection.js";

const urlSchema = new mongoose.Schema({
    originalUrl: {
      type: String,
      required: true,
      trim: true
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true
    },
    clicks: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Url = mongoose.model("Url", urlSchema);
  
  export default Url;
  