import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db/models/mongodb';
import ad from '../../../lib/db/models/ad';
export async function POST(request) {
  try {
    console.log('Starting POST /api/ad');

    const connection = await dbConnect();
    console.log('MongoDB connection status:', connection.connection.readyState);

    console.log('Ad model:', ad);
    console.log('Is Ad a Mongoose model?', typeof ad === 'function' && ad.prototype.save);

    const body = await request.json();
    console.log('Request body:', body);
    const { imageUrl, link } = body;

    if (!imageUrl) {
      console.log('Validation failed: imageUrl is missing');
      return NextResponse.json({ success: false, error: 'Ad image URL is required' }, { status: 400 });
    }

    console.log('Creating new Ad with:', { imageUrl, link: link || '' });
    const Ad = new ad({
      imageUrl,
      link: link || '',
    });

    console.log('Saving ad to database...');
    await Ad.save();
    console.log('Ad saved successfully:', Ad);

    return NextResponse.json({ success: true, Ad }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/ad:', error.message, error.stack);
    return NextResponse.json({ success: false, error: error.message || 'Failed to add advertisement' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const ads = await ad.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, ads }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/ad:', error.message, error.stack);
    return NextResponse.json({ success: false, error: 'Failed to fetch ads' }, { status: 500 });
  }
}