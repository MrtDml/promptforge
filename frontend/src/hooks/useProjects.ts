"use client";

import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/types";
import { AxiosError } from "axios";

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

interface UseProjectsReturn extends ProjectsState {
  fetchProjects: (page?: number) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const fetchProjects = useCallback(async (page = 1) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await projectsApi.list(page, 20);
      const { data, total, totalPages } = response.data;
      setState({
        projects: data,
        isLoading: false,
        error: null,
        total,
        page,
        totalPages,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to load projects.";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  const deleteProject = useCallback(
    async (id: string) => {
      try {
        await projectsApi.delete(id);
        setState((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== id),
          total: prev.total - 1,
        }));
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message || "Failed to delete project.";
        setState((prev) => ({ ...prev, error: message }));
        throw new Error(message);
      }
    },
    []
  );

  const refreshProjects = useCallback(() => {
    return fetchProjects(state.page);
  }, [fetchProjects, state.page]);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  return {
    ...state,
    fetchProjects,
    deleteProject,
    refreshProjects,
  };
}

// ─── Single project hook ─────────────────────────────────────────────────────

interface SingleProjectState {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface UseSingleProjectReturn extends SingleProjectState {
  fetchProject: () => Promise<void>;
  refreshProject: () => Promise<void>;
}

export function useSingleProject(id: string): UseSingleProjectReturn {
  const [state, setState] = useState<SingleProjectState>({
    project: null,
    isLoading: true,
    error: null,
  });

  const fetchProject = useCallback(async () => {
    if (!id) return;
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await projectsApi.get(id);
      setState({
        project: response.data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to load project.";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    ...state,
    fetchProject,
    refreshProject: fetchProject,
  };
}
