import { useQuery, useMutation } from "@tanstack/react-query";
import { Project, InsertProject } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { ProjectWithStats } from "@/lib/types";

export function useProjects(teamId?: number) {
  const queryKey = teamId ? ["/api/projects", { teamId }] : ["/api/projects"];
  
  return useQuery<Project[]>({
    queryKey,
    select: (data) => data,
  });
}

export function useProject(id: number) {
  return useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: Boolean(id),
  });
}

export function useProjectWithStats(id: number) {
  const { data: project, ...rest } = useProject(id);
  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks", { projectId: id }],
    enabled: Boolean(id),
  });
  
  // Calculate project stats
  const projectWithStats: ProjectWithStats | undefined = project
    ? {
        ...project,
        totalTasks: tasks?.length || 0,
        completedTasks: tasks?.filter(task => task.status === "done").length || 0,
        inProgressTasks: tasks?.filter(task => task.status === "in_progress").length || 0,
        overdueTasksCount: tasks?.filter(task => {
          return task.dueDate && 
            new Date(task.dueDate) < new Date() && 
            task.status !== "done";
        }).length || 0,
      }
    : undefined;
  
  return {
    data: projectWithStats,
    ...rest,
  };
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (project: InsertProject) => {
      return apiRequest("POST", "/api/projects", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProject> }) => {
      return apiRequest("PATCH", `/api/projects/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.id] });
    },
  });
}
