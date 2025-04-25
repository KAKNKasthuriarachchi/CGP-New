import Header from "@/lib/components/Header";

export default async function TutorProfile({ params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8">
        {/* User ID */}
        <span className="text-2xl font-bold text-blue-600">{user_id}</span>

        {/* Back Button */}
        <button className="text-2xl mb-4 block">⬅</button>

        <div className="flex items-start space-x-8">
          {/* Profile Image */}
          <div className="w-52 h-42 bg-gray-300 rounded"></div>

          {/* Tutor Info */}
          <div>
            <h1 className="text-2xl font color to-black font-bold">Name</h1>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded">Enroll Now!</button>
              <button className="bg-green-400 text-white px-4 py-2 rounded">Contact</button>
            </div>

            {/* Features */}
            <div className="flex space-x-6 mt-7">
              {[
                { label: "Tutes", icon: "📚"},
                { label: "Time Table", icon: "📅" },
                { label: "Recordings", icon: "🎥" },
                { label: "Payments", icon: "💵" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-36 h-26 bg-white shadow rounded flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <p className="mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tutor Description */}
        <div className="mt-8 bg-white p-4 rounded shadow">
          <p className="text-center text-gray-600">Brief info about the tutor</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-green-300 h-12"></div>
    </div>
  );
}
