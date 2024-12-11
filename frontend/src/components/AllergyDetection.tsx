import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllergyDetection: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const getEmailFromJWT = (): string => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("No JWT found");
    }
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.email;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    const email = getEmailFromJWT();

    const formData = new FormData();
    formData.append("file", file);

    try {
      // First, get the user's allergies
      const allergyResponse = await axios.get(`http://127.0.0.1:8000/get-allergy/${email}`);
      const allergies = allergyResponse.data.allergy || []; // Ensure allergies is always an array

      // Check if allergies is an array before proceeding
      if (!Array.isArray(allergies)) {
        throw new Error("Allergies data is not in the expected format");
      }

      // Then, send the image for allergy detection
      const detectionResponse = await axios.post("http://127.0.0.1:8000/api/allergy_detection/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const detectedAllergens = detectionResponse.data.predicted_allergens;

      // Extract allergen names from the predicted_allergens object
      const detectedAllergenNames = Object.keys(detectedAllergens).filter(
        (allergen) => detectedAllergens[allergen] === 1
      );

      // Check if any detected allergens match the user's allergies
      const matchedAllergens = detectedAllergenNames.filter((allergen: string) =>
        allergies.includes(allergen)
      );

      if (matchedAllergens.length > 0) {
        setMessage(`Warning! This image contains allergens you're allergic to: ${matchedAllergens.join(", ")}`);
      } else {
        setMessage("No allergens detected in the uploaded food item.");
      }
    } catch (error) {
      console.error("Error detecting allergens or getting allergies", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </header>
      <main className="flex flex-col items-center space-y-8">
        <h2 className="text-2xl font-bold">Allergy Detection</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit for Detection
        </button>
        {message && <p className="mt-4 text-xl text-center">{message}</p>}
      </main>
    </div>
  );
};

export default AllergyDetection;
