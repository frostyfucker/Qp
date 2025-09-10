import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import { Task, Status } from '../types';
import { ClockIcon } from '../components/icons/ClockIcon';

const HistoryPage: NextPage = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('chrono-tasks');
      if (storedTasks) {
        const allTasks: Task[] = JSON.parse(storedTasks);
        const doneTasks = allTasks
          .filter(task => task.status === Status.Done)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCompletedTasks(doneTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Task History - Quarterly Planner</title>
      </Head>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-300">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Completed Task History 📜</h1>
          
          <div className="relative border-l-2 border-indigo-500/30 ml-4 md:ml-6">
            {completedTasks.length > 0 ? completedTasks.map((task, index) => (
              <div key={task.id} className="mb-10 ml-8 md:ml-12 relative">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full -left-[48px] md:-left-[56px] ring-8 ring-gray-900">
                  {task.emoji || '✔️'}
                </span>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">
                        {new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <h3 className="text-lg font-semibold text-white mt-1">{task.title}</h3>
                    <p className="my-2 text-base font-normal text-gray-400">{task.description}</p>
                    {task.timeSpent > 0 && (
                        <div className="flex items-center text-sm text-indigo-400">
                            <ClockIcon className="w-4 h-4 mr-1.5"/>
                            Time tracked: {Math.floor(task.timeSpent / 60)}m {task.timeSpent % 60}s
                        </div>
                    )}
                </div>
              </div>
            )) : (
                 <div className="text-center py-20 ml-8">
                    <p className="text-gray-400 text-lg">No completed tasks yet.</p>
                    <p className="text-gray-500">Once you mark tasks as "Done", they will appear here!</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default HistoryPage;
