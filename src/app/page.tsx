"use client";

import ChatInterface from "../components/ChatInterface";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Chat Interface - Ocupa toda a altura restante */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
