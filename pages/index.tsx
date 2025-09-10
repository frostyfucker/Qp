import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { Task, Status, Event, Post } from '../types';
import { getSortedPostsData } from '../lib/posts';

import CalendarView from '../components/CalendarView';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import Header from '../components/Header';
import { PlusIcon } from '../components/icons/PlusIcon';
import UpcomingEvents from '../components/UpcomingEvents';
import AddEventModal from '../components/AddEventModal';
import BlogSection from '../components/BlogSection';

interface HomePageProps {
  allPostsData: Post[];
}

const HomePage: NextPage<HomePageProps> = ({ allPostsData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('chrono-tasks');
      if (storedTasks) {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        setTasks(parsedTasks.map(task => ({ ...task, date: new Date(task.date), createdAt: new Date(task.createdAt) })));
      }
    } catch (error) { console.error("Failed to load tasks:", error); }
  }, []);

  useEffect(() => {
    localStorage.setItem('chrono-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('chrono-events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents([
          { id: '1', title: 'Louder Than Life', startDate: '2024-09-26', endDate: '2024-09-29', location: 'Louisville, KY' },
          { id: '2', title: 'ETHDenver 2025', startDate: '2025-02-24', endDate: '2025-03-05', location: 'Denver, CO' },
          { id: '3', title: 'TechCrunch Disrupt', startDate: '2024-10-28', endDate: '2024-10-30', location: 'San Francisco, CA' },
        ]);
      }
    } catch (error) { console.error("Failed to load events:", error); }
  }, []);

  useEffect(() => {
    localStorage.setItem('chrono-events', JSON.stringify(events));
  }, [events]);

  const handleDateSelect = useCallback((date: Date) => setSelectedDate(date), []);
  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'status' | 'timeSpent' | 'createdAt'>) => {
    const newTask: Task = { id: crypto.randomUUID(), ...taskData, status: Status.ToDo, timeSpent: 0, createdAt: new Date() };
    setTasks(prev => [...prev, newTask]);
    setIsTaskModalOpen(false);
  }, []);
  const handleUpdateTask = useCallback((updatedTask: Task) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t)), []);
  const handleDeleteTask = useCallback((taskId: string) => setTasks(prev => prev.filter(t => t.id !== taskId)), []);
  const handleAddEvent = useCallback((eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = { id: crypto.randomUUID(), ...eventData };
    setEvents(prev => [...prev, newEvent]);
    setIsEventModalOpen(false);
  }, []);
  const handleDeleteEvent = useCallback((eventId: string) => setEvents(prev => prev.filter(e => e.id !== eventId)), []);
  const handleTimerToggle = useCallback((taskId: string) => setActiveTaskId(prev => (prev === taskId ? null : taskId)), []);

  const tasksForSelectedDate = useMemo(() => tasks.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [tasks, selectedDate]);
  const formattedSelectedDate = useMemo(() => selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), [selectedDate]);

  return (
    <>
      <Head>
        <title>Quarterly Planner 🤔🪄📆</title>
        <meta name="description" content="A personal dashboard for planning, tasks, and more." />
      </Head>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-300">
        <Header />
        <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} selectedDate={selectedDate} onDateSelect={handleDateSelect} tasks={tasks} />
            <BlogSection posts={allPostsData} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Tasks for 📅</h2>
                  <p className="text-sm text-gray-400">{formattedSelectedDate}</p>
                </div>
                <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105" aria-label="Add new task">
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
              <TaskList tasks={tasksForSelectedDate} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onTimerToggle={handleTimerToggle} activeTaskId={activeTaskId} />
            </div>
            <UpcomingEvents events={events} onAddEvent={() => setIsEventModalOpen(true)} onDeleteEvent={handleDeleteEvent} />
          </div>
        </main>
        <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onAddTask={handleAddTask} selectedDate={selectedDate} />
        <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onAddEvent={handleAddEvent} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default HomePage;
