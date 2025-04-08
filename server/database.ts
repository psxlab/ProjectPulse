import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { log } from './vite';
import * as schema from '@shared/schema';

// Create database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable not set');
}

// Create connection
const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Helper function to initialize the database with sample data
export async function initializeDatabase() {
  log('Initializing database with sample data...', 'database');
  
  try {
    // Check if users table already has data
    const existingUsers = await db.query.users.findMany({
      limit: 1
    });
    
    if (existingUsers.length > 0) {
      log('Database already has data, skipping initialization', 'database');
      return;
    }
    
    log('Creating sample data...', 'database');
    
    // Create users
    const userTom = await db.insert(schema.users).values({
      username: "tom",
      password: "password123",
      email: "tom@example.com",
      name: "Tom Cook",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }).returning().then(res => res[0]);
    
    const userEmily = await db.insert(schema.users).values({
      username: "emily",
      password: "password123",
      email: "emily@example.com",
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    }).returning().then(res => res[0]);
    
    const userAlex = await db.insert(schema.users).values({
      username: "alex",
      password: "password123",
      email: "alex@example.com",
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    }).returning().then(res => res[0]);
    
    const userDavid = await db.insert(schema.users).values({
      username: "david",
      password: "password123",
      email: "david@example.com",
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
    }).returning().then(res => res[0]);
    
    // Create a team
    const developerTeam = await db.insert(schema.teams).values({
      name: "Product Development",
      description: "Team responsible for product development and design"
    }).returning().then(res => res[0]);
    
    // Add users to the team
    await db.insert(schema.teamMembers).values({
      teamId: developerTeam.id,
      userId: userTom.id,
      role: "admin"
    });
    
    await db.insert(schema.teamMembers).values({
      teamId: developerTeam.id,
      userId: userEmily.id,
      role: "member"
    });
    
    await db.insert(schema.teamMembers).values({
      teamId: developerTeam.id,
      userId: userAlex.id,
      role: "member"
    });
    
    await db.insert(schema.teamMembers).values({
      teamId: developerTeam.id,
      userId: userDavid.id,
      role: "member"
    });
    
    // Create projects
    const marketingProject = await db.insert(schema.projects).values({
      name: "Marketing Website",
      description: "Redesign and development of the marketing website",
      teamId: developerTeam.id,
      color: "#22C55E",
      status: "active"
    }).returning().then(res => res[0]);
    
    const mobileAppProject = await db.insert(schema.projects).values({
      name: "Mobile App Redesign",
      description: "User interface redesign for the mobile application",
      teamId: developerTeam.id,
      color: "#F59E0B",
      status: "active"
    }).returning().then(res => res[0]);
    
    const apiProject = await db.insert(schema.projects).values({
      name: "API Integration",
      description: "Integration with third-party APIs",
      teamId: developerTeam.id,
      color: "#3B82F6",
      status: "active"
    }).returning().then(res => res[0]);
    
    // Create tasks for Mobile App Redesign project
    // To Do tasks
    const task1 = await db.insert(schema.tasks).values({
      title: "Create app wireframes",
      description: "Design initial wireframes for the mobile application screens.",
      projectId: mobileAppProject.id,
      status: "todo",
      priority: "medium",
      assigneeId: userEmily.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-08T00:00:00.000Z"),
      tags: ["Design"]
    }).returning().then(res => res[0]);
    
    const task2 = await db.insert(schema.tasks).values({
      title: "User testing plan",
      description: "Develop a comprehensive user testing strategy for the new features.",
      projectId: mobileAppProject.id,
      status: "todo",
      priority: "low",
      assigneeId: userAlex.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-12T00:00:00.000Z"),
      tags: ["Research"]
    }).returning().then(res => res[0]);
    
    // In Progress tasks
    const task3 = await db.insert(schema.tasks).values({
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
    }).returning().then(res => res[0]);
    
    const task4 = await db.insert(schema.tasks).values({
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
    }).returning().then(res => res[0]);
    
    // Review tasks
    const task5 = await db.insert(schema.tasks).values({
      title: "Test authentication flow",
      description: "Validate user login, registration, and password recovery processes.",
      projectId: mobileAppProject.id,
      status: "review",
      priority: "medium",
      assigneeId: userAlex.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-09T00:00:00.000Z"),
      tags: ["QA"]
    }).returning().then(res => res[0]);
    
    const task6 = await db.insert(schema.tasks).values({
      title: "Profile screen implementation",
      description: "Review user profile screen implementation with edit capabilities.",
      projectId: mobileAppProject.id,
      status: "review",
      priority: "medium",
      assigneeId: userDavid.id,
      creatorId: userTom.id,
      dueDate: new Date("2023-05-08T00:00:00.000Z"),
      tags: ["Development"]
    }).returning().then(res => res[0]);
    
    // Done tasks
    const task7 = await db.insert(schema.tasks).values({
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
    }).returning().then(res => res[0]);
    
    const task8 = await db.insert(schema.tasks).values({
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
    }).returning().then(res => res[0]);
    
    // Add comments to a task
    await db.insert(schema.comments).values({
      taskId: task5.id,
      userId: userTom.id,
      content: "Please make sure to test on multiple browsers"
    });
    
    await db.insert(schema.comments).values({
      taskId: task5.id,
      userId: userEmily.id,
      content: "Will this include social login testing as well?"
    });
    
    await db.insert(schema.comments).values({
      taskId: task5.id,
      userId: userAlex.id,
      content: "Yes, I'll include all authentication methods in the test plan"
    });
    
    log('Sample data created successfully!', 'database');
  } catch (error) {
    log(`Error initializing database: ${error}`, 'database');
    throw error;
  }
}

export { db };