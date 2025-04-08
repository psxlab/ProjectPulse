import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  /**
   * Get all projects, optionally filtered by team
   */
  async index({ request, response }: HttpContext) {
    const { teamId } = request.qs()
    
    let query = Project.query()
    
    if (teamId) {
      query = query.where('teamId', teamId)
    }
    
    const projects = await query.exec()
    return response.json(projects)
  }
  
  /**
   * Get a specific project by ID
   */
  async show({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    return response.json(project)
  }
  
  /**
   * Create a new project
   */
  async store({ request, response }: HttpContext) {
    const projectData = request.only([
      'name', 
      'description', 
      'teamId', 
      'status', 
      'color'
    ])
    
    const project = await Project.create(projectData)
    return response.json(project)
  }
  
  /**
   * Update an existing project
   */
  async update({ params, request, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    
    const projectData = request.only([
      'name', 
      'description', 
      'status', 
      'color'
    ])
    
    project.merge(projectData)
    await project.save()
    
    return response.json(project)
  }
  
  /**
   * Delete a project
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.json({ success: true })
  }
  
  /**
   * Get stats for a specific project
   */
  async stats({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    
    // Load tasks and count by status
    await project.load('tasks')
    
    const tasks = project.tasks || []
    
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length
    
    // Calculate overdue tasks (tasks with due dates in the past that aren't done)
    const now = new Date()
    const overdueTasksCount = tasks.filter(task => {
      return task.status !== 'done' && 
             task.dueDate && 
             new Date(task.dueDate.toString()) < now
    }).length
    
    return response.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasksCount
    })
  }
}