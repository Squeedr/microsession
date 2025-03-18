import React from 'react';
import {
  Calendar,
  Briefcase,
  Building2,
  Tag,
  Users
} from 'lucide-react';
import { SessionsSection } from './SessionsSection';
import { ResourcesSection } from './ResourcesSection';
import { SpacesSection } from './SpacesSection';
import { ExpertsSection } from './ExpertsSection';
import { OffersSection } from './OffersSection';

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

const tabs = [
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: Briefcase },
  { id: 'spaces', label: 'Spaces', icon: Building2 },
  { id: 'experts', label: 'Experts', icon: Users },
  { id: 'offers', label: 'Offers', icon: Tag }
];

export function DashboardSection() {
  const [selectedTab, setSelectedTab] = React.useState('sessions');

  return (
    <>
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
    </>
  );
}