import React from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "./HeroSection";
import vectorNutri from "../assets/nutri.jpg";
import vectorAlen from "../assets/alen.jpg"
import Container from "./container";

const Main: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold order-1">Welcome to Smart Nutrition</h1>
        <div className="flex space-x-4 order-2 ml-auto">
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
      </header>
      <SectionTitle/>
      <main className="flex flex-col items-center space-y-8">
  <h2 className="text-2xl font-bold">Choose a Service</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a onClick={() => navigate("/allergy-detection")}>
        <img
          className="rounded-t-lg object-cover h-48 w-full"
          src={vectorAlen}
          alt="Allergy Icon"
        />
      </a>
      <div
        onClick={() => navigate("/allergy-detection")}
        className="cursor-pointer bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition"
      >
        <h3 className="text-xl font-semibold mb-4">Allergy Detection</h3>
        <p>
          Use our advanced machine learning algorithms to detect potential allergens
          in food products. Prioritize your health and safety.
        </p>
      </div>
    </div>
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow  dark:border-gray-700">
      <a onClick={() => navigate("/nutrition-analysis")}>
        <img
          className="rounded-t-lg object-cover h-48 w-full"
          src={vectorNutri}
          alt="Nutrition Icon"
        />
      </a>
      <div
        onClick={() => navigate("/nutrition-analysis")}
        className="cursor-pointer bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition"
      >
        <h3 className="text-xl font-semibold mb-4">Nutritional Analysis</h3>
        <p>
          Get detailed insights into the nutritional value of your food. Empower
          your dietary choices with accurate information.
        </p>
      </div>
    </div>
  </div>
</main>
<Container>
<div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
            <div className="text-left">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-black py-6 px-8">
                |Real-time Allergen Analysis|
              </h6>
            </div>
            <div className="text-left">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-black">
                {/* Add additional content if necessary */}
              </h6>
            </div>
            <div className="text-left">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-black py-6 px-8">
                | User-Friendly Interface for Quick Scans|
              </h6>
            </div>
          </div>
          </Container>

    </div>
  );
};

export default Main;