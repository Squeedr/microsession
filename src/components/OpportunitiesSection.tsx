import React, { useState } from 'react';
import { Flame, TrendingUp, BarChart2, Users, PlusCircle, X, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendingSession {
  id: string;
  type: string;
  bookings: number;
  growth: number;
  category: string;
}

interface AddSpotModalProps {
  session: TrendingSession;
  onClose: () => void;
}

function AddSpotModal({ session, onClose }: AddSpotModalProps) {
  const [spots, setSpots] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle adding spots
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Add Spots for {session.type}</h2>
            <p className="text-sm text-gray-500 mt-1">
              High demand detected - add more availability
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Spots
            </label>
            <input
              type="number"
              min="1"
              value={spots}
              onChange={(e) => setSpots(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                required
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Session
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Add Spots
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TrendingSessionCard({ session }: { session: TrendingSession }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{session.type}</h3>
            <p className="text-sm text-gray-500">{session.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">+{session.growth}%</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="text-sm text-gray-500">Today's Bookings</div>
        <div className="text-2xl font-semibold mt-1">{session.bookings}</div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Open and Add Spot</span>
      </button>

      {showModal && (
        <AddSpotModal session={session} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function AnalyticsCard({ title, data, icon: Icon, description }: { 
  title: string; 
  data: any[]; 
  icon: React.ElementType;
  description: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-gray-700 font-medium">{title}</h3>
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            {showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg z-10">
                {description}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 transform rotate-45" />
              </div>
            )}
          </div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '0.75rem'
              }}
              formatter={(value: number) => [`${value} ${title.includes('Spots') ? 'spots' : 'bookings'}`, '']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OpportunitiesSection() {
  const trendingSessions: TrendingSession[] = [
    {
      id: '1',
      type: 'Digital Yoga',
      bookings: 12,
      growth: 25,
      category: 'Wellness'
    },
    {
      id: '2',
      type: 'Career Coaching',
      bookings: 8,
      growth: 15,
      category: 'Professional'
    },
    {
      id: '3',
      type: 'Language Practice',
      bookings: 15,
      growth: 30,
      category: 'Learning'
    }
  ];

  const spotsData = [
    { name: 'Mon', value: 48 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 45 },
    { name: 'Thu', value: 56 },
    { name: 'Fri', value: 50 },
    { name: 'Sat', value: 42 },
    { name: 'Sun', value: 38 }
  ];

  const bookingsData = [
    { name: 'Mon', value: 156 },
    { name: 'Tue', value: 142 },
    { name: 'Wed', value: 164 },
    { name: 'Thu', value: 148 },
    { name: 'Fri', value: 152 },
    { name: 'Sat', value: 134 },
    { name: 'Sun', value: 128 }
  ];

  return (
    <div className="space-y-8 lg:space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-6 lg:mb-8">Trending Opportunities This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {trendingSessions.map((session) => (
            <TrendingSessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 lg:mb-8">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <AnalyticsCard
            title="Daily Spots Availability"
            data={spotsData}
            icon={BarChart2}
            description="Track available session spots throughout the week"
          />
          <AnalyticsCard
            title="Daily Bookings"
            data={bookingsData}
            icon={Users}
            description="Monitor the number of daily session bookings"
          />
        </div>
      </div>
    </div>
  );
}