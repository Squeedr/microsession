import React, { useState } from 'react';
import { Search, Filter, PlusCircle, Grid, List, ArrowUpDown, X, Upload, ImageIcon, Edit3, Trash2, AlertCircle, DollarSign, Package, Tag, Link, Globe, ChevronDown } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';

interface Resource {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  available: number;
  total: number;
  image: string;
  status: 'active' | 'inactive';
  category: string;
  createdAt: string;
  externalStore?: {
    type: 'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'custom';
    url: string;
    connected: boolean;
  };
}

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  resourceName: string;
}

interface ExternalStoreConfig {
  type: 'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'custom';
  label: string;
  icon: React.ElementType;
  connectUrl?: string;
}

const StoreIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <Icon className="w-5 h-5 text-gray-500" />
);

const externalStores: ExternalStoreConfig[] = [
  {
    type: 'shopify',
    label: 'Shopify',
    icon: Globe,
    connectUrl: 'https://shopify.com/oauth'
  },
  {
    type: 'woocommerce',
    label: 'WooCommerce',
    icon: Globe,
    connectUrl: 'https://woocommerce.com/oauth'
  },
  {
    type: 'etsy',
    label: 'Etsy',
    icon: Globe,
    connectUrl: 'https://etsy.com/oauth'
  },
  {
    type: 'amazon',
    label: 'Amazon',
    icon: Globe,
    connectUrl: 'https://amazon.com/oauth'
  },
  {
    type: 'custom',
    label: 'Custom URL',
    icon: Link
  }
];

