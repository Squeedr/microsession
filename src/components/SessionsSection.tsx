import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Video, Users2, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';

interface Session {
  id: string;
  title: string;
  time: string;
  type: string;
  host: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  workspaceId: string;
  location?: string;
  tag?: string;
}

function SessionCard({ session }: { session: Session }) {
  const getSessionIcon = () => {
    switch (session.type.toLowerCase()) {
      case 'zoom call':
        return <Video className="w-8 h-8 text-blue-500" />;
      case 'in-person':
        return <Users2 className="w-8 h-8 text-purple-500" />;
      default:
        return <Clock className="w-8 h-8 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getSessionIcon()}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{session.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <span>{format(new Date(session.time), 'HH:mm')}</span>
            {session.location && (
              <>
                <span>•</span>
                <span>{session.location}</span>
              </>
            )}
            {session.tag && (
              <>
                <span>•</span>
                <span>#{session.tag}</span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            with {session.host}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {session.status}
        </span>
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
          Reschedule
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Join Session
        </button>
      </div>
    </div>
  );
}

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('zoom');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [host, setHost] = useState('');
  
  const { createSession, loading, error } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const sessionTime = new Date(date);
    const [hours, minutes] = time.split(':');
    sessionTime.setHours(parseInt(hours), parseInt(minutes));

    await createSession({
      title,
      type,
      time: sessionTime.toISOString(),
      host,
      status: 'pending'
    });

    if (!error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-semibold mb-6">Create New Session</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="zoom">Zoom Call</option>
              <option value="in-person">In-Person</option>
              <option value="group">Group Session</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border border-gray-200 rounded-xl p-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SessionsSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { sessions, loading } = useStore();

  const mockSessions: Session[] = [
    {
      id: '1',
      title: 'Meeting',
      type: 'zoom call',
      time: '2025-03-16T14:00:00.000Z',
      host: 'Maud Blanc',
      status: 'confirmed',
      workspaceId: '1',
      tag: 'Pernety'
    },
    {
      id: '2',
      title: 'Kundalini Yoga',
      type: 'in-person',
      time: '2025-03-16T14:00:00.000Z',
      host: 'Carl Johnson',
      status: 'confirmed',
      workspaceId: '1',
      location: 'Room 5A',
      tag: 'Parodi'
    },
    {
      id: '3',
      title: 'Yoga mat (1)',
      type: 'in-person',
      time: '2025-03-16T14:00:00.000Z',
      host: 'Anne Lorem',
      status: 'pending',
      workspaceId: '1',
      location: '#Pernety St Name',
      tag: 'Plaza'
    }
  ];

  const todaySchedule = [
    { time: '9:00 AM', title: 'Team Meeting', type: 'meeting' },
    { time: '2:00 PM', title: 'Design Review', type: 'review' },
    { time: '4:30 PM', title: 'Client Workshop', type: 'workshop' }
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-1 max-w-md relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="zoom">Zoom Calls</option>
              <option value="in-person">In-Person</option>
              <option value="group">Group Sessions</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Create Session
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-6">Upcoming Sessions</h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {mockSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">March 2025</h3>
            <div className="grid grid-cols-7 gap-1 mb-2 text-sm">
              <div>SU</div>
              <div>MO</div>
              <div>TU</div>
              <div>WE</div>
              <div>TH</div>
              <div>FR</div>
              <div>SA</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {Array.from({ length: 31 }, (_, i) => (
                <button
                  key={i + 1}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${
                    i + 1 === 16 ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Today's Schedule</h2>
          <div className="space-y-6">
            {todaySchedule.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                  <div className="font-medium">{event.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateSessionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}