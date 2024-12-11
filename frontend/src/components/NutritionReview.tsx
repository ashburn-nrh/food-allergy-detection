import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NutritionReview: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [nutritionData, setNutritionData] = useState<any>(null); // Store parsed nutrition data here

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send image to API for nutrition review
      const response = await axios.post("http://127.0.0.1:8000/api/nutrition_review/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      
      // Clean and parse the nutrition review from the response
      if (data.status === "success" && data.nutrition_review) {
        const cleanedData = JSON.parse(data.nutrition_review);  // Parse the review
        console.log(cleanedData)
        setNutritionData(cleanedData);  // Set the parsed data
        setMessage("Nutrition analysis completed successfully!");
      } else {
        setMessage("Nutrition analysis failed.");
      }
    } catch (error) {
      console.error("Error in nutrition review", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </header>

      <main className="flex flex-col items-center space-y-8">
        <h2 className="text-2xl font-bold">Nutrition Review</h2>
        
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit for Nutrition Review
        </button>

        {message && <p className="mt-4 text-xl text-center">{message}</p>}

        {/* Show Nutrition Review Data if available */}
        {nutritionData && (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mt-8">
            <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
            <p className="text-lg">{nutritionData.overall_rating}</p>
            <p className="text-sm text-gray-500">{nutritionData.rating_explanation}</p>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Nutritional Details</h4>
              <ul>
                {Object.keys(nutritionData.nutrients).map((nutrient) => (
                  <li key={nutrient} className="mb-4">
                    <h5 className="font-semibold">{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</h5>
                    <p><strong>Level:</strong> {nutritionData.nutrients[nutrient].level}</p>
                    <p><strong>Recommendation:</strong> {nutritionData.nutrients[nutrient].recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Suggested Intake</h4>
              <p><strong>Frequency:</strong> {nutritionData.suggested_intake.frequency}</p>
              <p><strong>Rationale:</strong> {nutritionData.suggested_intake.rationale}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutritionReview;
