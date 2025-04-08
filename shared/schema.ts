import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

// Team members join table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("member"), // member, admin, etc.
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  teamId: integer("team_id").notNull(),
  status: text("status").notNull().default("active"), // active, archived, completed
  color: text("color").notNull().default("#3949AB"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

// Task statuses will be: "todo", "in_progress", "review", "done"
export const taskStatusEnum = z.enum(["todo", "in_progress", "review", "done"]);

// Task priorities will be: "low", "medium", "high", "urgent"
export const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: integer("project_id").notNull(),
  status: text("status").notNull().default("todo"),
  priority: text("priority").notNull().default("medium"),
  assigneeId: integer("assignee_id"),
  creatorId: integer("creator_id").notNull(),
  dueDate: timestamp("due_date"),
  tags: jsonb("tags").default([]), // Array of tag strings
  progress: integer("progress").default(0), // 0-100
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
}).extend({
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  tags: z.array(z.string()).optional(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Comment = typeof comments.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// TaskStatus and TaskPriority for type safety
export type TaskStatus = z.infer<typeof taskStatusEnum>;
export type TaskPriority = z.infer<typeof taskPriorityEnum>;
