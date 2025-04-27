import { dbConnect } from '../../../lib/db/models/mongodb';
import adminTutor from '../../../lib/db/models/adminTutor';
import TutorMaterial from '../../../lib/db/models/TutorMaterial';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorName = searchParams.get("tutorName");
    const subject = searchParams.get("subject");
    const place = searchParams.get("place");

    if (!tutorName || !subject || !place) {
      return new Response(JSON.stringify({ error: "Missing required parameters: tutorName, subject, and place are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    // Step 1: Find the tutor by tutorName (assuming tutorName is "firstName lastName")
    const tutor = await adminTutor.findOne({
      $expr: {
        $eq: [
          { $concat: ["$firstName", " ", "$lastName"] },
          tutorName,
        ],
      },
    }).lean();

    if (!tutor) {
      return new Response(JSON.stringify({ error: "Tutor not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 2: Fetch materials for the tutor, subject, and place
    const materials = await TutorMaterial.find({
      tutor: tutor._id,
      "subject.name": subject,
      "subject.place": place,
    }).lean();

    // Step 3: Format the response
    const formattedMaterials = materials.map((material) => ({
      tutes: material.tutes || null,
      recordings: material.recordings || null,
      pastPapers: material.pastPapers || null,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        materials: formattedMaterials.length > 0 ? formattedMaterials[0] : { tutes: null, recordings: null, pastPapers: null },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/materials:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}