import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Task from '#models/task'

export default class StatsController {
  /**
   * Get overall statistics for the dashboard
   */
  async index({ response }: HttpContext) {
    // Count projects
    const projectsCount = await Project.query().count('*', 'total')
    const totalProjects = parseInt(projectsCount[0].$extras.total || '0')
    
    // Count projects by status
    const inProgressProjects = await Project.query()
      .where('status', 'in_progress')
      .count('*', 'total')
    const inProgress = parseInt(inProgressProjects[0].$extras.total || '0')
    
    const completedProjects = await Project.query()
      .where('status', 'completed')
      .count('*', 'total')
    const completed = parseInt(completedProjects[0].$extras.total || '0')
    
    // Calculate overdue tasks
    const now = new Date()
    const overdueTasks = await Task.query()
      .whereNot('status', 'done')
      .where('dueDate', '<', now.toISOString())
      .count('*', 'total')
    const overdue = parseInt(overdueTasks[0].$extras.total || '0')
    
    return response.json({
      totalProjects,
      inProgress,
      completed,
      overdue
    })
  }
}