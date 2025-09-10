import React, { useState, FormEvent } from 'react';
import { Event } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (eventData: Omit<Event, 'id'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setLocation('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && startDate && endDate) {
      onAddEvent({ title, startDate, endDate, location });
      resetState();
      onClose();
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={handleClose} aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 m-4 max-w-md w-full text-gray-300" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Event 🎪</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-400 mb-1">Event Title</label>
            <input type="text" id="event-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm" placeholder="e.g., Tech Conference 2025" required />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
              <input type="date" id="event-start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" required />
            </div>
            <div className="w-1/2">
              <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
              <input type="date" id="event-end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" required />
            </div>
          </div>
          <div>
            <label htmlFor="event-location" className="block text-sm font-medium text-gray-400 mb-1">Location</label>
            <input id="event-location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" placeholder="e.g., San Francisco, CA" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
