# Quarterly Planner

An elegant and intuitive time tracking and task management application built with Next.js, React, and Tailwind CSS. It features a comprehensive 3-month calendar view with quarterly color-coding, AI-powered task creation, event planning, and an integrated blog with RSS support.

## ✨ Features

- **3-Month Calendar View:** A unique interface displaying the previous, current, and next month for high-level quarterly planning.
- **AI-Powered Task Creation:** Use natural language to create tasks (e.g., "Schedule a team meeting tomorrow at 2pm"). The AI parses the details, suggests open time slots, and structures the task for you.
- **Comprehensive Task Management:**
  - Track tasks with status (`To Do`, `In Progress`, `Done`), descriptions, and sub-task checklists.
  - Assign priorities (`Low`, `Medium`, `High`) to tasks.
  - Manually reorder tasks for a given day using drag-and-drop.
  - An integrated timer to track time spent on each task.
- **Event Timeline:** Plan and visualize multi-day events like conferences or vacations on a 90-day timeline.
- **Integrated Markdown Blog:**
  - Full CRUD (Create, Read, Update, Delete) functionality for blog posts.
  - AI-powered content summary generation.
  - Automatic RSS feed generation for your posts.
- **Personalized Experience:**
  - Switch between Light and Dark modes.
  - Enable desktop notifications for task reminders.
  - Efficiently navigate and create items with keyboard shortcuts.
- **Data Persistence:** All your tasks, events, and posts are saved securely in your browser's `localStorage`.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Headless UI](https://headlessui.com/)

## 🚀 Getting Started

To run the project locally, follow these steps:

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 3. Environment Variables

You need a Google Gemini API key to use the AI features. Create a `.env.local` file in the root of the project and add your key:

```
API_KEY=YOUR_GEMINI_API_KEY
```

You can obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the project files using ESLint.