function DeleteConfirmationModal({ onClose, onConfirm, resourceName }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Delete Resource</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{resourceName}"? This action cannot be undone.
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
            Delete Resource
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceModal({ resource, onClose }: { resource?: Resource; onClose: () => void }) {
  const [name, setName] = useState(resource?.name || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [price, setPrice] = useState(resource?.price.toString() || '');
  const [unit, setUnit] = useState(resource?.unit || 'item');
  const [available, setAvailable] = useState(resource?.available.toString() || '');
  const [total, setTotal] = useState(resource?.total.toString() || '');
  const [image, setImage] = useState(resource?.image || '');
  const [category, setCategory] = useState(resource?.category || 'equipment');
  const [status, setStatus] = useState<'active' | 'inactive'>(resource?.status || 'active');
  const [useExternalStore, setUseExternalStore] = useState(!!resource?.externalStore);
  const [externalStoreType, setExternalStoreType] = useState<ExternalStoreConfig['type']>(
    resource?.externalStore?.type || 'custom'
  );
  const [externalStoreUrl, setExternalStoreUrl] = useState(resource?.externalStore?.url || '');
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle resource creation/update with external store data
    onClose();
  };

  const handleConnectStore = (storeType: ExternalStoreConfig['type']) => {
    const store = externalStores.find(s => s.type === storeType);
    if (store?.connectUrl) {
      // Handle OAuth flow
      window.open(store.connectUrl, '_blank');
    }
    setExternalStoreType(storeType);
    setShowStoreDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Name
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
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="equipment">Equipment</option>
              <option value="digital">Digital Download</option>
              <option value="coaching">Coaching Materials</option>
              <option value="merchandise">Merchandise</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
              <input
                type="checkbox"
                checked={useExternalStore}
                onChange={(e) => setUseExternalStore(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Sell via External Store</span>
            </label>

            {useExternalStore && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Platform
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                    className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <StoreIcon icon={externalStores.find(s => s.type === externalStoreType)?.icon || Globe} />
                      <span>{externalStores.find(s => s.type === externalStoreType)?.label}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showStoreDropdown ? 'transform rotate-180' : ''
                    }`} />
                  </button>

                  {showStoreDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg">
                      {externalStores.map((store) => (
                        <button
                          key={store.type}
                          type="button"
                          onClick={() => handleConnectStore(store.type)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-200"
                        >
                          <StoreIcon icon={store.icon} />
                          <span>{store.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL
                  </label>
                  <input
                    type="url"
                    value={externalStoreUrl}
                    onChange={(e) => setExternalStoreUrl(e.target.value)}
                    placeholder="https://your-store.com/product"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    required={useExternalStore}
                  />
                </div>
              </div>
            )}
          </div>

          {!useExternalStore && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <option value="item">Per Item</option>
                    <option value="license">Per License</option>
                    <option value="download">Per Download</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
              <button
                type="button"
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Published</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Draft</span>
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
              {resource ? 'Save Changes' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResourceCard({ resource, onEdit, onDelete }: { resource: Resource; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors duration-200">
      <div className="aspect-video relative">
        <img
          src={resource.image || 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80'}
          alt={resource.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          resource.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {resource.status === 'active' ? 'Published' : 'Draft'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {resource.category}
          </span>
          {resource.externalStore && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{resource.externalStore.type}</span>
            </span>
          )}
        </div>
        <h3 className="font-medium text-gray-900 mt-2">{resource.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
        
        {resource.externalStore ? (
          <a
            href={resource.externalStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Globe className="w-4 h-4" />
            <span>Buy on {resource.externalStore.type}</span>
          </a>
        ) : (
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="font-medium">${resource.price}/{resource.unit}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Available</div>
              <div className="font-medium">{resource.available}/{resource.total}</div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-gray-200 text-red-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResourcesSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>();
  const [resourceToDelete, setResourceToDelete] = useState<Resource | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'available'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { resources, loading, deleteResource } = useStore();

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setShowModal(true);
  };

  const handleDelete = (resource: Resource) => {
    setResourceToDelete(resource);
  };

  const confirmDelete = async () => {
    if (resourceToDelete) {
      await deleteResource(resourceToDelete.id);
      setResourceToDelete(undefined);
    }
  };

  const mockResources: Resource[] = [
    {
      id: '1',
      name: 'Yoga Mat',
      description: 'Premium non-slip yoga mat with carrying strap',
      price: 29.99,
      unit: 'item',
      available: 45,
      total: 50,
      image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      category: 'equipment',
      createdAt: '2025-03-16T12:00:00Z'
    },
    {
      id: '2',
      name: 'Meditation Cushion',
      description: 'Comfortable zafu meditation cushion',
      price: 39.99,
      unit: 'item',
      available: 25,
      total: 30,
      image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      category: 'equipment',
      createdAt: '2025-03-16T12:00:00Z',
      externalStore: {
        type: 'shopify',
        url: 'https://your-store.myshopify.com/products/meditation-cushion',
        connected: true
      }
    },
    {
      id: '3',
      name: 'Wellness Guide',
      description: 'Digital guide for mindful living',
      price: 19.99,
      unit: 'download',
      available: 100,
      total: 100,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      status: 'inactive',
      category: 'digital',
      createdAt: '2025-03-16T12:00:00Z',
      externalStore: {
        type: 'etsy',
        url: 'https://www.etsy.com/listing/123456/wellness-guide',
        connected: true
      }
    }
  ];

  const filteredResources = mockResources
    .filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'available':
          comparison = a.available - b.available;
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
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="all">All Categories</option>
            <option value="equipment">Equipment</option>
            <option value="digital">Digital Downloads</option>
            <option value="coaching">Coaching Materials</option>
            <option value="merchandise">Merchandise</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Published</option>
            <option value="inactive">Draft</option>
          </select>
          <div className="relative">
            <button
              onClick={() => {
                if (sortBy === 'name') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('name');
                  setSortOrder('asc');
                }
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span>Sort</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedResource(undefined);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={() => handleEdit(resource)}
              onDelete={() => handleDelete(resource)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => {
            setSelectedResource(undefined);
            setShowModal(false);
          }}
        />
      )}

      {resourceToDelete && (
        <DeleteConfirmationModal
          resourceName={resourceToDelete.name}
          onClose={() => setResourceToDelete(undefined)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}