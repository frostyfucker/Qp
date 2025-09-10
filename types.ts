export enum Status {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export type Priority = 'Low' | 'Medium' | 'High';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: Status;
  timeSpent: number; // in seconds
  createdAt: Date;
  emoji?: string;
  startTime?: string;
  endTime?: string;
  subtasks: Subtask[];
  priority: Priority;
  notifications: boolean;
}

export interface Event {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  location: string;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  contentHtml?: string;
}