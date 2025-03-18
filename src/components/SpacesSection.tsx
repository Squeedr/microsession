import React, { useState } from 'react';
import { Search, Filter, PlusCircle, MapPin, Users2, Star, X, Upload, Clock, Calendar, DollarSign, ChevronDown, ChevronRight, History, Edit3, Trash2, Download, TrendingUp, CheckCircle, XCircle, MessageSquare, Grid, List } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from 'date-fns';

interface Space {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: 'published' | 'unpublished';
  totalRevenue?: number;
  totalBookings?: number;
}

interface Booking {
  id: string;
  spaceId: string;
  customerId: string;
  customerName: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  notes?: string;
  guestRequests?: string[];
}

interface DashboardStats {
  totalActiveBookings: number;
  totalPastBookings: number;
  revenueLastMonth: number;
  upcomingCheckIns: number;
  upcomingCheckOuts: number;
  totalRevenue: number;
  totalSpaces: number;
  occupancyRate: number;
}

function DashboardOverview() {
  const stats: DashboardStats = {
    totalActiveBookings: 24,
    totalPastBookings: 156,
    revenueLastMonth: 4500,
    upcomingCheckIns: 8,
    upcomingCheckOuts: 6,
    totalRevenue: 12500,
    totalSpaces: 12,
    occupancyRate: 75
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-6">
        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-600">Active Bookings</div>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold mt-2">{stats.totalActiveBookings}</div>
          <div className="text-sm text-blue-600 mt-1">
            {stats.upcomingCheckIns} check-ins today
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-green-600">Monthly Revenue</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-semibold mt-2">${stats.revenueLastMonth}</div>
          <div className="text-sm text-green-600 mt-1">
            ${stats.totalRevenue} total revenue
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-purple-600">Past Bookings</div>
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-semibold mt-2">{stats.totalPastBookings}</div>
          <div className="text-sm text-purple-600 mt-1">
            {stats.upcomingCheckOuts} check-outs today
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-600">Occupancy Rate</div>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-semibold mt-2">{stats.occupancyRate}%</div>
          <div className="text-sm text-orange-600 mt-1">
            {stats.totalSpaces} total spaces
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingSummary({ bookings, view }: { bookings: Booking[]; view: 'upcoming' | 'past' }) {
  const filteredBookings = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.startTime);
      const now = new Date();
      return view === 'upcoming' ? bookingDate > now : bookingDate <= now;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  const totalRevenue = bookings
    .filter(booking => view === 'past' && booking.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">
          {view === 'upcoming' ? 'Next Bookings' : 'Past Bookings'}
        </div>
        {view === 'past' && (
          <div className="text-sm font-medium text-green-600">
            Total Revenue: ${totalRevenue}
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex-none w-64 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium truncate">{booking.customerName}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(booking.startTime), 'MMM d, HH:mm')}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="font-medium">${booking.totalAmount}</div>
              <div className={`text-xs ${
                booking.paymentStatus === 'paid' ? 'text-green-600' :
                booking.paymentStatus === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {booking.paymentStatus}
              </div>
            </div>
            {booking.guestRequests && booking.guestRequests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {booking.guestRequests.map((request, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {request}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center space-x-2 mt-3">
              {booking.status === 'pending' && (
                <button className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                  Confirm
                </button>
              )}
              <button className="flex-1 px-2 py-1 border border-gray-200 text-xs rounded-lg hover:bg-gray-50">
                Message
              </button>
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button className="flex-1 px-2 py-1 text-red-600 border border-red-200 text-xs rounded-lg hover:bg-red-50">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredBookings.length === 0 && (
          <div className="text-sm text-gray-500">
            No {view} bookings yet – Promote your space!
          </div>
        )}
      </div>
    </div>
  );
}

function SpaceCard({ space, onEdit, onDelete }: { space: Space; onEdit: () => void; onDelete: () => void }) {
  const [showBookings, setShowBookings] = useState(false);
  const [bookingView, setBookingView] = useState<'upcoming' | 'past'>('upcoming');

  const mockBookings: Booking[] = [
    {
      id: '1',
      spaceId: space.id,
      customerId: 'user1',
      customerName: 'John Smith',
      startTime: '2025-03-16T10:00:00Z',
      endTime: '2025-03-16T12:00:00Z',
      status: 'confirmed',
      totalAmount: 150,
      paymentStatus: 'paid',
      notes: 'Requires projector setup',
      guestRequests: ['Projector', 'Whiteboard']
    },
    {
      id: '2',
      spaceId: space.id,
      customerId: 'user2',
      customerName: 'Emma Johnson',
      startTime: '2025-03-17T14:00:00Z',
      endTime: '2025-03-17T16:00:00Z',
      status: 'pending',
      totalAmount: 150,
      paymentStatus: 'pending',
      notes: 'Will bring own equipment',
      guestRequests: ['Extra Chairs']
    }
  ];

  const handleExport = () => {
    const bookings = mockBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      const now = new Date();
      return bookingView === 'upcoming' ? bookingDate > now : bookingDate <= now;
    });

    const csvContent = [
      ['Date', 'Customer', 'Status', 'Amount', 'Payment Status', 'Notes'],
      ...bookings.map(booking => [
        format(new Date(booking.startTime), 'yyyy-MM-dd HH:mm'),
        booking.customerName,
        booking.status,
        booking.totalAmount,
        booking.paymentStatus,
        booking.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${space.name}-${bookingView}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-hover transition-all duration-200">
      <div className="aspect-[3/2] relative">
        <img
          src={space.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
          alt={space.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          space.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {space.status}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 truncate text-sm">{space.name}</h3>
          <div className="text-sm font-semibold text-green-600">
            ${space.totalRevenue || 0}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{space.location}</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center space-x-1">
            <Users2 className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">{space.capacity}</span>
          </div>
          <div className="font-medium">${space.price}/hr</div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {space.amenities.slice(0, 2).map((amenity, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {space.amenities.length > 2 && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{space.amenities.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 mt-3">
          <button
            onClick={() => setShowBookings(!showBookings)}
            className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs flex items-center justify-center space-x-1"
          >
            <Calendar className="w-3 h-3" />
            <span>{showBookings ? 'Hide' : 'View'} Bookings</span>
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="Edit Space"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
            title="Delete Space"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showBookings && (
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBookingView('upcoming')}
                className={`px-2 py-1 rounded-lg text-xs transition-colors duration-200 ${
                  bookingView === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setBookingView('past')}
                className={`px-2 py-1 rounded-lg text-xs transition-colors duration-200 ${
                  bookingView === 'past' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Past
              </button>
            </div>
            <button
              onClick={handleExport}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Export Bookings"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>

          <BookingSummary bookings={mockBookings} view={bookingView} />

          <button
            onClick={() => {
              // Handle view all
            }}
            className="w-full mt-3 px-2 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

interface FilterOptions {
  status: 'all' | 'published' | 'unpublished';
  capacity: 'all' | 'small' | 'medium' | 'large';
  priceRange: 'all' | 'budget' | 'mid' | 'premium';
}

export function SpacesSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    capacity: 'all',
    priceRange: 'all'
  });
  const { spaces, loading } = useStore();

  const mockSpaces: Space[] = [
    {
      id: '1',
      name: 'Creative Studio',
      description: 'A bright and spacious studio perfect for creative work',
      location: 'Floor 2, Building A',
      price: 75,
      capacity: 8,
      amenities: ['Natural Light', 'Whiteboard', 'TV Screen', 'Coffee Machine'],
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
      status: 'published',
      totalRevenue: 1200,
      totalBookings: 16
    },
    {
      id: '2',
      name: 'Meeting Room 101',
      description: 'Professional meeting room with modern amenities',
      location: 'Floor 1, Building B',
      price: 50,
      capacity: 6,
      amenities: ['Projector', 'Video Conference', 'Whiteboard'],
      images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80'],
      status: 'published',
      totalRevenue: 800,
      totalBookings: 10
    }
  ];

  const filteredSpaces = mockSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || space.status === filters.status;
    const matchesCapacity = filters.capacity === 'all' ||
                          (filters.capacity === 'small' && space.capacity <= 4) ||
                          (filters.capacity === 'medium' && space.capacity > 4 && space.capacity <= 10) ||
                          (filters.capacity === 'large' && space.capacity > 10);
    const matchesPriceRange = filters.priceRange === 'all' ||
                            (filters.priceRange === 'budget' && space.price <= 50) ||
                            (filters.priceRange === 'mid' && space.price > 50 && space.price <= 100) ||
                            (filters.priceRange === 'premium' && space.price > 100);
    
    return matchesSearch && matchesStatus && matchesCapacity && matchesPriceRange;
  });

  return (
    <div className="space-y-6">
      <DashboardOverview />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1 max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
          <select
            value={filters.capacity}
            onChange={(e) => setFilters({ ...filters, capacity: e.target.value as FilterOptions['capacity'] })}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sizes</option>
            <option value="small">Small (1-4)</option>
            <option value="medium">Medium (5-10)</option>
            <option value="large">Large (10+)</option>
          </select>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value as FilterOptions['priceRange'] })}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget ($0-50)</option>
            <option value="mid">Mid ($51-100)</option>
            <option value="premium">Premium ($100+)</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Space</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-4'}>
          {filteredSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onEdit={() => {
                // Handle edit
              }}
              onDelete={() => {
                // Handle delete
              }}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateSpaceModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}