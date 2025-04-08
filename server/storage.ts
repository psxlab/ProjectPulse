import { 
  users, User, InsertUser,
  teams, Team, InsertTeam,
  teamMembers, TeamMember, InsertTeamMember,
  projects, Project, InsertProject,
  tasks, Task, InsertTask,
  comments, Comment, InsertComment
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTeams(): Promise<Team[]>;
  
  // Team member operations
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<boolean>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByTeam(teamId: number): Promise<Project[]>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasks(): Promise<Task[]>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTasksByAssignee(assigneeId: number): Promise<Task[]>;
  getTasksByStatus(projectId: number, status: string): Promise<Task[]>;
  
  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByTask(taskId: number): Promise<Comment[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private comments: Map<number, Comment>;
  
  private userIdCounter: number;
  private teamIdCounter: number;
  private teamMemberIdCounter: number;
  private projectIdCounter: number;
  private taskIdCounter: number;
  private commentIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.comments = new Map();
    
    this.userIdCounter = 1;
    this.teamIdCounter = 1;
    this.teamMemberIdCounter = 1;
    this.projectIdCounter = 1;
    this.taskIdCounter = 1;
    this.commentIdCounter = 1;
    
    // Initialize with some sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Create sample users
    const userTom = this.createUser({
      username: "tom",
      password: "password123",
      email: "tom@example.com",
      name: "Tom Cook",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    });
    
    const userEmily = this.createUser({
      username: "emily",
      password: "password123",
      email: "emily@example.com",
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    });
    
    const userAlex = this.createUser({
      username: "alex",
      password: "password123",
      email: "alex@example.com",
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    });
    
    const userDavid = this.createUser({
      username: "david",
      password: "password123",
      email: "david@example.com",
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    });
    
    // Create a team
    const developerTeam = this.createTeam({
      name: "Product Development",
      description: "Team responsible for product development and design"
    });
    
    // Add users to the team
    this.addTeamMember({ teamId: developerTeam.id, userId: userTom.id, role: "admin" });
    this.addTeamMember({ teamId: developerTeam.id, userId: userEmily.id, role: "member" });
    this.addTeamMember({ teamId: developerTeam.id, userId: userAlex.id, role: "member" });
    this.addTeamMember({ teamId: developerTeam.id, userId: userDavid.id, role: "member" });
    
    // Create projects
    const marketingProject = this.createProject({
      name: "Marketing Website",
      description: "Redesign and development of the marketing website",
      teamId: developerTeam.id,
      color: "#22C55E",
      status: "active"
    });
    
    const mobileAppProject = this.createProject({
      name: "Mobile App Redesign",
      description: "User interface redesign for the mobile application",
      teamId: developerTeam.id,
      color: "#F59E0B",
      status: "active"
    });
    
    const apiProject = this.createProject({
      name: "API Integration",
      description: "Integration with third-party APIs",
      teamId: developerTeam.id,
      color: "#3B82F6",
      status: "active"
    });
    
    // Create tasks for Mobile App Redesign project
    // To Do tasks
    this.createTask({
      title: "Create app wireframes",
      description: "Design initial wireframes for the mobile application screens.",
      projectId: mobileAppProject.id,
      status: "todo",
      priority: "medium",
      assigneeId: userEmily.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-08T00:00:00.000Z"),
      tags: ["Design"]
    });
    
    this.createTask({
      title: "User testing plan",
      description: "Develop a comprehensive user testing strategy for the new features.",
      projectId: mobileAppProject.id,
      status: "todo",
      priority: "low",
      assigneeId: userAlex.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-12T00:00:00.000Z"),
      tags: ["Research"]
    });
    
    // In Progress tasks
    this.createTask({
      title: "API Integration",
      description: "Connect the app to backend services via RESTful API endpoints.",
      projectId: mobileAppProject.id,
      status: "in_progress",
      priority: "high",
      assigneeId: userDavid.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-10T00:00:00.000Z"),
      progress: 65,
      tags: ["Development"]
    });
    
    this.createTask({
      title: "Design system update",
      description: "Refine the design system components for consistent styling.",
      projectId: mobileAppProject.id,
      status: "in_progress",
      priority: "medium",
      assigneeId: userEmily.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-15T00:00:00.000Z"),
      progress: 40,
      tags: ["UX Design"]
    });
    
    // Review tasks
    this.createTask({
      title: "Test authentication flow",
      description: "Validate user login, registration, and password recovery processes.",
      projectId: mobileAppProject.id,
      status: "review",
      priority: "medium",
      assigneeId: userAlex.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-09T00:00:00.000Z"),
      tags: ["QA"]
    });
    
    this.createTask({
      title: "Profile screen implementation",
      description: "Review user profile screen implementation with edit capabilities.",
      projectId: mobileAppProject.id,
      status: "review",
      priority: "medium",
      assigneeId: userDavid.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-08T00:00:00.000Z"),
      tags: ["Development"]
    });
    
    // Done tasks
    this.createTask({
      title: "Project setup",
      description: "Initialize repository and development environment configuration.",
      projectId: mobileAppProject.id,
      status: "done",
      priority: "high",
      assigneeId: userDavid.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-05T00:00:00.000Z"),
      progress: 100,
      tags: ["Development"]
    });
    
    this.createTask({
      title: "Competitor analysis",
      description: "Research and document competitor features and UI patterns.",
      projectId: mobileAppProject.id,
      status: "done",
      priority: "medium",
      assigneeId: userAlex.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-03T00:00:00.000Z"),
      progress: 100,
      tags: ["Research"]
    });
    
    // Add comments to a task
    this.createComment({
      taskId: 5, // Test authentication flow
      userId: userTom.id,
      content: "Please make sure to test on multiple browsers"
    });
    
    this.createComment({
      taskId: 5, // Test authentication flow
      userId: userEmily.id,
      content: "Will this include social login testing as well?"
    });
    
    this.createComment({
      taskId: 5, // Test authentication flow
      userId: userAlex.id,
      content: "Yes, I'll include all authentication methods in the test plan"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async createTeam(teamData: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const team: Team = { ...teamData, id };
    this.teams.set(id, team);
    return team;
  }
  
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  // Team member operations
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(tm => tm.teamId === teamId);
  }
  
  async addTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberIdCounter++;
    const teamMember: TeamMember = { ...teamMemberData, id };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }
  
  async removeTeamMember(teamId: number, userId: number): Promise<boolean> {
    const teamMember = Array.from(this.teamMembers.values()).find(
      tm => tm.teamId === teamId && tm.userId === userId
    );
    
    if (teamMember) {
      return this.teamMembers.delete(teamMember.id);
    }
    
    return false;
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { ...projectData, id };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProjectsByTeam(teamId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.teamId === teamId);
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { 
      ...taskData, 
      id,
      tags: taskData.tags || []
    };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }
  
  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assigneeId === assigneeId);
  }
  
  async getTasksByStatus(projectId: number, status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.projectId === projectId && task.status === status
    );
  }
  
  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }
  
  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const comment: Comment = { 
      ...commentData, 
      id, 
      createdAt: new Date() 
    };
    this.comments.set(id, comment);
    return comment;
  }
  
  async getCommentsByTask(taskId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.taskId === taskId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
