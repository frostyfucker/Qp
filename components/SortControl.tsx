import React from 'react';

export type SortOption = 'createdAt' | 'priority';

interface SortControlProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortControl: React.FC<SortControlProps> = ({ sortOption, setSortOption }) => {
  const getButtonClasses = (option: SortOption) => {
    const isActive = sortOption === option;
    return `
      px-3 py-1 text-xs font-semibold rounded-full transition-colors
      ${isActive 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
    `;
  };

  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-full">
      <button onClick={() => setSortOption('createdAt')} className={getButtonClasses('createdAt')}>
        Time
      </button>
      <button onClick={() => setSortOption('priority')} className={getButtonClasses('priority')}>
        Priority
      </button>
    </div>
  );
};

export default SortControl;
