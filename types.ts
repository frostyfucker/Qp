export enum Status {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

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
  contentHtml?: string;
}
