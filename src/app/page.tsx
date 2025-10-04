"use client";

import ChatInterface from "../components/ChatInterface";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
