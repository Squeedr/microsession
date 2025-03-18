import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Users,
  ChevronDown,
  LogOut,
  ChevronRight,
  Briefcase,
  Building2,
  Tag,
  TrendingUp,
  User,
  Menu,
  X as XIcon,
  HelpCircle,
  Aperture
} from 'lucide-react';
import { useStore } from './lib/store';
import { AuthModal } from './components/AuthModal';
import { SessionsSection } from './components/SessionsSection';
import { ResourcesSection } from './components/ResourcesSection';
import { SpacesSection } from './components/SpacesSection';
import { ExpertsSection } from './components/ExpertsSection';
import { OffersSection } from './components/OffersSection';
import { MessagesSection } from './components/MessagesSection';
import { SettingsSection } from './components/SettingsSection';
import { OpportunitiesSection } from './components/OpportunitiesSection';
import { DashboardSection } from './components/DashboardSection';
import { NotificationsSection } from './components/NotificationsSection';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { HelpModal } from './components/HelpModal';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'sessions', label: 'My Sessions', icon: Calendar },
  { id: 'opportunities', label: 'Opportunities', icon: TrendingUp },
  { id: 'experts', label: 'Browse Experts', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings }
];

interface WorkspaceDropdownProps {
  selectedWorkspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team' | 'company';
}

function WorkspaceDropdown({ selectedWorkspace, onWorkspaceChange, workspaces }: WorkspaceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 w-full transition-colors duration-200"
      >
        <span className="truncate">{selectedWorkspace.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => {
                onWorkspaceChange(workspace);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
            >
              <span className="truncate">{workspace.name}</span>
              {workspace.id === selectedWorkspace.id && (
                <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const workspaces: Workspace[] = [
  { id: '1', name: 'Personal Workspace', type: 'personal' },
  { id: '2', name: 'Team Alpha', type: 'team' },
  { id: '3', name: 'Company Space', type: 'company' }
];

function UserDropdown({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600 transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationsPage, setShowNotificationsPage] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { user, logout, notifications, markNotificationAsRead, getUnreadCount } = useStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
  };

  const unreadCount = getUnreadCount();

  const renderContent = () => {
    if (showNotificationsPage) {
      return <NotificationsSection />;
    }

    switch (selectedMenuItem) {
      case 'dashboard':
        return <DashboardSection />;
      case 'sessions':
        return <SessionsSection />;
      case 'opportunities':
        return <OpportunitiesSection />;
      case 'experts':
        return <ExpertsSection />;
      case 'messages':
        return <MessagesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6 text-gray-500" />
            ) : (
              <Menu className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {user ? (
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifications(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <User className="w-5 h-5 text-gray-500" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-[56px] lg:pt-0">
        <div
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out transform`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <Aperture className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Squeedr</span>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMenuItem(item.id);
                      setIsMobileMenuOpen(false);
                      setShowNotificationsPage(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-xl transition-colors duration-200 ${
                      selectedMenuItem === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${
                        selectedMenuItem === item.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="w-64">
                <WorkspaceDropdown
                  selectedWorkspace={selectedWorkspace}
                  onWorkspaceChange={setSelectedWorkspace}
                  workspaces={workspaces}
                />
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Need Help?"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
                  >
                    <Bell className="w-5 h-5 text-gray-500" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationsDropdown
                      notifications={notifications}
                      onClose={() => setShowNotifications(false)}
                      onViewAll={() => {
                        setShowNotifications(false);
                        setShowNotificationsPage(true);
                      }}
                      onMarkAsRead={markNotificationAsRead}
                    />
                  )}
                </div>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowUserDropdown(!showUserDropdown);
                        setShowNotifications(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="hidden sm:inline">{user.email}</span>
                    </button>
                    {showUserDropdown && (
                      <UserDropdown onLogout={handleLogout} />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}