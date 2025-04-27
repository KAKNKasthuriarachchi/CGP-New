import { NextResponse } from 'next/server';

// Hardcoded admin credentials (replace with database check in production)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // In a real app, you'd set up a session or JWT token for the admin here
    return NextResponse.json({ message: 'Admin login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during admin login' }, { status: 500 });
  }
}