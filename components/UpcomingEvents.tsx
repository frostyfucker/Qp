import React from 'react';
import { Event } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { TicketIcon } from './icons/TicketIcon';

interface UpcomingEventsProps {
  events: Event[];
  onAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
}

const dayDiff = (d1: Date, d2: Date) => {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timelineEnd = new Date(today);
  timelineEnd.setDate(today.getDate() + 90); // 90-day timeline view

  const visibleEvents = events
    .map(event => ({
      ...event,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    }))
    .filter(event => event.end >= today && event.start <= timelineEnd)
    .sort((a,b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">Event Timeline 🎪</h2>
        <button onClick={onAddEvent} className="flex items-center justify-center w-8 h-8 bg-indigo-600/50 text-white rounded-full hover:bg-indigo-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all transform hover:scale-105" aria-label="Add new event">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4 pr-2 max-h-[40vh] overflow-y-auto">
        {visibleEvents.length > 0 ? visibleEvents.map(event => {
          const startOffset = Math.max(0, dayDiff(today, event.start));
          const duration = dayDiff(event.start, event.end) + 1;
          const barWidth = Math.min((duration / 90) * 100, 100 - (startOffset / 90) * 100);

          return (
            <div key={event.id} className="group">
              <div className="flex justify-between items-center mb-1">
                 <h3 className="font-semibold text-indigo-300 text-sm truncate">{event.title}</h3>
                 <button onClick={() => onDeleteEvent(event.id)} className="p-1 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/20 transition-all" aria-label="Delete event">
                    <TrashIcon className="w-4 h-4" />
                 </button>
              </div>
              <div className="relative w-full bg-gray-700/50 rounded-full h-6 flex items-center px-2 text-xs text-white overflow-hidden">
                  <div className="absolute top-0 h-full bg-indigo-500/60 rounded-full" style={{ left: `${(startOffset / 90) * 100}%`, width: `${barWidth}%` }}></div>
                  <span className="relative z-10 truncate">{event.start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {event.end.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">No upcoming events. 🗓️</p>
            <p className="text-sm text-gray-500">Click the '+' button to plan something fun!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
