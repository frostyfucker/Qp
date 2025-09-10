import React, { useState, FormEvent, useCallback, useEffect } from 'react';
import { Subtask, Task } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';
import Spinner from './Spinner';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'status' | 'timeSpent' | 'createdAt'>) => void;
  selectedDate: Date;
}

// Define the expected JSON schema for the AI response
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'The main title of the task.' },
        description: { type: Type.STRING, description: 'A brief description of the task.' },
        emoji: { type: Type.STRING, description: 'A single emoji that represents the task.' },
        dateOffset: { type: Type.INTEGER, description: 'Number of days from today. 0 for today, 1 for tomorrow, -1 for yesterday, etc.' },
        startTime: { type: Type.STRING, description: 'The start time in HH:MM format. Default to empty string if not specified.' },
        endTime: { type: Type.STRING, description: 'The end time in HH:MM format. Default to empty string if not specified.' },
        subtasks: {
            type: Type.ARRAY,
            description: 'A list of sub-tasks or checklist items.',
            items: { type: Type.STRING }
        }
    },
    required: ['title', 'dateOffset']
};

type ParsedTask = {
    title: string;
    description: string;
    emoji: string;
    startTime: string;
    endTime: string;
    subtasks: Subtask[];
    date: Date;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, selectedDate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);

  useEffect(() => {
    // When the selected date changes, if we have a parsed task, update its date
    if(parsedTask) {
        setParsedTask(prev => prev ? {...prev, date: selectedDate} : null);
    }
  }, [selectedDate, parsedTask]);

  const resetState = useCallback(() => {
    setPrompt('');
    setIsLoading(false);
    setError(null);
    setParsedTask(null);
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleGenerateTask = async () => {
    if (!prompt.trim()) {
        setError('Please enter a task description.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setParsedTask(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const today = new Date();
        const systemInstruction = `You are an intelligent task parsing assistant for a planning app. The user will provide a natural language prompt. Convert it into a structured JSON object that matches the provided schema. Today's date is ${today.toLocaleDateString('en-CA')}. Calculate all dates relative to this. If no date is mentioned, assume today (dateOffset: 0). Always provide values for all fields in the schema, using defaults like empty strings or empty arrays where appropriate.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        const targetDate = new Date(selectedDate);
        targetDate.setDate(targetDate.getDate() + (result.dateOffset || 0));

        setParsedTask({
            title: result.title || 'Untitled Task',
            description: result.description || '',
            emoji: result.emoji || '',
            startTime: result.startTime || '',
            endTime: result.endTime || '',
            subtasks: (result.subtasks || []).map((sub: string) => ({ id: crypto.randomUUID(), title: sub, completed: false })),
            date: targetDate,
        });

    } catch (e) {
        console.error(e);
        setError('Failed to generate task. Please try a different prompt.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (parsedTask) {
      onAddTask({ 
          title: parsedTask.title,
          description: parsedTask.description,
          emoji: parsedTask.emoji,
          startTime: parsedTask.startTime,
          endTime: parsedTask.endTime,
          subtasks: parsedTask.subtasks,
          date: parsedTask.date
      });
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl p-8 m-4 max-w-lg w-full text-gray-300 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            {parsedTask ? 'Review Your Task' : 'Add New Task with AI'}
            {!parsedTask && <SparklesIcon className="w-6 h-6 ml-2 text-indigo-400"/>}
        </h2>
        
        {!parsedTask ? (
            // Prompt input view
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Describe your task, and let AI handle the details. Try something like: "Schedule team sync tomorrow from 2pm to 3pm"</p>
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-1">Task Prompt</label>
                    <textarea
                        id="prompt"
                        rows={4}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Water the plants this Friday..."
                    ></textarea>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex justify-end space-x-4 pt-2">
                    <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
                    <button type="button" onClick={handleGenerateTask} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center">
                       {isLoading ? <><Spinner /> Generating...</> : <><SparklesIcon className="w-5 h-5 mr-2"/> Generate Task</>}
                    </button>
                </div>
            </div>
        ) : (
            // Review and edit view
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-1/6">
                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-400 mb-1">Emoji</label>
                        <input type="text" id="emoji" value={parsedTask.emoji} onChange={e => setParsedTask({...parsedTask, emoji: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-center text-2xl" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input type="text" id="title" value={parsedTask.title} onChange={e => setParsedTask({...parsedTask, title: e.target.value})} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea id="description" rows={2} value={parsedTask.description} onChange={e => setParsedTask({...parsedTask, description: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"></textarea>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-400 mb-1">Start Time</label>
                        <input type="time" id="startTime" value={parsedTask.startTime} onChange={e => setParsedTask({...parsedTask, startTime: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-400 mb-1">End Time</label>
                        <input type="time" id="endTime" value={parsedTask.endTime} onChange={e => setParsedTask({...parsedTask, endTime: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                </div>
                 <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Date</p>
                    <p className="px-3 py-2 bg-gray-700 rounded-md">{parsedTask.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
                {parsedTask.subtasks.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Subtasks</label>
                        <div className="mt-2 space-y-2 max-h-24 overflow-y-auto p-2 bg-gray-900/50 rounded-md">
                            {parsedTask.subtasks.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                                    <span className="text-sm">{sub.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center pt-4">
                    <button type="button" onClick={() => setParsedTask(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Back</button>
                    <div>
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700/50 mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Task</button>
                    </div>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default AddTaskModal;