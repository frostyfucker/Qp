import React from 'react';
import Link from 'next/link';
import { Post } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface BlogSectionProps {
  posts: Post[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Posts 📰</h2>
        <Link href="/posts/new" className="flex items-center justify-center w-8 h-8 bg-indigo-600/80 dark:bg-indigo-600/50 text-white rounded-full hover:bg-indigo-600 dark:hover:bg-indigo-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:ring-offset-gray-800 focus:ring-indigo-500 transition-all transform hover:scale-105" aria-label="Add new post">
            <PlusIcon className="w-5 h-5" />
        </Link>
      </div>
      <div className="space-y-4">
        {posts.slice(0, 3).map(({ id, date, title }) => (
          <Link href={`/posts/${id}`} key={id}>
            <div className="block bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer">
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-300 mt-1">{title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;