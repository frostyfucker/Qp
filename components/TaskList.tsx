import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { AnimatePresence, Reorder } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  activeTaskId: string | null;
  setTasks: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onTimerToggle, activeTaskId, setTasks }) => {

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No tasks for this day. ✨</p>
        <p className="text-sm text-gray-600 dark:text-gray-500">Click the '+' button to add a new task.</p>
      </div>
    );
  }

  return (
    <Reorder.Group 
      axis="y" 
      values={tasks} 
      onReorder={setTasks} 
      className="space-y-3 max-h-[50vh] overflow-y-auto pr-2"
    >
      <AnimatePresence>
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TaskItem
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onTimerToggle={onTimerToggle}
              isActive={activeTaskId === task.id}
            />
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

export default TaskList;