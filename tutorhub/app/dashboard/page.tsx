import { useState } from "react";
import Link from "next/link";

// 1. Define a type for filters
type Filters = {
  medium: string;
  section: string;
  subject: string;
  district: string;
};

// 2. Define the allowed filter fields (to loop through safely)
const filterFields: (keyof Filters)[] = ["medium", "section", "subject", "district"];

export default function Dashboard() {
  const sriLankaDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
  ];

  const [filters, setFilters] = useState<Filters>({
    medium: "Sinhalese",
    section: "Primary",
    subject: "Maths",
    district: "Colombo",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4">
      {filterFields.map((field) => (
        <div className="mb-4" key={field}>
          <label className="block font-semibold capitalize">{field}</label>
          <select
            name={field}
            value={filters[field]}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            {field === "medium" && ["Sinhalese", "English", "Tamil"].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            {field === "section" && ["Primary", "Secondary", "AdvanceLevel"].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            {field === "subject" && ["Maths", "Science"].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            {field === "district" && sriLankaDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
