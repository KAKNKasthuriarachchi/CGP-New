import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the user details in the expected format
    const user = {
      id: session.user.id || "unknown",
      name: session.user.name || "Unknown User",
      email: session.user.email || "",
    };

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}