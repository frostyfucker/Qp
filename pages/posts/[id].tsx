import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Header from '../../components/Header';
import { getPostData, getSortedPostsData } from '../../lib/posts';
import { Post } from '../../types';

interface PostPageProps {
  postData: Post & { contentHtml: string };
}

const PostPage: NextPage<PostPageProps> = ({ postData }) => {
  return (
    <>
      <Head>
        <title>{postData.title} - Quarterly Planner</title>
        <meta name="description" content="A blog post from the Quarterly Planner." />
      </Head>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-300">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <article className="prose prose-invert lg:prose-xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h1 className="text-white">{postData.title}</h1>
            <p className="text-gray-400">{new Date(postData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </article>
        </main>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const paths = posts.map(post => ({
    params: { id: post.id },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) {
    return { notFound: true };
  }
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

export default PostPage;
