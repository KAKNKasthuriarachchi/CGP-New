import { dbConnect } from '../../../lib/db/models/mongodb';
import Ad from '../../../lib/db/models/ad';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const ads = await Ad.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, ads }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { imageUrl, title, description, link } = await request.json();

    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newAd = new Ad({
      imageUrl,
      title: title || undefined,
      description: description || undefined,
      link: link || undefined,
    });

    await newAd.save();

    return NextResponse.json(
      { success: true, message: 'Ad added successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding ad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add ad' },
      { status: 500 }
    );
  }
}