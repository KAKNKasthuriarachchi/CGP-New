import adminTutor from "../../../lib/db/models/adminTutor";
import { dbConnect } from "../../../lib/db/models/mongodb";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const stream = searchParams.get("stream");
    const section = searchParams.get("section");
    const excludeId = searchParams.get("excludeId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = searchParams.get("limit") || "10";
    const skip = limitParam !== "all" ? (page - 1) * parseInt(limitParam, 10) : 0;

    
    if (id) {
      const tutor = await adminTutor.findById(id);
      if (!tutor) {
        return NextResponse.json(
          { success: false, error: "Tutor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, tutor },
        { status: 200 }
      );
    }

  
    if (section && stream) {
      if (!excludeId) {
        return NextResponse.json(
          { success: false, error: "excludeId is required when fetching related tutors" },
          { status: 400 }
        );
      }
      const query = {
        stream,
        section,
        _id: { $ne: excludeId },
      };
      const relatedTutors = await adminTutor.find(query);
      return NextResponse.json(
        { success: true, tutors: relatedTutors },
        { status: 200 }
      );
    }

    
    const keyword = searchParams.get("keyword") || "";
    const query = {};
    if (keyword) {
      query.$or = [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { section: { $regex: keyword, $options: "i" } },
        { "subject.name": { $regex: keyword, $options: "i" } },
      ];
    }

    let tutors;
    let totalTutors = await adminTutor.countDocuments(query);
    if (limitParam === "all") {
      tutors = await adminTutor.find(query);
    } else {
      const limit = parseInt(limitParam, 10);
      tutors = await adminTutor.find(query).skip(skip).limit(limit);
    }

    return NextResponse.json(
      {
        success: true,
        tutors,
        pagination: limitParam !== "all" ? {
          currentPage: page,
          totalPages: Math.ceil(totalTutors / parseInt(limitParam, 10)),
          totalTutors,
        } : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      section,
      stream,
      subject,
      picture,
      qualifications,
      description,
    } = body;

    
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !section ||
      !stream ||
      !Array.isArray(subject) ||
      subject.length === 0 ||
      !picture ||
      !qualifications ||
      !description
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

  
    for (const sub of subject) {
      if (!sub.name || !sub.place) {
        return NextResponse.json(
          { success: false, error: "Each subject must have a name and place" },
          { status: 400 }
        );
      }
    }

   
    const urlPattern = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/.+$/;
    if (!urlPattern.test(picture)) {
      return NextResponse.json(
        { success: false, error: "Invalid picture URL. It must be a valid Cloudinary URL." },
        { status: 400 }
      );
    }

    const existingTutor = await adminTutor.findOne({ email });
    if (existingTutor) {
      return NextResponse.json(
        { success: false, error: "Tutor with this email already exists" },
        { status: 400 }
      );
    }

   
    const newTutor = new adminTutor({
      firstName,
      lastName,
      email,
      contactNumber,
      section,
      stream,
      subject,
      picture, 
      qualifications,
      description,
    });
    await newTutor.save();

    return NextResponse.json(
      { success: true, tutor: newTutor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tutor:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}