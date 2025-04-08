import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Get all users
   */
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json(users)
  }
  
  /**
   * Get a specific user by ID
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.json(user)
  }
  
  /**
   * Create a new user
   */
  async store({ request, response }: HttpContext) {
    const userData = request.only(['username', 'email', 'name', 'password', 'avatar'])
    const user = await User.create(userData)
    return response.json(user)
  }
  
  /**
   * Update an existing user
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const userData = request.only(['username', 'email', 'name', 'password', 'avatar'])
    user.merge(userData)
    await user.save()
    return response.json(user)
  }
  
  /**
   * Delete a user
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.json({ success: true })
  }
}