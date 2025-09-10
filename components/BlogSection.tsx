import React from 'react';
import Link from 'next/link';
import { Post } from '../types';

interface BlogSectionProps {
  posts: Post[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Latest Posts ✍️</h2>
      <div className="space-y-4">
        {posts.slice(0, 3).map(({ id, date, title }) => (
          <Link href={`/posts/${id}`} key={id}>
            <div className="block bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h3 className="font-semibold text-indigo-300 mt-1">{title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
