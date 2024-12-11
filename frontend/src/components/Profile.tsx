// Profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile: React.FC = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-xl mb-4">Profile</h2>
      <div className="bg-white p-6 rounded shadow-md">
        <p className="mb-4">Email: {email}</p>
        <textarea
          placeholder="Allergies (comma-separated)"
          className="border p-2 mb-4 w-full"
          value={allergy.join(",")}
          onChange={(e) => setAllergy(e.target.value.split(","))}
        ></textarea>
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;