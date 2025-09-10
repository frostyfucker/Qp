import React, { useEffect, useState, useRef } from 'react';
import { Task, Status, Priority } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BellIcon } from './icons/BellIcon';
import { BellSlashIcon } from './icons/BellSlashIcon';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  isActive: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const priorityClasses: Record<Priority, string> = {
    High: 'border-l-red-500',
    Medium: 'border-l-amber-500',
    Low: 'border-l-sky-500',
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, onDeleteTask, onTimerToggle, isActive }) => {
  const [time, setTime] = useState(task.timeSpent);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTime(task.timeSpent);
  }, [task.timeSpent]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onUpdateTask({ ...task, timeSpent: newTime });
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, onUpdateTask, task]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateTask({ ...task, status: e.target.value as Status });
  };
  
  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(sub => 
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleNotificationToggle = () => {
    onUpdateTask({ ...task, notifications: !task.notifications });
  }

  const completedCount = task.subtasks?.filter(s => s.completed).length || 0;
  const totalCount = task.subtasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 hover:shadow-lg dark:hover:border-gray-600 transition-all duration-200 border-l-4 ${priorityClasses[task.priority]} cursor-grab`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
            {task.emoji && <span className="text-2xl mt-1">{task.emoji}</span>}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">{task.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">{task.description}</p>
            </div>
        </div>
        <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-xs bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 ml-2"
        >
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.InProgress}>In Progress</option>
            <option value={Status.Done}>Done</option>
        </select>
      </div>
      
      {(task.startTime || task.endTime) && (
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
            <ClockIcon className="w-4 h-4" />
            <span>{task.startTime || '--:--'} → {task.endTime || '--:--'}</span>
        </div>
      )}

      {totalCount > 0 && (
          <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Checklist</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{completedCount} / {totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-2">
                  {task.subtasks.map(sub => (
                      <div key={sub.id} className="flex items-center">
                          <input type="checkbox" checked={sub.completed} onChange={() => handleSubtaskToggle(sub.id)} className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-offset-gray-800"/>
                          <label className={`ml-2 text-sm ${sub.completed ? 'line-through text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{sub.title}</label>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2 text-sm font-mono text-gray-500 dark:text-gray-400">
          <ClockIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <span>{formatTime(time)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNotificationToggle}
            className={`p-2 rounded-full ${task.notifications ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            aria-label={task.notifications ? 'Disable notifications' : 'Enable notifications'}
            disabled={!task.startTime}
            title={!task.startTime ? 'Add a start time to enable notifications' : (task.notifications ? 'Disable notifications' : 'Enable notifications')}
          >
            {task.notifications ? <BellIcon className="w-5 h-5" /> : <BellSlashIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onTimerToggle(task.id)}
            className={`p-2 rounded-full ${isActive ? 'bg-red-500/20 text-red-500 dark:text-red-400' : 'bg-green-500/20 text-green-600 dark:text-green-400'} hover:opacity-80 transition-opacity`}
            aria-label={isActive ? 'Pause timer' : 'Start timer'}
          >
            {isActive ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-2 rounded-full text-gray-400 dark:text-gray-500 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors"
            aria-label="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;