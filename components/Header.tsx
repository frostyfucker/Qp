import React, { useState } from 'react';
import Link from 'next/link';
import { HistoryIcon } from './icons/HistoryIcon';
import { RssIcon } from './icons/RssIcon';
import ThemeToggle from './ThemeToggle';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import HelpModal from './HelpModal';

const Header: React.FC = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 shadow-md sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-indigo-500">Quarterly Planner</span>
            </Link>
            <nav className="flex items-center space-x-2 sm:space-x-4">
               <ThemeToggle />
               <Link href="/posts" className="p-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" title="View Blog">
                  Blog
              </Link>
               <Link href="/history" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="View History">
                  <HistoryIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </Link>
               <a href="/api/rss.xml" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="RSS Feed">
                  <RssIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </a>
              <button onClick={() => setIsHelpModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Help & Shortcuts">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://picsum.photos/id/237/200/200" 
                alt="User avatar" 
              />
            </nav>
          </div>
        </div>
      </header>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};

export default Header;