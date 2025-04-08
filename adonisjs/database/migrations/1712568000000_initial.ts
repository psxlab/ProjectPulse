import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('name', 255).notNullable()
      table.string('password', 255).notNullable()
      table.string('avatar', 255).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('teams', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('team_members', (table) => {
      table.increments('id').primary()
      table.integer('team_id').unsigned().references('id').inTable('teams').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('role', 50).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('projects', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.string('status', 50).notNullable().defaultTo('in_progress')
      table.string('color', 50).notNullable().defaultTo('#4a6cf7')
      table.integer('team_id').unsigned().references('id').inTable('teams').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('tasks', (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.string('status', 50).notNullable().defaultTo('todo')
      table.string('priority', 50).notNullable().defaultTo('medium')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE')
      table.integer('assignee_id').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.integer('creator_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('progress').unsigned().nullable()
      table.timestamp('due_date', { useTz: true }).nullable()
      table.json('tags').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('comments', (table) => {
      table.increments('id').primary()
      table.text('content').notNullable()
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable('comments')
    this.schema.dropTable('tasks')
    this.schema.dropTable('projects')
    this.schema.dropTable('team_members')
    this.schema.dropTable('teams')
    this.schema.dropTable(this.tableName)
  }
}