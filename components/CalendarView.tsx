import React, { useMemo } from 'react';
import { Task } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getTaskLoadClass = (count: number): string => {
  if (count === 0) return '';
  if (count <= 2) return 'bg-indigo-900/40';
  if (count <= 4) return 'bg-indigo-900/60';
  return 'bg-indigo-900/80';
}

const CalendarMonth: React.FC<{
  monthDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}> = ({ monthDate, selectedDate, onDateSelect, tasks }) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const taskMap = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(task => {
        const taskDate = new Date(task.date);
        if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
            const day = taskDate.getDate();
            const key = `${year}-${month}-${day}`;
            map.set(key, (map.get(key) || 0) + 1);
        }
    });
    return map;
  }, [tasks, year, month]);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-start-${i}`} className="p-1"></div>);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, today);
    const taskCount = taskMap.get(`${year}-${month}-${day}`) || 0;

    const dayClasses = `
      relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 text-gray-800 dark:text-gray-200
      ${isSelected ? 'bg-indigo-600 text-white font-bold shadow-md' : ''}
      ${!isSelected && isToday ? 'bg-indigo-500/10 dark:bg-indigo-500/25 text-indigo-600 dark:text-indigo-300 font-semibold' : ''}
      ${!isSelected && !isToday ? `hover:bg-gray-200 dark:hover:bg-gray-700 ${getTaskLoadClass(taskCount)}` : ''}
      ${!isSelected && !isToday && taskCount > 0 ? 'font-medium' : ''}
    `;

    days.push(
      <div key={day} className="p-1 flex justify-center items-center">
        <button onClick={() => onDateSelect(date)} className={dayClasses}>
          {day}
        </button>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 flex-1">
      <h3 className="text-lg font-semibold text-center mb-3 text-gray-900 dark:text-white">
        {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days}
      </div>
    </div>
  );
};


const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, setCurrentDate, selectedDate, onDateSelect, tasks }) => {
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  }

  const getQuarterClasses = (date: Date): string => {
    const month = date.getMonth(); // 0-11
    if (month <= 2) return 'border-sky-500'; // Q1 (Jan-Mar)
    if (month <= 5) return 'border-emerald-500'; // Q2 (Apr-Jun)
    if (month <= 8) return 'border-amber-500'; // Q3 (Jul-Sep)
    return 'border-rose-500'; // Q4 (Oct-Dec)
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-2 sm:p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6 px-4 pt-4 sm:p-0">
        <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        <button onClick={goToToday} className="px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-500/25 rounded-lg hover:bg-opacity-20 dark:hover:bg-opacity-40 transition-colors">
          Today
        </button>
        <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronRightIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className={`flex-1 rounded-xl border-2 ${getQuarterClasses(prevMonth)} transition-colors`}>
          <CalendarMonth monthDate={prevMonth} selectedDate={selectedDate} onDateSelect={onDateSelect} tasks={tasks} />
        </div>
        
        <div className="flex-1 p-0.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg my-4 md:my-0">
          <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg">
            <CalendarMonth monthDate={currentDate} selectedDate={selectedDate} onDateSelect={onDateSelect} tasks={tasks} />
          </div>
        </div>

        <div className={`flex-1 rounded-xl border-2 ${getQuarterClasses(nextMonth)} transition-colors`}>
          <CalendarMonth monthDate={nextMonth} selectedDate={selectedDate} onDateSelect={onDateSelect} tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;