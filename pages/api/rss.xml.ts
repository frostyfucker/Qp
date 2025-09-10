import { NextApiRequest, NextApiResponse } from 'next';
import RSS from 'rss';
import { getSortedPostsData } from '../../lib/posts';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  const feed = new RSS({
    title: "Quarterly Planner Blog",
    description: "Updates and thoughts from the Quarterly Planner app.",
    site_url: siteUrl,
    feed_url: `${siteUrl}/api/rss.xml`,
    language: "en",
  });

  const posts = getSortedPostsData();
  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: `Read the full post at ${siteUrl}/posts/${post.id}`,
      url: `${siteUrl}/posts/${post.id}`,
      guid: post.id,
      date: post.date,
    });
  });

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(feed.xml());
}
