import { Post } from '../types';

const POSTS_STORAGE_KEY = 'chrono-posts';
const isBrowser = typeof window !== 'undefined';

// Initial posts serve as default content for the RSS feed on the server,
// and as the initial seed for new users on the client.
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

/**
 * Seeds localStorage with initial posts if no posts exist.
 * This function is safe to call on the server (it will do nothing).
 */
export function seedInitialPosts(): void {
  if (!isBrowser) return;
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!storedPosts) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialPosts));
    }
  } catch (error) {
    console.error("Failed to seed initial posts:", error);
  }
}

/**
 * Retrieves all posts.
 * On the client, it reads from localStorage.
 * On the server (e.g., for RSS feed generation), it returns the initial default posts.
 * @returns An array of posts, sorted by date descending.
 */
export function getPosts(): Post[] {
  if (!isBrowser) {
    // For server-side rendering, return a copy of the initial posts.
    return [...initialPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      const posts: Post[] = JSON.parse(storedPosts);
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error("Failed to load posts from localStorage:", error);
  }
  return []; // Return empty array on client if localStorage is empty or fails
}

/**
 * Retrieves a single post by its ID.
 * @param id The ID of the post to retrieve.
 * @returns The post object or undefined if not found.
 */
export function getPostById(id: string): Post | undefined {
  const posts = getPosts();
  return posts.find(post => post.id === id);
}

/**
 * Saves a post (creates a new one or updates an existing one).
 * This function is safe to call on the server (it will do nothing).
 * @param postToSave The post object to save. Can have an optional `id` for updates.
 * @returns The saved post, including its new ID if it was created.
 */
export function savePost(postToSave: Omit<Post, 'id'> & { id?: string }): Post {
  if (!isBrowser) {
    // Cannot save on the server, return a mock object that satisfies the type.
    const mockSavedPost = { ...postToSave, id: postToSave.id || 'server-save-noop' };
    return mockSavedPost as Post;
  }

  let posts = getPosts();
  let savedPostResult: Post;

  if (postToSave.id) {
    const index = posts.findIndex(p => p.id === postToSave.id);
    if (index > -1) {
      // Update existing post
      posts[index] = { ...posts[index], ...postToSave, id: postToSave.id };
      savedPostResult = posts[index];
    } else {
      // If ID provided but not found, treat as a new post with that ID
      const newPostWithId = { ...postToSave, id: postToSave.id } as Post;
      posts.unshift(newPostWithId);
      savedPostResult = newPostWithId;
    }
  } else {
    // Create new post
    const newPost: Post = { ...postToSave, id: crypto.randomUUID() };
    posts.unshift(newPost);
    savedPostResult = newPost;
  }
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  return savedPostResult;
}

/**
 * Deletes a post by its ID.
 * This function is safe to call on the server (it will do nothing).
 * @param id The ID of the post to delete.
 */
export function deletePost(id: string): void {
  if (!isBrowser) return;

  let posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
}