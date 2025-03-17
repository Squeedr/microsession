import { create } from 'zustand';
import { supabase } from './supabase';

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

interface AppState {
  user: User | null;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  resources: Resource[];
  spaces: Space[];
  experts: Expert[];
  sessions: Session[];
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
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  workspaces: [],
  selectedWorkspace: null,
  resources: [],
  spaces: [],
  experts: [],
  sessions: [],
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Workspace actions
  createWorkspace: async (workspace) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

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
    } catch (error) {
      set({ error: (error as Error).message });
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
    if (!selectedWorkspace) throw new Error('No workspace selected');

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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Space actions
  createSpace: async (space) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) throw new Error('No workspace selected');

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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Expert actions
  createExpert: async (expert) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) throw new Error('No workspace selected');

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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Session actions
  createSession: async (session) => {
    const { selectedWorkspace } = get();
    if (!selectedWorkspace) throw new Error('No workspace selected');

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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));