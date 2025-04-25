import mongoose from "mongoose";

const tutorMaterialSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminTutor',
    required: true,
  },
  subject: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
  },
  tutes: {
    type: String,
    required: false,
    trim: true,
  },
  recordings: {
    type: String,
    required: false,
    trim: true,
  },
  pastPapers: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TutorMaterial || mongoose.model('TutorMaterial', tutorMaterialSchema);