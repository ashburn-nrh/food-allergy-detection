import React from "react";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <h1 className="text-xl font-semibold">Welcome, Empowering Safe Choices</h1>
      </header>
      <main className="flex flex-col items-center space-y-8">
        <h2 className="text-2xl font-bold">Choose a Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => navigate("/allergy-detection")}
            className="cursor-pointer bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Allergy Detection</h3>
            <p>
              Use our advanced machine learning algorithms to detect potential allergens
              in food products. Prioritize your health and safety.
            </p>
          </div>
          <div
            onClick={() => navigate("/nutrition-analysis")}
            className="cursor-pointer bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Nutritional Analysis</h3>
            <p>
              Get detailed insights into the nutritional value of your food. Empower
              your dietary choices with accurate information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
