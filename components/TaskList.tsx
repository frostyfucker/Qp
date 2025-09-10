import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  activeTaskId: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onTimerToggle, activeTaskId }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No tasks for this day. ✨</p>
        <p className="text-sm text-gray-500">Click the '+' button to add a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onTimerToggle={onTimerToggle}
          isActive={activeTaskId === task.id}
        />
      ))}
    </div>
  );
};

export default TaskList;
