import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { remark } from 'remark';
import html from 'remark-html';

import Header from '../../components/Header';
import { getPostById, savePost, deletePost } from '../../lib/posts';
import { Post } from '../../types';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from '../../components/icons/SparklesIcon';
import Spinner from '../../components/Spinner';

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [renderedContent, setRenderedContent] = useState('');

  // Form state for editing/creating
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;

    if (id === 'new') {
      setIsEditing(true);
      setPost(null); // No existing post
      setTitle('');
      setContent('');
      setIsLoading(false);
    } else {
      const postData = getPostById(id as string);
      if (postData) {
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      }
      setIsLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    if (post && post.content) {
      const processMarkdown = async () => {
        const result = await remark().use(html).process(post.content);
        setRenderedContent(result.toString());
      };
      processMarkdown();
    }
  }, [post]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const postData: Omit<Post, 'id'> & { id?: string } = {
        title,
        content,
        date: post?.date || new Date().toISOString().split('T')[0], // Use existing date or today's date for new posts
    };
    if (post?.id) {
        postData.id = post.id;
    }

    const saved = savePost(postData);
    router.push(`/posts/${saved.id}`);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (post && window.confirm('Are you sure you want to delete this post?')) {
        deletePost(post.id);
        router.push('/');
    }
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) return;
    setIsSummaryLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following blog post in a single, concise paragraph. Start with a bolded "TL;DR:". Here is the post content:\n\n${content}`
      });
      const summary = response.text;
      if (summary) {
        setContent(prev => `${summary}\n\n---\n\n${prev}`);
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("Could not generate summary. Please try again.");
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (!post && !isEditing) {
    return (
        <>
        <Head>
            <title>Post Not Found</title>
        </Head>
         <div className="min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8 text-center">
                <h1 className="text-3xl font-bold">Post not found</h1>
            </main>
        </div>
        </>
    )
  }

  return (
    <>
      <Head>
        <title>{title || 'New Post'} - Quarterly Planner</title>
        <meta name="description" content="A blog post from the Quarterly Planner." />
      </Head>
      <div className="min-h-screen font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          {isEditing ? (
            <form onSubmit={handleSave} className="prose prose-stone dark:prose-invert lg:prose-xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="post-title">Title</label>
                <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 text-3xl font-bold mb-4"
                    required
                />

                <label className="block text-gray-600 dark:text-gray-400 text-sm font-bold mb-2 mt-6" htmlFor="post-content">Content (Markdown)</label>
                <textarea
                    id="post-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded p-2 h-96 font-mono"
                    required
                />

                <div className="flex justify-between items-center mt-6">
                    <button type="button" onClick={handleGenerateSummary} disabled={isSummaryLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-800 flex items-center">
                        {isSummaryLoading ? <><Spinner /> Summarizing...</> : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate Summary</>}
                    </button>
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => id === 'new' ? router.push('/') : setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Post</button>
                    </div>
                </div>
            </form>
          ) : post && (
            <article className="prose prose-stone dark:prose-invert lg:prose-xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg relative">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={() => setIsEditing(true)} className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Edit</button>
                <button onClick={handleDelete} className="px-3 py-1 text-xs font-medium text-white bg-red-600/90 rounded-md hover:bg-red-600">Delete</button>
              </div>

              <h1 className="text-gray-900 dark:text-white">{post.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </article>
          )}
        </main>
      </div>
    </>
  );
};


export default PostPage;