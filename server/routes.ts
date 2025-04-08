import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adonisBridge } from "./adonis-bridge";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertTeamSchema, 
  insertTeamMemberSchema,
  insertProjectSchema,
  insertTaskSchema,
  insertCommentSchema,
  taskStatusEnum,
  taskPriorityEnum
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const apiRouter = express.Router();
  
  // Middleware to handle errors
  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  // Feature flag to determine whether to use AdonisJS or in-memory storage
  const USE_ADONIS = false; // Change to true when AdonisJS is fully set up
  
  // User routes
  apiRouter.get("/users", asyncHandler(async (req: Request, res: Response) => {
    const users = await storage.getUsers();
    // Don't send passwords back in the response
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  }));
  
  apiRouter.get("/users/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password back in the response
    const { password, ...safeUser } = user;
    res.json(safeUser);
  }));
  
  // Team routes
  apiRouter.get("/teams", asyncHandler(async (req: Request, res: Response) => {
    const teams = await storage.getTeams();
    res.json(teams);
  }));
  
  apiRouter.post("/teams", asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  apiRouter.get("/teams/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const team = await storage.getTeam(id);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    res.json(team);
  }));
  
  apiRouter.get("/teams/:id/members", asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.id);
    const team = await storage.getTeam(teamId);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    const teamMembers = await storage.getTeamMembers(teamId);
    
    // Get detailed user info for each team member
    const memberDetails = await Promise.all(
      teamMembers.map(async (member) => {
        const user = await storage.getUser(member.userId);
        if (!user) return null;
        
        const { password, ...safeUser } = user;
        return {
          ...member,
          user: safeUser
        };
      })
    );
    
    res.json(memberDetails.filter(Boolean));
  }));
  
  apiRouter.post("/teams/:id/members", asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.id);
    const team = await storage.getTeam(teamId);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    try {
      const validatedData = insertTeamMemberSchema.parse({
        ...req.body,
        teamId
      });
      
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const teamMember = await storage.addTeamMember(validatedData);
      res.status(201).json(teamMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team member data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  // Project routes
  apiRouter.get("/projects", asyncHandler(async (req: Request, res: Response) => {
    const teamId = req.query.teamId ? parseInt(req.query.teamId as string) : undefined;
    
    let projects;
    if (teamId) {
      projects = await storage.getProjectsByTeam(teamId);
    } else {
      projects = await storage.getProjects();
    }
    
    res.json(projects);
  }));
  
  apiRouter.post("/projects", asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Check if team exists
      const team = await storage.getTeam(validatedData.teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  apiRouter.get("/projects/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  }));
  
  apiRouter.patch("/projects/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    try {
      // Validate only the fields being updated
      const schema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        teamId: z.number().optional(),
        status: z.string().optional(),
        color: z.string().optional()
      });
      
      const validatedData = schema.parse(req.body);
      
      // If teamId is being updated, verify the team exists
      if (validatedData.teamId) {
        const team = await storage.getTeam(validatedData.teamId);
        if (!team) {
          return res.status(404).json({ message: "Team not found" });
        }
      }
      
      const updatedProject = await storage.updateProject(id, validatedData);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  // Task routes
  apiRouter.get("/tasks", asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
    const assigneeId = req.query.assigneeId ? parseInt(req.query.assigneeId as string) : undefined;
    
    let tasks;
    if (projectId) {
      tasks = await storage.getTasksByProject(projectId);
    } else if (assigneeId) {
      tasks = await storage.getTasksByAssignee(assigneeId);
    } else {
      tasks = await storage.getTasks();
    }
    
    res.json(tasks);
  }));
  
  apiRouter.post("/tasks", asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      
      // Check if project exists
      const project = await storage.getProject(validatedData.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if assignee exists if provided
      if (validatedData.assigneeId) {
        const assignee = await storage.getUser(validatedData.assigneeId);
        if (!assignee) {
          return res.status(404).json({ message: "Assignee not found" });
        }
      }
      
      // Check if creator exists
      const creator = await storage.getUser(validatedData.creatorId);
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  apiRouter.get("/tasks/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json(task);
  }));
  
  apiRouter.patch("/tasks/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    try {
      // Validate only the fields being updated
      const schema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        projectId: z.number().optional(),
        status: taskStatusEnum.optional(),
        priority: taskPriorityEnum.optional(),
        assigneeId: z.number().nullable().optional(),
        dueDate: z.date().optional(),
        tags: z.array(z.string()).optional(),
        progress: z.number().optional()
      });
      
      const validatedData = schema.parse(req.body);
      
      // If projectId is being updated, verify the project exists
      if (validatedData.projectId) {
        const project = await storage.getProject(validatedData.projectId);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
      }
      
      // If assigneeId is being updated, verify the user exists
      if (validatedData.assigneeId) {
        const assignee = await storage.getUser(validatedData.assigneeId);
        if (!assignee) {
          return res.status(404).json({ message: "Assignee not found" });
        }
      }
      
      const updatedTask = await storage.updateTask(id, validatedData);
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  apiRouter.delete("/tasks/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    await storage.deleteTask(id);
    res.status(204).end();
  }));
  
  // Comment routes
  apiRouter.get("/tasks/:taskId/comments", asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const task = await storage.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const comments = await storage.getCommentsByTask(taskId);
    
    // Get user details for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await storage.getUser(comment.userId);
        if (!user) return null;
        
        const { password, ...safeUser } = user;
        return {
          ...comment,
          user: safeUser
        };
      })
    );
    
    res.json(commentsWithUsers.filter(Boolean));
  }));
  
  apiRouter.post("/tasks/:taskId/comments", asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const task = await storage.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    try {
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        taskId
      });
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const comment = await storage.createComment(validatedData);
      
      // Include user details in the response
      const { password, ...safeUser } = user;
      
      res.status(201).json({
        ...comment,
        user: safeUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      throw error;
    }
  }));
  
  // Get statistics
  apiRouter.get("/stats", asyncHandler(async (req: Request, res: Response) => {
    const projects = await storage.getProjects();
    const tasks = await storage.getTasks();
    
    const totalProjects = projects.length;
    
    // Count tasks by status
    const inProgress = tasks.filter(task => task.status === "in_progress").length;
    const completed = tasks.filter(task => task.status === "done").length;
    
    // Count overdue tasks (due date in the past and not completed)
    const now = new Date();
    const overdue = tasks.filter(task => 
      task.status !== "done" && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;
    
    res.json({
      totalProjects,
      inProgress,
      completed,
      overdue
    });
  }));
  
  // Mount API routes with /api prefix
  app.use("/api", apiRouter);
  
  return httpServer;
}
