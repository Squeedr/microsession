import React, { useState } from 'react';
import { Search, Filter, PlusCircle, Calendar, Percent, Package, Tag, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

interface Offer {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'percentage' | 'bundle';
  originalPrice: number;
  discountedPrice: number;
  sessions: string[];
  startDate: string;
  endDate: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  status: 'active' | 'inactive';
}

function OfferCard({ offer }: { offer: Offer }) {
  const getDiscountBadge = () => {
    switch (offer.type) {
      case 'fixed':
        return `Save $${offer.originalPrice - offer.discountedPrice}`;
      case 'percentage':
        const percentage = Math.round((1 - offer.discountedPrice / offer.originalPrice) * 100);
        return `${percentage}% Off`;
      case 'bundle':
        return 'Bundle Deal';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{offer.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {offer.status}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Original Price</span>
          <span className="line-through">${offer.originalPrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Discounted Price</span>
          <span className="font-medium text-green-600">${offer.discountedPrice}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {getDiscountBadge()}
        </span>
        {offer.maxRedemptions && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {offer.currentRedemptions}/{offer.maxRedemptions} used
          </span>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Valid: {format(new Date(offer.startDate), 'MMM d, yyyy')} - {format(new Date(offer.endDate), 'MMM d, yyyy')}
      </div>

      <div className="flex items-center space-x-3 mt-6">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Edit Offer
        </button>
        <button className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
          Deactivate
        </button>
      </div>
    </div>
  );
}

function CreateOfferModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'fixed' | 'percentage' | 'bundle'>('fixed');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [maxRedemptions, setMaxRedemptions] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle offer creation
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Create New Offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType('fixed')}
                className={`p-4 rounded-xl border ${
                  type === 'fixed' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2`}
              >
                <Tag className="w-6 h-6" />
                <span>Fixed Amount</span>
              </button>
              <button
                type="button"
                onClick={() => setType('percentage')}
                className={`p-4 rounded-xl border ${
                  type === 'percentage' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2`}
              >
                <Percent className="w-6 h-6" />
                <span>Percentage</span>
              </button>
              <button
                type="button"
                onClick={() => setType('bundle')}
                className={`p-4 rounded-xl border ${
                  type === 'bundle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2`}
              >
                <Package className="w-6 h-6" />
                <span>Bundle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {type === 'percentage' ? '%' : '$'}
                </span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <button
                type="button"
                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-left flex items-center justify-between"
              >
                <span>{format(startDate, 'MMM d, yyyy')}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
              {showStartDatePicker && (
                <div className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <DayPicker
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setShowStartDatePicker(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <button
                type="button"
                onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-left flex items-center justify-between"
              >
                <span>{format(endDate, 'MMM d, yyyy')}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
              {showEndDatePicker && (
                <div className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <DayPicker
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                        setShowEndDatePicker(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Redemptions (Optional)
            </label>
            <input
              type="number"
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave empty for unlimited"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function OffersSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading } = useStore();

  const mockOffers: Offer[] = [
    {
      id: '1',
      name: 'Early Bird Special',
      description: 'Get 20% off on all morning yoga sessions',
      type: 'percentage',
      originalPrice: 100,
      discountedPrice: 80,
      sessions: ['1', '2'],
      startDate: '2025-03-16',
      endDate: '2025-04-16',
      maxRedemptions: 50,
      currentRedemptions: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Business Consultation Bundle',
      description: '3 sessions for the price of 2',
      type: 'bundle',
      originalPrice: 300,
      discountedPrice: 200,
      sessions: ['3', '4', '5'],
      startDate: '2025-03-16',
      endDate: '2025-05-16',
      currentRedemptions: 5,
      status: 'active'
    },
    {
      id: '3',
      name: 'New Year Special',
      description: 'Flat $50 off on all wellness sessions',
      type: 'fixed',
      originalPrice: 150,
      discountedPrice: 100,
      sessions: ['6', '7'],
      startDate: '2025-03-16',
      endDate: '2025-03-31',
      maxRedemptions: 100,
      currentRedemptions: 45,
      status: 'inactive'
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
              placeholder="Search offers..."
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Offer</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {mockOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateOfferModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}