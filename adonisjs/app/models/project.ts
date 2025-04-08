import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Team from './team.js'
import Task from './task.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare description: string | null
  
  @column()
  declare status: string
  
  @column()
  declare color: string
  
  @column()
  declare teamId: number
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
  @belongsTo(() => Team)
  declare team: Team
  
  @hasMany(() => Task)
  declare tasks: Task[]
}