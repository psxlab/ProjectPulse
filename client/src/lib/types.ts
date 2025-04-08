import { User, Team, Project, Task, Comment, TeamMember } from "@shared/schema";

// Extend types with additional frontend-specific properties

export interface ProjectWithStats extends Project {
  totalTasks?: number;
  completedTasks?: number;
  inProgressTasks?: number;
  overdueTasksCount?: number;
}

export interface TaskWithAssignee extends Task {
  assignee?: Omit<User, "password">;
  creator?: Omit<User, "password">;
}

export interface CommentWithUser extends Comment {
  user: Omit<User, "password">;
}

export interface TeamMemberWithUser extends TeamMember {
  user: Omit<User, "password">;
}

// Response types
export interface StatsResponse {
  totalProjects: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
