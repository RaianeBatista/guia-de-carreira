import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-transparent">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Guia de Carreira ZUP Camp AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Seu assistente especializado em orientação profissional. Tire suas
            dúvidas sobre carreira, desenvolvimento profissional e muito mais!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
