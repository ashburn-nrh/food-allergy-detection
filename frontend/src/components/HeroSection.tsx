import React from "react";
import Container from "./container";



const SectionTitle: React.FC = () => (
  <div className="relative" id="home">
    <div
      aria-hidden="true"
      className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
    >
      <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
      <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
    </div>

    <Container>
      <div className="relative pt-36 ml-auto">
        <div className="lg:w-2/3 text-center mx-auto">
          <h1 className="text-gray-900 dark:text-black font-bold text-5xl md:text-6xl xl:text-7xl">
            Empowering Safe Choices, {" "}
            <span className="text-primary dark:text-black">Anywhere, Anytime.</span>
          </h1>
          <p className="mt-8 text-gray-700 dark:text-gray-600">
            Our allergy detection software leverages advanced machine learning to help individuals identify potential allergens in food products. Whether for personal use or within healthcare and food industries, our platform offers instant insights, safeguarding users with accurate allergen risk assessments. Reduce anxiety and gain peace of mind with a tool designed to prioritize your health and safety.
          </p>
          <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
            <a
              href="#"
              className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
            >
              <span className="relative text-base font-semibold text-primary dark:text-white">
                Get Started
              </span>
            </a>
          </div>
          <div className="border-t-2 border-gray-300 my-4"></div>
        </div>
      </div>
    </Container>
  </div>
);

export default SectionTitle;
