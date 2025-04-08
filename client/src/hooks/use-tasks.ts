import { useQuery, useMutation } from "@tanstack/react-query";
import { Task, InsertTask } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { TaskWithAssignee, CommentWithUser } from "@/lib/types";

export function useTasks(projectId?: number, assigneeId?: number) {
  let queryKey: any[] = ["/api/tasks"];
  
  if (projectId) {
    queryKey = ["/api/tasks", { projectId }];
  } else if (assigneeId) {
    queryKey = ["/api/tasks", { assigneeId }];
  }
  
  return useQuery<Task[]>({
    queryKey,
    enabled: Boolean(projectId) || Boolean(assigneeId) || !projectId && !assigneeId,
  });
}

export function useTasksByStatus(projectId: number, status: string) {
  const { data: tasks, ...rest } = useTasks(projectId);
  
  const filteredTasks = tasks?.filter(task => task.status === status) || [];
  
  return {
    data: filteredTasks,
    ...rest,
  };
}

export function useTask(id: number) {
  return useQuery<Task>({
    queryKey: ["/api/tasks", id],
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (task: InsertTask) => {
      return apiRequest("POST", "/api/tasks", task);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", { projectId: variables.projectId }] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertTask> }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", variables.id] });
      // If projectId is changing, invalidate both projects' tasks
      if (variables.data.projectId) {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks", { projectId: variables.data.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useTaskComments(taskId: number) {
  return useQuery<CommentWithUser[]>({
    queryKey: ["/api/tasks", taskId, "comments"],
    enabled: Boolean(taskId),
  });
}

export function useCreateComment() {
  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: number; comment: { userId: number; content: string } }) => {
      return apiRequest("POST", `/api/tasks/${taskId}/comments`, comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", variables.taskId, "comments"] });
    },
  });
}
