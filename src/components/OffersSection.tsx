import React, { useState } from 'react';
import { Search, Filter, PlusCircle, Calendar, Percent, Package, Tag, X, AlertCircle, ChevronDown, DollarSign, Clock, Users2 } from 'lucide-react';
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
  applicableTo: 'sessions' | 'resources' | 'both';
  startDate: string;
  endDate: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  status: 'active' | 'expired' | 'draft';
  category?: string;
}

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  offerName: string;
}

function DeleteConfirmationModal({ onClose, onConfirm, offerName }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Delete Offer</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{offerName}"? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
          >
            Delete Offer
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferModal({ offer, onClose }: { offer?: Offer; onClose: () => void }) {
  const [name, setName] = useState(offer?.name || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [type, setType] = useState<'fixed' | 'percentage' | 'bundle'>(offer?.type || 'fixed');
  const [originalPrice, setOriginalPrice] = useState(offer?.originalPrice.toString() || '');
  const [discountValue, setDiscountValue] = useState('');
  const [applicableTo, setApplicableTo] = useState<'sessions' | 'resources' | 'both'>(
    offer?.applicableTo || 'both'
  );
  const [startDate, setStartDate] = useState<Date>(
    offer ? new Date(offer.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    offer ? new Date(offer.endDate) : new Date()
  );
  const [maxRedemptions, setMaxRedemptions] = useState(
    offer?.maxRedemptions?.toString() || ''
  );
  const [status, setStatus] = useState<'active' | 'draft'>(
    offer?.status === 'expired' ? 'draft' : (offer?.status || 'draft')
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [category, setCategory] = useState(offer?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle offer creation/update
    onClose();
  };

  const calculateDiscountedPrice = () => {
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountValue);
    if (isNaN(original) || isNaN(discount)) return '';
    
    switch (type) {
      case 'fixed':
        return (original - discount).toFixed(2);
      case 'percentage':
        return (original * (1 - discount / 100)).toFixed(2);
      case 'bundle':
        return (original * (1 - discount / 100)).toFixed(2);
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {offer ? 'Edit Offer' : 'Create New Offer'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
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
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                } flex flex-col items-center space-y-2 transition-colors duration-200`}
              >
                <DollarSign className="w-6 h-6" />
                <span>Fixed Amount</span>
              </button>
              <button
                type="button"
                onClick={() => setType('percentage')}
                className={`p-4 rounded-xl border ${
                  type === 'percentage' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2 transition-colors duration-200`}
              >
                <Percent className="w-6 h-6" />
                <span>Percentage</span>
              </button>
              <button
                type="button"
                onClick={() => setType('bundle')}
                className={`p-4 rounded-xl border ${
                  type === 'bundle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center space-y-2 transition-colors duration-200`}
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
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Price
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-lg font-medium">
              ${calculateDiscountedPrice() || '0.00'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable To
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={applicableTo === 'sessions'}
                  onChange={() => setApplicableTo('sessions')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Sessions Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={applicableTo === 'resources'}
                  onChange={() => setApplicableTo('resources')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Resources Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={applicableTo === 'both'}
                  onChange={() => setApplicableTo('both')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Both</span>
              </label>
            </div>
          </div>

          {applicableTo !== 'both' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Category (Optional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={`Enter ${applicableTo === 'sessions' ? 'session' : 'resource'} category`}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <button
                type="button"
                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors duration-200"
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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <button
                type="button"
                onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors duration-200"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Redemptions (Optional)
            </label>
            <input
              type="number"
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              placeholder="Leave empty for unlimited"
            />
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
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              {offer ? 'Save Changes' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OfferCard({ offer, onEdit, onDelete }: { offer: Offer; onEdit: () => void; onDelete: () => void }) {
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

  const getStatusColor = () => {
    switch (offer.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (offer.type) {
      case 'fixed':
        return <DollarSign className="w-6 h-6" />;
      case 'percentage':
        return <Percent className="w-6 h-6" />;
      case 'bundle':
        return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{offer.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
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

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {getDiscountBadge()}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {offer.applicableTo === 'both' ? 'All Items' : 
           offer.applicableTo === 'sessions' ? 'Sessions Only' : 'Resources Only'}
        </span>
        {offer.category && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {offer.category}
          </span>
        )}
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
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Edit Offer
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function OffersSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>();
  const [offerToDelete, setOfferToDelete] = useState<Offer | undefined>();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'discount' | 'redemptions'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { loading } = useStore();

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowCreateModal(true);
  };

  const handleDelete = (offer: Offer) => {
    setOfferToDelete(offer);
  };

  const confirmDelete = async () => {
    if (offerToDelete) {
      // Handle delete
      setOfferToDelete(undefined);
    }
  };

  const mockOffers: Offer[] = [
    {
      id: '1',
      name: 'Early Bird Special',
      description: 'Get 20% off on all morning yoga sessions',
      type: 'percentage',
      originalPrice: 100,
      discountedPrice: 80,
      applicableTo: 'sessions',
      startDate: '2025-03-16',
      endDate: '2025-04-16',
      maxRedemptions: 50,
      currentRedemptions: 12,
      status: 'active',
      category: 'Yoga'
    },
    {
      id: '2',
      name: 'Business Consultation Bundle',
      description: '3 sessions for the price of 2',
      type: 'bundle',
      originalPrice: 300,
      discountedPrice: 200,
      applicableTo: 'sessions',
      startDate: '2025-03-16',
      endDate: '2025-05-16',
      currentRedemptions: 5,
      status: 'active',
      category: 'Business'
    },
    {
      id: '3',
      name: 'New Year Special',
      description: 'Flat $50 off on all wellness sessions',
      type: 'fixed',
      originalPrice: 150,
      discountedPrice: 100,
      applicableTo: 'both',
      startDate: '2025-03-16',
      endDate: '2025-03-31',
      maxRedemptions: 100,
      currentRedemptions: 45,
      status: 'expired'
    },
    {
      id: '4',
      name: 'Summer Wellness Package',
      description: '25% off on all wellness resources',
      type: 'percentage',
      originalPrice: 200,
      discountedPrice: 150,
      applicableTo: 'resources',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      status: 'draft',
      category: 'Wellness'
    }
  ];

  const filteredOffers = mockOffers
    .filter(offer => {
      const matchesSearch = offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          offer.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
      const matchesType = filterType === 'all' || offer.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case 'discount':
          const aDiscount = a.originalPrice - a.discountedPrice;
          const bDiscount = b.originalPrice - b.discountedPrice;
          comparison = aDiscount - bDiscount;
          break;
        case 'redemptions':
          comparison = (a.currentRedemptions || 0) - (b.currentRedemptions || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

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
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="all">All Types</option>
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
            <option value="bundle">Bundle</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="discount-desc">Highest Discount</option>
            <option value="discount-asc">Lowest Discount</option>
            <option value="redemptions-desc">Most Used</option>
            <option value="redemptions-asc">Least Used</option>
          </select>
        </div>
        <button
          onClick={() => {
            setSelectedOffer(undefined);
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Offer</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={() => handleEdit(offer)}
              onDelete={() => handleDelete(offer)}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <OfferModal
          offer={selectedOffer}
          onClose={() => {
            setSelectedOffer(undefined);
            setShowCreateModal(false);
          }}
        />
      )}

      {offerToDelete && (
        <DeleteConfirmationModal
          offerName={offerToDelete.name}
          onClose={() => setOfferToDelete(undefined)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}