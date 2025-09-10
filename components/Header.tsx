import React from 'react';
import Link from 'next/link';
import { HistoryIcon } from './icons/HistoryIcon';
import { RssIcon } from './icons/RssIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <span className="text-2xl font-bold text-indigo-500">Quarterly Planner</span>
            <span className="ml-2 text-2xl">🤔🪄📆</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <Link href="/history" className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="View History">
                <HistoryIcon className="w-6 h-6 text-gray-400" />
            </Link>
             <a href="/api/rss.xml" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="RSS Feed">
                <RssIcon className="w-6 h-6 text-gray-400" />
            </a>
            <img 
              className="h-8 w-8 rounded-full" 
              src="https://picsum.photos/id/237/200/200" 
              alt="User avatar" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
