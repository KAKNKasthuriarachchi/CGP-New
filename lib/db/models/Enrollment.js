import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminTutor',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model for students (mocked for now)
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  personalInfo: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    address: { type: String, required: true },
  },
  classSelection: {
    subjectName: { type: String, required: true },
    location: { type: String, required: true },
  },
  paymentDetails: {
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    securityCode: { type: String, required: true },
  },
});

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
