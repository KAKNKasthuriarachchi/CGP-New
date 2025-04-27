import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "../../../lib/db/models/mongodb";
import user from "../../../lib/db/models/user";
import adminTutor from "../../../lib/db/models/adminTutor";

export async function POST(request) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const { tutorId, studentId, tutorName, subject, place } = await request.json();

    if (!tutorId || !studentId || !tutorName || !subject || !place) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure the studentId matches the logged-in user
    if (studentId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Invalid student ID" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to the database
    await dbConnect();

    // Fetch the tutor's picture
    const tutor = await adminTutor.findById(tutorId).lean();
    if (!tutor) {
      return new Response(JSON.stringify({ error: "Tutor not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update the user's enrollments with the tutor's picture
    const updatedUser = await user.findOneAndUpdate(
      { _id: studentId },
      {
        $push: {
          enrollments: {
            tutorName,
            subject,
            place,
            tutorPicture: tutor.picture,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Enrollment successful!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/enroll:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}