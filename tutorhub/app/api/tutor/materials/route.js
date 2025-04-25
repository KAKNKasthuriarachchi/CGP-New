import TutorMaterial from "../../../../lib/db/models/TutorMaterial";
import { dbConnect } from "../../../../lib/db/models/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log('Received POST request to /api/tutor/materials');
    await dbConnect();
    console.log('Database connected successfully');

    const body = await request.json();
    console.log('Request body:', body);

    const { tutorId, subjectName, subjectPlace, tutes, recordings, pastPapers } = body;

    const errors = {};
    if (!tutorId?.trim()) errors.tutorId = "Tutor ID is required";
    if (!subjectName?.trim()) errors.subjectName = "Subject name is required";
    if (!subjectPlace?.trim()) errors.subjectPlace = "Subject place is required";
    if (!tutes?.trim() && !recordings?.trim() && !pastPapers?.trim()) {
      errors.materials = "At least one material (tutes, recordings, or past papers) is required";
    }

    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    console.log('Creating tutor material with data:', { tutorId, subject: { name: subjectName, place: subjectPlace }, tutes, recordings, pastPapers });

    const newMaterial = new TutorMaterial({
      tutor: tutorId,
      subject: { name: subjectName, place: subjectPlace },
      tutes: tutes || '',
      recordings: recordings || '',
      pastPapers: pastPapers || '',
    });

    await newMaterial.save();
    console.log('Tutor material saved successfully');

    const response = { success: true, message: "Tutor material added successfully" };
    console.log('Returning response:', response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error adding tutor material:', error);
    const errorResponse = { success: false, errors: { general: error.message || "Server error" } };
    console.log('Returning error response:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get('tutorId');
    const subjectName = searchParams.get('subjectName');
    const subjectPlace = searchParams.get('subjectPlace');

    const errors = {};
    if (!tutorId?.trim()) errors.tutorId = "Tutor ID is required";
    if (!subjectName?.trim()) errors.subjectName = "Subject name is required";
    if (!subjectPlace?.trim()) errors.subjectPlace = "Subject place is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const material = await TutorMaterial.findOne({
      tutor: tutorId,
      'subject.name': subjectName,
      'subject.place': subjectPlace,
    });

    if (material) {
      return NextResponse.json({
        success: true,
        materials: {
          tutes: material.tutes || '',
          recordings: material.recordings || '',
          pastPapers: material.pastPapers || '',
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: true,
        materials: {
          tutes: '',
          recordings: '',
          pastPapers: '',
        },
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching tutor materials:', error);
    return NextResponse.json(
      { success: false, errors: { general: error.message || "Server error" } },
      { status: 500 }
    );
  }
}