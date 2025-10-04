import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo e nome - lado esquerdo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Futuro em Foco</h2>
        </div>

        {/* Créditos - lado direito */}
        <div className="text-sm text-gray-300">
          Desenvolvido pelas{" "}
          <span className="font-semibold text-purple-400">Prompt Builders</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
