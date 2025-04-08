import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Project from './project.js'
import User from './user.js'
import Comment from './comment.js'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string
  
  @column()
  declare description: string | null
  
  @column()
  declare status: string
  
  @column()
  declare priority: string
  
  @column()
  declare projectId: number
  
  @column()
  declare assigneeId: number | null
  
  @column()
  declare creatorId: number
  
  @column()
  declare progress: number | null
  
  @column.dateTime()
  declare dueDate: DateTime | null
  
  @column()
  declare tags: string[] // This will need special handling in migrations
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
  @belongsTo(() => Project)
  declare project: Project
  
  @belongsTo(() => User, {
    foreignKey: 'assigneeId',
  })
  declare assignee: User
  
  @belongsTo(() => User, {
    foreignKey: 'creatorId',
  })
  declare creator: User
  
  @hasMany(() => Comment)
  declare comments: Comment[]
}