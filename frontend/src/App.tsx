import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";
import Profile from "./components/Profile";
import AllergyDetection from "./components/AllergyDetection";
import NutritionReview from "./components/NutritionReview";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Main />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/allergy-detection" element={<AllergyDetection/>} />
      <Route path="/nutrition-analysis" element={<NutritionReview />}/>
    </Routes>
  </Router>
);

export default App;