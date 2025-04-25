import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ad || mongoose.model('Ad', adSchema);