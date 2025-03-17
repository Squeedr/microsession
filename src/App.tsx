import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Users,
  BookOpen,
  Brain,
  Palette,
  Briefcase,
  Wrench,
  Gift,
  CreditCard,
  FileText,
  Star,
  Search,
  Filter,
  PlusCircle,
  Calendar as CalendarIcon,
  Building2,
  MoreVertical,
  Upload,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Grid,
  List,
  CheckSquare,
  Circle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Square,
  ExternalLink,
  Settings as SettingsIcon,
  MessageSquare as MessageIcon,
  Video,
  Users2,
  XCircle,
  Pencil,
  Tag
} from 'lucide-react';
import { useStore } from './lib/store';
import { AuthModal } from './components/AuthModal';
import { SessionsSection } from './components/SessionsSection';
import { ResourcesSection } from './components/ResourcesSection';
import { SpacesSection } from './components/SpacesSection';
import { ExpertsSection } from './components/ExpertsSection';
import { OffersSection } from './components/OffersSection';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'sessions', label: 'My Sessions', icon: Calendar },
  { id: 'experts', label: 'Browse Experts', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const tabs = [
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: Briefcase },
  { id: 'spaces', label: 'Spaces', icon: Building2 },
  { id: 'experts', label: 'Experts', icon: Users },
  { id: 'offers', label: 'Offers', icon: Tag }
];

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

interface WorkspaceDropdownProps {
  selectedWorkspace: { name: string };
  onWorkspaceChange: () => void;
}

function WorkspaceDropdown({ selectedWorkspace, onWorkspaceChange }: WorkspaceDropdownProps) {
  return (
    <button
      onClick={onWorkspaceChange}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
    >
      <span>{selectedWorkspace.name}</span>
      <ChevronDown className="w-4 h-4 text-gray-500" />
    </button>
  );
}

const workspaces = [
  { id: '1', name: 'Personal Workspace', type: 'personal' as const }
];

function App() {
  const [selectedTab, setSelectedTab] = useState('sessions');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <WorkspaceDropdown
                selectedWorkspace={workspaces[0]}
                onWorkspaceChange={() => {}}
              />
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-500" />
                </button>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Sessions" value="248" />
              <StatCard title="Active Spaces" value="12" />
              <StatCard title="Total Revenue" value="$4,289" />
              <StatCard title="Active Members" value="156" />
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center space-x-6 border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center space-x-2 pb-4 ${
                        selectedTab === tab.id
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      style={{
                        marginBottom: '-1px'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                {selectedTab === 'sessions' && <SessionsSection />}
                {selectedTab === 'resources' && <ResourcesSection />}
                {selectedTab === 'spaces' && <SpacesSection />}
                {selectedTab === 'experts' && <ExpertsSection />}
                {selectedTab === 'offers' && <OffersSection />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;