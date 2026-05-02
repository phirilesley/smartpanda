import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="mobile-container">
      <header className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Smart Panda
          </h1>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="mobile-content">
        {children}
      </main>
    </div>
  );
};
