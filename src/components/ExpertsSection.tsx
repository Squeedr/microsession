import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Phone, Mail } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';

interface Expert {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  specializations: string[];
  languages: string[];
  status: 'online' | 'offline';
  avatar?: string;
}

function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <img
          src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=random`}
          alt={expert.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{expert.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              expert.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {expert.status}
            </div>
          </div>
          <p className="text-sm text-gray-500">{expert.title}</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{expert.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({expert.reviews} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>${expert.hourlyRate}/hour</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {expert.specializations.map((specialization, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            {specialization}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {expert.languages.map((language, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
          >
            {language}
          </span>
        ))}
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Book Session
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function ExpertsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const { experts, loading } = useStore();

  const mockExperts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      title: 'Wellness Coach & Yoga Instructor',
      rating: 4.9,
      reviews: 128,
      hourlyRate: 120,
      specializations: ['Yoga', 'Meditation', 'Stress Management'],
      languages: ['English', 'Spanish'],
      status: 'online'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Business Consultant',
      rating: 4.8,
      reviews: 95,
      hourlyRate: 150,
      specializations: ['Strategy', 'Marketing', 'Growth'],
      languages: ['English', 'Mandarin'],
      status: 'offline'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      title: 'Career Coach',
      rating: 4.7,
      reviews: 73,
      hourlyRate: 100,
      specializations: ['Career Development', 'Leadership', 'Public Speaking'],
      languages: ['English', 'French'],
      status: 'online'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1 max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {mockExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}
    </div>
  );
}