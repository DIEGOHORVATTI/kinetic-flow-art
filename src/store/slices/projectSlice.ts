import { StateCreator } from 'zustand';

export interface ProjectSlice {
  projectId?: string;
  projectName: string;
  projectDescription?: string;
  isDirty: boolean;
  isLoading: boolean;
  lastSaved?: Date;
  
  // Actions
  setProjectInfo: (info: { id?: string; name: string; description?: string }) => void;
  markDirty: () => void;
  markClean: () => void;
  setLoading: (loading: boolean) => void;
  updateLastSaved: () => void;
  createNewProject: () => void;
}

export const createProjectSlice: StateCreator<ProjectSlice> = (set) => ({
  projectName: 'Untitled Workflow',
  isDirty: false,
  isLoading: false,

  setProjectInfo: (info) => {
    set({
      projectId: info.id,
      projectName: info.name,
      projectDescription: info.description
    });
  },

  markDirty: () => {
    set({ isDirty: true });
  },

  markClean: () => {
    set({ isDirty: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  updateLastSaved: () => {
    set({ 
      lastSaved: new Date(),
      isDirty: false 
    });
  },

  createNewProject: () => {
    set({
      projectId: undefined,
      projectName: 'Untitled Workflow',
      projectDescription: undefined,
      isDirty: false,
      lastSaved: undefined
    });
  }
});