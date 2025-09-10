import { Post } from '../types';

const POSTS_STORAGE_KEY = 'chrono-posts';

const initialPosts: Post[] = [
  {
    id: 'welcome-to-the-new-planner',
    title: 'Welcome to the New Planner',
    date: '2024-07-15',
    content: "This is the first post on my new integrated blog! I'm excited to share updates, productivity tips, and thoughts on development right here from my personal dashboard.\n\nThe migration to **Next.js** has opened up a world of possibilities.",
  },
  {
    id: 'productivity-and-planning',
    title: 'Productivity and Planning',
    date: '2024-07-18',
    content: "A key to staying productive is having a clear view of your tasks and your time. The new timeline and history views are designed to give you exactly that.\n\n- **Timeline View:** See your multi-day events at a glance.\n- **History:** Review what you've accomplished.\n\nStay tuned for more features!",
  }
];

export function seedInitialPosts(): void {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!storedPosts) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialPosts));
    }
  } catch (error) {
    console.error("Failed to seed initial posts:", error);
  }
}

export function getPosts(): Post[] {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      const posts: Post[] = JSON.parse(storedPosts);
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
  return [];
}

export function getPostById(id: string): Post | undefined {
  const posts = getPosts();
  return posts.find(post => post.id === id);
}

export function savePost(postToSave: Omit<Post, 'id'> & { id?: string }): Post {
  let posts = getPosts();
  if (postToSave.id) {
    // Update existing post
    const index = posts.findIndex(p => p.id === postToSave.id);
    if (index > -1) {
      posts[index] = { ...posts[index], ...postToSave };
    }
  } else {
    // Create new post
    const newPost = { ...postToSave, id: crypto.randomUUID() };
    posts.unshift(newPost); // Add to the beginning
    postToSave = newPost;
  }
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  return postToSave as Post;
}

export function deletePost(id: string): void {
  let posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
}
