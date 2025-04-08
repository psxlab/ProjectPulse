import { HttpContext } from '@adonisjs/core/http'
import Team from '#models/team'

export default class TeamsController {
  /**
   * Get all teams
   */
  async index({ response }: HttpContext) {
    const teams = await Team.all()
    return response.json(teams)
  }
  
  /**
   * Get a specific team by ID
   */
  async show({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    return response.json(team)
  }
  
  /**
   * Create a new team
   */
  async store({ request, response }: HttpContext) {
    const teamData = request.only(['name', 'description'])
    const team = await Team.create(teamData)
    return response.json(team)
  }
  
  /**
   * Update an existing team
   */
  async update({ params, request, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    const teamData = request.only(['name', 'description'])
    team.merge(teamData)
    await team.save()
    return response.json(team)
  }
  
  /**
   * Delete a team
   */
  async destroy({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    await team.delete()
    return response.json({ success: true })
  }
  
  /**
   * Get team members
   */
  async members({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    await team.load('members', (query) => {
      query.preload('user')
    })
    return response.json(team.members)
  }
  
  /**
   * Add a team member
   */
  async addMember({ params, request, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    const memberData = request.only(['userId', 'role'])
    
    const teamMemberData = {
      ...memberData,
      teamId: team.id
    }
    
    const teamMember = await team.related('members').create(teamMemberData)
    await teamMember.load('user')
    
    return response.json(teamMember)
  }
}