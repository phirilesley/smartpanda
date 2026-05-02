import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Smart Panda School System
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </a>
              <a href="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                AI Analytics
              </a>
              <a href="/modules" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Modules
              </a>
              <a href="/mobile/student" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Student View
              </a>
              <a href="/mobile/parent" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Parent View
              </a>
              <a href="/mobile/teacher" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Teacher View
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
