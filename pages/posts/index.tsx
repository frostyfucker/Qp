import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { Post } from '../../types';
import { getPosts } from '../../lib/posts';
import { PlusIcon } from '../../components/icons/PlusIcon';

const BlogIndexPage: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <>
      <Head>
        <title>Blog - Quarterly Planner</title>
      </Head>
      <div className="min-h-screen font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Posts</h1>
            <Link href="/posts/new" className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              <span>New Post</span>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? posts.map(post => (
              <Link href={`/posts/${post.id}`} key={post.id}>
                <div className="block h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-transparent hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                </div>
              </Link>
            )) : (
              <div className="md:col-span-2 lg:col-span-3 text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet.</p>
                <p className="text-gray-400 dark:text-gray-500">Click "New Post" to get started!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogIndexPage;
