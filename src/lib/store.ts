import { create } from 'zustand';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team' | 'company';
  ownerId: string;
}

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
  workspaceId: string;
}

interface Space {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: 'published' | 'unpublished';
  workspaceId: string;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  specializations: string[];
  languages: string[];
  status: 'online' | 'offline';
  workspaceId: string;
}

interface Session {
  id: string;
  title: string;
  time: string;
  type: string;
  host: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  workspaceId: string;
}

interface Notification {
  id: string;
  type: 'message' | 'session' | 'offer' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  user: User | null;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  resources: Resource[];
  spaces: Space[];
  experts: Expert[];
  sessions: Session[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Workspace actions
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'ownerId'>) => Promise<void>;
  selectWorkspace: (workspace: Workspace) => void;
  
  // Resource actions
  createResource: (resource: Omit<Resource, 'id'>) => Promise<void>;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  
  // Space actions
  createSpace: (space: Omit<Space, 'id'>) => Promise<void>;
  updateSpace: (id: string, updates: Partial<Space>) => Promise<void>;
  deleteSpace: (id: string) => Promise<void>;
  
  // Expert actions
  createExpert: (expert: Omit<Expert, 'id'>) => Promise<void>;
  updateExpert: (id: string, updates: Partial<Expert>) => Promise<void>;
  deleteExpert: (id: string) => Promise<void>;
  
  // Session actions
  createSession: (session: Omit<Session, 'id'>) => Promise<void>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  // Notification actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  workspaces: [],
  selectedWorkspace: null,
  resources: [],
  spaces: [],
  experts: [],
  sessions: [],
  notifications: [
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Wilson sent you a message',
      timestamp: '2025-03-16T10:00:00Z',
      read: false
    },
    {
      id: '2',
      type: 'session',
      title: 'Session Reminder',
      description: 'Your yoga session starts in 30 minutes',
      timestamp: '2025-03-16T09:30:00Z',
      read: false
    },
    {
      id: '3',
      type: 'offer',
      title: 'New Offer Available',
      description: 'Early Bird Special: 20% off morning sessions',
      timestamp: '2025-03-16T09:00:00Z',
      read: true
    }
  ],
  loading: false,
  error: null,

  // Auth actions
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
      toast.success('Welcome back!');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
      toast.success('Account created successfully!');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      toast.success('Logged out successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  // Workspace actions
  createWorkspace: async (workspace) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to create a workspace');
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert([{ ...workspace, owner_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        workspaces: [...state.workspaces, data],
      }));
      toast.success('Workspace created successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  selectWorkspace: (workspace) => {
    set({ selectedWorkspace: workspace });
  },

  // Resource actions
  createResource: async (resource) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) {
      toast.error('Please select a workspace first');
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{ ...resource, workspace_id: selectedWorkspace.id }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        resources: [...state.resources, data],
      }));
      toast.success('Resource created successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateResource: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        resources: state.resources.map((r) => (r.id === id ? data : r)),
      }));
      toast.success('Resource updated successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  deleteResource: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        resources: state.resources.filter((r) => r.id !== id),
      }));
      toast.success('Resource deleted successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  // Space actions
  createSpace: async (space) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) {
      toast.error('Please select a workspace first');
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('spaces')
        .insert([{ ...space, workspace_id: selectedWorkspace.id }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        spaces: [...state.spaces, data],
      }));
      toast.success('Space created successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateSpace: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        spaces: state.spaces.map((s) => (s.id === id ? data : s)),
      }));
      toast.success('Space updated successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  deleteSpace: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        spaces: state.spaces.filter((s) => s.id !== id),
      }));
      toast.success('Space deleted successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  // Expert actions
  createExpert: async (expert) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) {
      toast.error('Please select a workspace first');
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experts')
        .insert([{ ...expert, workspace_id: selectedWorkspace.id }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        experts: [...state.experts, data],
      }));
      toast.success('Expert profile created successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateExpert: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        experts: state.experts.map((e) => (e.id === id ? data : e)),
      }));
      toast.success('Expert profile updated successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  deleteExpert: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('experts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        experts: state.experts.filter((e) => e.id !== id),
      }));
      toast.success('Expert profile deleted successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  // Session actions
  createSession: async (session) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) {
      toast.error('Please select a workspace first');
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ ...session, workspace_id: selectedWorkspace.id }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        sessions: [...state.sessions, data],
      }));
      toast.success('Session created successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateSession: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? data : s)),
      }));
      toast.success('Session updated successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }));
      toast.success('Session deleted successfully');
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  // Notification actions
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
    toast.success('All notifications marked as read');
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter((notification) => !notification.read).length;
  },
}));