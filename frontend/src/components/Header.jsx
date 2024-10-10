import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-b-lg shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaChartLine className="text-white text-3xl" />
          <h1 className="text-white text-3xl font-bold tracking-tight">Roxiler System</h1>
        </div>
        <div className="flex-grow text-center">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            Product Insights Dashboard
          </h2>
          <p className="text-white text-sm md:text-base mt-2">
            Developed by Shravasti Siddharth
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
