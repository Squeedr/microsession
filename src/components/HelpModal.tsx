import React from 'react';
import { X, MessageSquare, Book, Phone, Mail } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Help & Support</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium">How do I book a session?</h4>
                <p className="text-gray-600 mt-2">
                  Browse available experts, select your preferred time slot, and click "Book Session". Follow the prompts to complete your booking.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium">How do payments work?</h4>
                <p className="text-gray-600 mt-2">
                  We accept major credit cards and process payments securely. You'll only be charged after the session is confirmed.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium">Can I reschedule a session?</h4>
                <p className="text-gray-600 mt-2">
                  Yes, you can reschedule up to 24 hours before the session start time. Go to "My Sessions" to manage your bookings.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Support Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <p className="text-sm text-gray-500 mt-1">Chat with our support team</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Book className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">User Guides</div>
                    <p className="text-sm text-gray-500 mt-1">Browse our documentation</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <p className="text-sm text-gray-500 mt-1">Call us at +1 (800) 123-4567</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Email Support</div>
                    <p className="text-sm text-gray-500 mt-1">support@squeedr.com</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}