import { dbConnect } from "../../../lib/db/models/mongodb";
import bcrypt from "bcrypt";
import user from "../../../lib/db/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.json();
    const { firstName, lastName, email, dob, password } = formData;

    await dbConnect();

    const errors = {};

    // Validate required fields
    if (!firstName?.trim()) {
      errors.firstName = "Please enter your first name";
    }
    if (!lastName?.trim()) {
      errors.lastName = "Please enter your last name";
    }
    if (!email?.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!dob) {
      errors.dob = "Please enter your date of birth";
    }
    if (!password) {
      errors.password = "Please enter a password";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, errors: { email: "User already exists" } },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new user({
      firstName,
      lastName,
      email,
      dob: new Date(dob),
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, errors: { form: error.message || "An error occurred while registering" } },
      { status: 500 }
    );
  }
}