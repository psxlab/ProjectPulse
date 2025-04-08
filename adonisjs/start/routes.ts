import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import TeamsController from '#controllers/teams_controller'
import ProjectsController from '#controllers/projects_controller'
import TasksController from '#controllers/tasks_controller'
import StatsController from '#controllers/stats_controller'

/**
 * User routes
 */
router.get('/api/users', [UsersController, 'index'])
router.get('/api/users/:id', [UsersController, 'show'])
router.post('/api/users', [UsersController, 'store'])
router.put('/api/users/:id', [UsersController, 'update'])
router.delete('/api/users/:id', [UsersController, 'destroy'])

/**
 * Team routes
 */
router.get('/api/teams', [TeamsController, 'index'])
router.get('/api/teams/:id', [TeamsController, 'show'])
router.post('/api/teams', [TeamsController, 'store'])
router.put('/api/teams/:id', [TeamsController, 'update'])
router.delete('/api/teams/:id', [TeamsController, 'destroy'])

// Team members
router.get('/api/teams/:id/members', [TeamsController, 'members'])
router.post('/api/teams/:id/members', [TeamsController, 'addMember'])

/**
 * Project routes
 */
router.get('/api/projects', [ProjectsController, 'index'])
router.get('/api/projects/:id', [ProjectsController, 'show'])
router.post('/api/projects', [ProjectsController, 'store'])
router.put('/api/projects/:id', [ProjectsController, 'update'])
router.delete('/api/projects/:id', [ProjectsController, 'destroy'])
router.get('/api/projects/:id/stats', [ProjectsController, 'stats'])

/**
 * Task routes
 */
router.get('/api/tasks', [TasksController, 'index'])
router.get('/api/tasks/:id', [TasksController, 'show'])
router.post('/api/tasks', [TasksController, 'store'])
router.put('/api/tasks/:id', [TasksController, 'update'])
router.delete('/api/tasks/:id', [TasksController, 'destroy'])

// Task comments
router.get('/api/tasks/:id/comments', [TasksController, 'comments'])
router.post('/api/tasks/:id/comments', [TasksController, 'addComment'])

/**
 * Stats routes
 */
router.get('/api/stats', [StatsController, 'index'])