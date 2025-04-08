import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Team from './team.js'

export default class TeamMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare teamId: number
  
  @column()
  declare userId: number
  
  @column()
  declare role: string
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
  @belongsTo(() => Team)
  declare team: Team
  
  @belongsTo(() => User)
  declare user: User
}