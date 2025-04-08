import { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'

export default class TasksController {
  /**
   * Get all tasks, optionally filtered by project or assignee
   */
  async index({ request, response }: HttpContext) {
    const { projectId, assigneeId, status } = request.qs()
    
    let query = Task.query()
    
    if (projectId) {
      query = query.where('projectId', projectId)
    }
    
    if (assigneeId) {
      query = query.where('assigneeId', assigneeId)
    }
    
    if (status) {
      query = query.where('status', status)
    }
    
    // Add preloads for relationships
    query = query.preload('assignee').preload('creator')
    
    const tasks = await query.exec()
    return response.json(tasks)
  }
  
  /**
   * Get a specific task by ID
   */
  async show({ params, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await task.load('assignee')
    await task.load('creator')
    
    return response.json(task)
  }
  
  /**
   * Create a new task
   */
  async store({ request, response }: HttpContext) {
    const taskData = request.only([
      'title', 
      'description', 
      'status', 
      'priority',
      'projectId',
      'assigneeId',
      'creatorId',
      'progress',
      'dueDate',
      'tags'
    ])
    
    const task = await Task.create(taskData)
    await task.load('assignee')
    await task.load('creator')
    
    return response.json(task)
  }
  
  /**
   * Update an existing task
   */
  async update({ params, request, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    
    const taskData = request.only([
      'title', 
      'description', 
      'status', 
      'priority',
      'assigneeId',
      'progress',
      'dueDate',
      'tags'
    ])
    
    task.merge(taskData)
    await task.save()
    
    await task.load('assignee')
    await task.load('creator')
    
    return response.json(task)
  }
  
  /**
   * Delete a task
   */
  async destroy({ params, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await task.delete()
    return response.json({ success: true })
  }
  
  /**
   * Get comments for a task
   */
  async comments({ params, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await task.load('comments', (query) => {
      query.preload('user').orderBy('createdAt', 'desc')
    })
    
    return response.json(task.comments)
  }
  
  /**
   * Add a comment to a task
   */
  async addComment({ params, request, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    const commentData = request.only(['userId', 'content'])
    
    const comment = await task.related('comments').create(commentData)
    await comment.load('user')
    
    return response.json(comment)
  }
}