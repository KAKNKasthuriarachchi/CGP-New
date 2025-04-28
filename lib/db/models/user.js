import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  enrollments: [
    {
      tutorName: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      place: {
        type: String,
        required: true,
      },
      tutorPicture: {
        type: String,
        required: true,
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: {
    type: String,
    required: true,
    enum: ['student', 'tutor', 'admin'], // Restrict to specific roles
    default: 'student', // Default to 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);