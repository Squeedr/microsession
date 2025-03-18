import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Send, Paperclip, Image as ImageIcon, File, X, Check, CheckCheck, Phone, Video } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
    lastSeen?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
}

function ConversationList({ 
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange
}: {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const filteredConversations = conversations.filter(conversation =>
    conversation.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(p => p.id !== '1');
          if (!otherParticipant) return null;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors duration-200 ${
                selectedId === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`}
                  alt={otherParticipant.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  otherParticipant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.lastMessage.timestamp), 'HH:mm')}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[70%] ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2`}>
        {message.attachments?.map((attachment, index) => (
          <div key={index} className="mb-2">
            {attachment.type === 'image' ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="rounded-lg max-w-full"
              />
            ) : (
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors duration-200"
              >
                <File className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{attachment.name}</div>
                  {attachment.size && (
                    <div className="text-xs opacity-75">
                      {Math.round(attachment.size / 1024)} KB
                    </div>
                  )}
                </div>
              </a>
            )}
          </div>
        ))}
        <p>{message.content}</p>
      </div>
      <div className="flex items-center space-x-1 mt-1">
        <span className="text-xs text-gray-500">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
        {isOwn && (
          message.status === 'read' ? (
            <CheckCheck className="w-4 h-4 text-blue-500" />
          ) : message.status === 'delivered' ? (
            <CheckCheck className="w-4 h-4 text-gray-500" />
          ) : (
            <Check className="w-4 h-4 text-gray-500" />
          )
        )}
      </div>
    </div>
  );
}

function ChatView({ conversation }: { conversation: Conversation }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const otherParticipant = conversation.participants.find(p => p.id !== '1');

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      receiverId: '2',
      content: 'Hi, how are you?',
      timestamp: '2025-03-16T10:00:00Z',
      status: 'read'
    },
    {
      id: '2',
      senderId: '2',
      receiverId: '1',
      content: "I'm doing great! Just finished my morning yoga session.",
      timestamp: '2025-03-16T10:01:00Z',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      receiverId: '2',
      content: "That's awesome! Here's the meditation guide we talked about.",
      timestamp: '2025-03-16T10:02:00Z',
      status: 'delivered',
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'meditation_guide.pdf',
          size: 2048
        }
      ]
    },
    {
      id: '4',
      senderId: '2',
      receiverId: '1',
      content: 'Thank you! This looks great.',
      timestamp: '2025-03-16T10:03:00Z',
      status: 'sent'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mockMessages]);

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (type: 'image' | 'file') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '*/*';
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name || '')}&background=random`}
              alt={otherParticipant?.name}
              className="w-12 h-12 rounded-full"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              otherParticipant?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <h2 className="font-medium">{otherParticipant?.name}</h2>
            <p className="text-sm text-gray-500">
              {otherParticipant?.status === 'online' ? (
                'Online'
              ) : otherParticipant?.lastSeen ? (
                `Last seen ${format(new Date(otherParticipant.lastSeen), 'HH:mm')}`
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <Phone className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <Video className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === '1'}
          />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                <button
                  onClick={() => handleFileSelect('image')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => handleFileSelect('file')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <File className="w-5 h-5 text-gray-500" />
                  <span>File</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          // Handle file upload
          if (e.target.files?.[0]) {
            console.log('File selected:', e.target.files[0]);
          }
        }}
      />
    </div>
  );
}

export function MessagesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();
  const { loading } = useStore();

  const mockConversations: Conversation[] = [
    {
      id: '1',
      participants: [
        { id: '1', name: 'You', status: 'online' },
        {
          id: '2',
          name: 'Sarah Wilson',
          status: 'online',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
        }
      ],
      lastMessage: {
        id: '1',
        senderId: '2',
        receiverId: '1',
        content: 'Thank you! This looks great.',
        timestamp: '2025-03-16T10:03:00Z',
        status: 'sent'
      },
      unreadCount: 0
    },
    {
      id: '2',
      participants: [
        { id: '1', name: 'You', status: 'online' },
        {
          id: '3',
          name: 'Michael Chen',
          status: 'offline',
          lastSeen: '2025-03-16T09:30:00Z'
        }
      ],
      lastMessage: {
        id: '2',
        senderId: '1',
        receiverId: '3',
        content: 'Looking forward to our next session!',
        timestamp: '2025-03-16T09:30:00Z',
        status: 'delivered'
      },
      unreadCount: 2
    },
    {
      id: '3',
      participants: [
        { id: '1', name: 'You', status: 'online' },
        {
          id: '4',
          name: 'Emma Thompson',
          status: 'online',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80'
        }
      ],
      lastMessage: {
        id: '3',
        senderId: '4',
        receiverId: '1',
        content: 'Perfect! See you tomorrow at 2 PM.',
        timestamp: '2025-03-16T09:00:00Z',
        status: 'read'
      },
      unreadCount: 1
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 h-[calc(100vh-12rem)] flex overflow-hidden">
      <div className="w-80 border-r border-gray-200">
        <ConversationList
          conversations={mockConversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : selectedConversation ? (
          <ChatView conversation={selectedConversation} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}