"use client";

import ChatInterface from "../components/ChatInterface";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Guia de Carreira ZUP Camp AI
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Seu assistente especializado em orientação profissional. Tire suas
              dúvidas sobre carreira, desenvolvimento profissional e muito mais!
            </p>
          </div>

          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
