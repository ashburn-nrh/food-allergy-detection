import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [allergy, setAllergy] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/get-allergy/${payload.email}`);
        setAllergy(response.data.allergy || []);
      } catch (error) {
        alert("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put("http://127.0.0.1:8000/update-profile", { email, allergy });
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <header className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-white text-lg font-semibold flex items-center space-x-2 hover:underline"
          >
            <span>&#8592;</span> {/* Back Arrow */}
            <span>Back</span>
          </button>
        </header>
        
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Profile</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              className="border-2 p-3 rounded-md w-full bg-gray-100 text-gray-600"
              value={email}
              disabled
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="allergies" className="text-lg font-medium text-gray-600">Allergies</label>
            <textarea
              id="allergies"
              placeholder="Allergies (comma-separated)"
              className="border-2 p-3 rounded-md w-full bg-gray-100 text-gray-600"
              value={allergy.join(",")}
              onChange={(e) => setAllergy(e.target.value.split(","))}
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full py-3 text-white bg-blue-600 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
