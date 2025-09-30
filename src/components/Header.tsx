import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Futuro em Foco
            </h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Desenvolvido pelas{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Prompt Builders
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
