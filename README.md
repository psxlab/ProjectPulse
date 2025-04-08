# TaskFlow - Project Management Application

TaskFlow is a comprehensive project management web application built with a modern tech stack, designed to streamline team collaboration and task tracking. This application provides a robust platform for managing projects, tasks, and team collaborations with an intuitive user interface.

## Features

- **Project Management**: Create, view, update, and organize projects with customizable attributes
- **Task Tracking**: Manage tasks with priorities, statuses, due dates, and assignments
- **Team Collaboration**: Assign team members to projects and tasks, add comments
- **Dashboard View**: Get an overview of project status, task progress, and team activities
- **Real-time Updates**: Track changes with real-time notifications and updates

## Tech Stack

### Frontend
- React.js with TypeScript
- TanStack Query for data fetching
- React Hook Form for form handling
- Shadcn/UI components
- Tailwind CSS for styling
- Wouter for routing

### Backend
- AdonisJS for API framework
- Express.js for middleware handling
- PostgreSQL for database
- Drizzle ORM for database interactions

## Project Structure

```
├── client/ - Frontend React application
│   ├── src/
│   │   ├── components/ - Reusable UI components
│   │   ├── hooks/ - Custom React hooks
│   │   ├── lib/ - Utility functions and types
│   │   ├── pages/ - Application pages
│   │   ├── App.tsx - Main application component
│   │   └── main.tsx - Application entry point
│
├── server/ - Backend Express server
│   ├── index.ts - Server entry point
│   ├── routes.ts - API route definitions
│   ├── storage.ts - Data storage and persistence
│   └── vite.ts - Development server configuration
│
├── shared/ - Shared code between client and server
│   └── schema.ts - Database schema and type definitions
│
├── adonisjs/ - AdonisJS backend application
│   ├── app/
│   │   ├── controllers/ - API controllers
│   │   └── models/ - Data models
│   ├── config/ - Application configuration
│   ├── database/ - Database migrations and seeders
│   └── start/ - Application bootstrap
│
└── scripts/ - Utility scripts for development and deployment
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` (if needed)
   - Configure database connection in `.env`

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` or the port configured in your environment.

### Database Setup

The application uses PostgreSQL with Drizzle ORM. To set up the database:

1. Make sure PostgreSQL is running
2. Apply database migrations:
   ```bash
   npm run db:push
   ```

## Architecture

The application follows a layered architecture:

1. **Presentation Layer**: React components and pages
2. **Application Layer**: API routes and controllers
3. **Domain Layer**: Business logic and service implementations
4. **Data Layer**: Database models and storage implementations

## API Documentation

The API follows RESTful principles with the following main endpoints:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/members` - Add team member

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
- `PATCH /api/projects/:id` - Update a project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/:taskId/comments` - Get task comments
- `POST /api/tasks/:taskId/comments` - Add a comment to a task

### Stats
- `GET /api/stats` - Get overall statistics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [AdonisJS](https://adonisjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)