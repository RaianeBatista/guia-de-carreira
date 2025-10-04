"use client";

import ChatInterface from "../components/ChatInterface";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Chat Interface - Ocupa toda a altura restante */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
