import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, CreditCard, Shield, Eye, Trash2, Camera, X, Check, AlertCircle, Ban as Bank, DollarSign, ChevronRight, Globe, MessageSquare, Calendar, Tag, Smartphone, Key, LogOut } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const settingsTabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payment', label: 'Payment & Payouts', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield }
];

function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('Sarah Wilson');
  const [email, setEmail] = useState('sarah@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [bio, setBio] = useState('Wellness Coach & Yoga Instructor with 5+ years of experience');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80');

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
              <Camera className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div>
            <h4 className="font-medium">Upload new picture</h4>
            <p className="text-sm text-gray-500 mt-1">
              JPG, GIF or PNG. Max size of 5MB.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function PaymentSettings() {
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card1');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods = [
    {
      id: 'card1',
      type: 'visa',
      last4: '4242',
      expiry: '12/25'
    },
    {
      id: 'card2',
      type: 'mastercard',
      last4: '8888',
      expiry: '09/24'
    }
  ];

  const handleSaveCard = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setShowAddCard(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-xl flex items-center justify-between transition-colors duration-200 ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                  </div>
                  <div className="text-sm text-gray-500">Expires {method.expiry}</div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </div>
          ))}
        </div>

        {!showAddCard ? (
          <button
            onClick={() => setShowAddCard(true)}
            className="mt-4 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Add New Card</span>
          </button>
        ) : (
          <div className="mt-6 p-4 border border-gray-200 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCard}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Card'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-4">Payout Information</h3>
        <div className="p-4 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Current Balance</div>
              <div className="text-2xl font-semibold mt-1">$1,234.56</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Withdraw
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="font-medium mb-2">Connected Bank Account</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bank className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm">Chase Bank ****4242</div>
                  <div className="text-xs text-gray-500">Added on Mar 15, 2025</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    sessions: true,
    messages: true,
    bookings: true,
    offers: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    sessions: true,
    messages: true,
    bookings: false,
    offers: false
  });

  const [smsNotifications, setSmsNotifications] = useState({
    sessions: false,
    messages: false,
    bookings: false,
    offers: false
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Session Reminders</div>
              <p className="text-sm text-gray-500">Get notified about upcoming sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.sessions}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, sessions: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Messages</div>
              <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.messages}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, messages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Booking Updates</div>
              <p className="text-sm text-gray-500">Get notified about booking confirmations and cancellations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.bookings}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, bookings: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Promotional Offers</div>
              <p className="text-sm text-gray-500">Receive updates about special offers and promotions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.offers}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, offers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Session Reminders</div>
              <p className="text-sm text-gray-500">Get notified about upcoming sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications.sessions}
                onChange={(e) => setPushNotifications({ ...pushNotifications, sessions: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Messages</div>
              <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications.messages}
                onChange={(e) => setPushNotifications({ ...pushNotifications, messages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Booking Updates</div>
              <p className="text-sm text-gray-500">Get notified about booking confirmations and cancellations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications.bookings}
                onChange={(e) => setPushNotifications({ ...pushNotifications, bookings: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Promotional Offers</div>
              <p className="text-sm text-gray-500">Receive updates about special offers and promotions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications.offers}
                onChange={(e) => setPushNotifications({ ...pushNotifications, offers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Session Reminders</div>
              <p className="text-sm text-gray-500">Get notified about upcoming sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications.sessions}
                onChange={(e) => setSmsNotifications({ ...smsNotifications, sessions: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Messages</div>
              <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications.messages}
                onChange={(e) => setSmsNotifications({ ...smsNotifications, messages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Booking Updates</div>
              <p className="text-sm text-gray-500">Get notified about booking confirmations and cancellations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications.bookings}
                onChange={(e) => setSmsNotifications({ ...smsNotifications, bookings: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Promotional Offers</div>
              <p className="text-sm text-gray-500">Receive updates about special offers and promotions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications.offers}
                onChange={(e) => setSmsNotifications({ ...smsNotifications, offers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [sessionAvailability, setSessionAvailability] = useState<'always' | 'scheduled'>('always');
  const [showQRCode, setShowQRCode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
        <div className="p-4 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enhance Your Account Security</div>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security by enabling 2FA
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  if (e.target.checked) setShowQRCode(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {showQRCode && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Example:user@example.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=Example"
                  alt="2FA QR Code"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-sm text-center text-gray-500 mt-4">
                Scan this QR code with your authenticator app
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Profile Visibility</h3>
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Who Can See Your Profile</div>
              <p className="text-sm text-gray-500 mt-1">
                Control who can view your profile information
              </p>
            </div>
            <select
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Session Availability</h3>
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">When Others Can Book Sessions</div>
              <p className="text-sm text-gray-500 mt-1">
                Set your default session booking availability
              </p>
            </div>
            <select
              value={sessionAvailability}
              onChange={(e) => setSessionAvailability(e.target.value as 'always' | 'scheduled')}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="always">Always Available</option>
              <option value="scheduled">Scheduled Times Only</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Change Password</h3>
        <div className="p-4 border border-gray-200 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Delete Account</h3>
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-600">Delete Your Account</div>
              <p className="text-sm text-gray-500 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}

export function SettingsSection() {
  const [selectedTab, setSelectedTab] = useState<string>('profile');
  const { loading } = useStore();

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 min-h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-4 h-full">
        <div className="col-span-1 border-r border-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-6">Settings</h2>
          <div className="space-y-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="col-span-3 p-6">
          {loading ? <LoadingSpinner /> : renderTabContent()}
        </div>
      </div>
    </div>
  );
}