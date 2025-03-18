import React, { useState } from 'react';
import { ChevronDown, Users2, Building2, User, TrendingUp, Plus } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team' | 'company';
  stats?: {
    totalBookings: number;
    revenue: number;
    activeSpaces: number;
  };
  members?: {
    id: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    avatar?: string;
  }[];
}

interface WorkspaceDropdownProps {
  selectedWorkspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

export function WorkspaceDropdown({ selectedWorkspace, onWorkspaceChange, workspaces }: WorkspaceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getWorkspaceIcon = (type: Workspace['type']) => {
    switch (type) {
      case 'personal':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'team':
        return <Users2 className="w-5 h-5 text-purple-500" />;
      case 'company':
        return <Building2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 w-full transition-colors duration-200"
      >
        <div className="p-2 bg-gray-50 rounded-lg">
          {getWorkspaceIcon(selectedWorkspace.type)}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium">{selectedWorkspace.name}</div>
          <div className="text-sm text-gray-500">
            {selectedWorkspace.type.charAt(0).toUpperCase() + selectedWorkspace.type.slice(1)} Workspace
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
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
              className="w-full px-4 py-3 hover:bg-gray-50 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getWorkspaceIcon(workspace.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{workspace.name}</div>
                  {workspace.stats && (
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="text-sm">
                        <div className="text-gray-500">Bookings</div>
                        <div className="font-medium">{workspace.stats.totalBookings}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500">Revenue</div>
                        <div className="font-medium">${workspace.stats.revenue}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500">Active Spaces</div>
                        <div className="font-medium">{workspace.stats.activeSpaces}</div>
                      </div>
                    </div>
                  )}
                  {workspace.members && workspace.members.length > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-2">
                        {workspace.members.slice(0, 3).map((member) => (
                          <img
                            key={member.id}
                            src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt={member.name}
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                        ))}
                      </div>
                      {workspace.members.length > 3 && (
                        <span className="text-sm text-gray-500 ml-2">
                          +{workspace.members.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => {
                // Handle create workspace
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 text-left flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}