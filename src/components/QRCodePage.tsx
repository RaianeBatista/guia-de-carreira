import React from "react";
import Image from "next/image";

const QRCodePage: React.FC = () => {
  const appUrl = "https://guia-de-carreira.vercel.app/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
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
            <h1 className="text-2xl font-bold text-white">Guia de Carreira</h1>
          </div>
          <p className="text-gray-300 mb-6">
            Escaneie o QR Code para acessar a aplicação
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6">
          <Image
            src={qrCodeUrl}
            alt="QR Code para Guia de Carreira ZUP Camp AI"
            width={300}
            height={300}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>

        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors mb-4"
        >
          🔗 Acessar Aplicação
        </a>

        <div className="text-gray-400 text-sm">
          <p className="mb-2">
            📱 <strong>Como usar:</strong>
          </p>
          <p>1. Abra a câmera do celular</p>
          <p>2. Aponte para o QR Code</p>
          <p>3. Toque na notificação</p>
          <p>4. Acesse diretamente!</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
