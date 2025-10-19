import React from 'react';

export const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-text-primary">RestroAI</h1>
        <button 
          onClick={onLogin} 
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          Log In to Dashboard
        </button>
      </div>
    </div>
  );
};
