import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Video, Users2, Clock, X, MapPin, DollarSign, History, Download, Filter, PlusCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';
import { Calendar } from './Calendar';

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
  capacity?: number;
  duration?: number;
  price?: number;
  attendees?: number;
  revenue?: number;
}

interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  type: 'all' | 'online' | 'in-person';
  status: 'all' | 'confirmed' | 'pending' | 'cancelled';
}

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('online');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('30');
  const [capacity, setCapacity] = useState('10');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeatSession, setRepeatSession] = useState(false);
  
  const { user, createSession, loading, error } = useStore();

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
      host: user?.email || '',
      status: 'pending',
      duration: parseInt(duration),
      capacity: parseInt(capacity),
      location,
      price: parseFloat(price)
    });

    if (!error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Create New Session</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

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
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('online')}
                className={`p-4 rounded-xl border ${
                  type === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2 transition-colors duration-200`}
              >
                <Video className="w-6 h-6" />
                <span>Online Meeting</span>
              </button>
              <button
                type="button"
                onClick={() => setType('in-person')}
                className={`p-4 rounded-xl border ${
                  type === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2 transition-colors duration-200`}
              >
                <Users2 className="w-6 h-6" />
                <span>In-Person</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors duration-200"
              >
                <span>{date ? format(date, 'MMM d, yyyy') : 'Select date'}</span>
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </button>
              {showDatePicker && (
                <div className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setShowDatePicker(false);
                      }
                    }}
                    className="border-0"
                    modifiersStyles={{
                      selected: {
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '0.75rem'
                      },
                      today: {
                        backgroundColor: '#eff6ff',
                        borderRadius: '0.75rem'
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                required
              />
            </div>
          </div>

          {type === 'in-person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="Enter location details"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="manual">Manual Payment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={repeatSession}
                onChange={(e) => setRepeatSession(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Repeat Session</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Save as Draft</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Publish Now</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating...' : status === 'draft' ? 'Save Draft' : 'Publish Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterModal({ onClose, filters, onApply }: { 
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filter Sessions</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={localFilters.dateRange}
              onChange={(e) => setLocalFilters({ ...localFilters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <select
              value={localFilters.type}
              onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value as FilterOptions['type'] })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="online">Online</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(localFilters);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const getSessionIcon = () => {
    switch (session.type.toLowerCase()) {
      case 'online':
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
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 transition-colors duration-200 hover:border-gray-300">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getSessionIcon()}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{session.title}</h3>
          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mt-1">
            <span>{format(new Date(session.time), 'HH:mm')}</span>
            {session.location && (
              <div className="flex items-center">
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{session.location}</span>
              </div>
            )}
            {session.duration && (
              <div className="flex items-center">
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{session.duration} min</span>
              </div>
            )}
            {session.capacity && (
              <div className="flex items-center">
                <span className="mx-2">•</span>
                <Users2 className="w-4 h-4 mr-1" />
                <span>{session.capacity} spots</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            with {session.host}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {session.price && session.price > 0 && (
          <div className="flex items-center text-gray-900 font-medium">
            <DollarSign className="w-4 h-4 mr-1" />
            {session.price}
          </div>
        )}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {session.status}
        </span>
        {session.revenue && (
          <div className="flex items-center text-green-600 font-medium">
            <DollarSign className="w-4 h-4 mr-1" />
            {session.revenue}
          </div>
        )}
        {session.attendees && (
          <div className="flex items-center text-gray-600">
            <Users2 className="w-4 h-4 mr-1" />
            {session.attendees}
          </div>
        )}
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function SessionsSection() {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'week',
    type: 'all',
    status: 'all'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { sessions, loading } = useStore();

  const mockSessions: Session[] = [
    {
      id: '1',
      title: 'Morning Yoga Session',
      type: 'online',
      time: '2025-03-16T08:00:00.000Z',
      host: 'Sarah Wilson',
      status: 'confirmed',
      workspaceId: '1',
      duration: 60,
      capacity: 20,
      price: 25,
      attendees: 18,
      revenue: 450
    },
    {
      id: '2',
      title: 'Business Strategy Workshop',
      type: 'in-person',
      time: '2025-03-16T14:00:00.000Z',
      host: 'Michael Chen',
      status: 'confirmed',
      workspaceId: '1',
      location: 'Conference Room A',
      duration: 120,
      capacity: 15,
      price: 150,
      attendees: 12,
      revenue: 1800
    },
    {
      id: '3',
      title: 'Career Coaching Session',
      type: 'online',
      time: '2025-03-16T16:00:00.000Z',
      host: 'Emma Thompson',
      status: 'pending',
      workspaceId: '1',
      duration: 45,
      capacity: 1,
      price: 75
    }
  ];

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.host.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === 'all' || session.type.toLowerCase() === filters.type;
    const matchesStatus = filters.status === 'all' || session.status === filters.status;
    const isUpcoming = new Date(session.time) > new Date();
    return matchesSearch && matchesType && matchesStatus && (view === 'upcoming' ? isUpcoming : !isUpcoming);
  });

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + (session.revenue || 0), 0);
  const totalAttendees = filteredSessions.reduce((sum, session) => sum + (session.attendees || 0), 0);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Title', 'Host', 'Type', 'Status', 'Attendees', 'Revenue'],
      ...filteredSessions.map(session => [
        format(new Date(session.time), 'yyyy-MM-dd HH:mm'),
        session.title,
        session.host,
        session.type,
        session.status,
        session.attendees || 0,
        session.revenue || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessions-${view}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView('upcoming')}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                view === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-5 h-5 inline-block mr-2" />
              Upcoming
            </button>
            <button
              onClick={() => setView('past')}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                view === 'past' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5 inline-block mr-2" />
              Past
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {view === 'past' && (
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Session</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {view === 'past' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Sessions</div>
              <div className="text-2xl font-semibold mt-1">{filteredSessions.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Attendees</div>
              <div className="text-2xl font-semibold mt-1">{totalAttendees}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-2xl font-semibold mt-1">${totalRevenue}</div>
            </div>
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
            {filteredSessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No sessions found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Today's Schedule</h2>
          <div className="space-y-6">
            {mockSessions.map((session, index) => (
              <div key={session.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(session.time), 'HH:mm')}
                  </div>
                  <div className="font-medium">{session.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFilterModal && (
        <FilterModal
          filters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilterModal(false);
          }}
        />
      )}

      {showCreateModal && (
        <CreateSessionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export { SessionsSection }