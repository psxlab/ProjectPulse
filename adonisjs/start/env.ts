import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Core variables
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  
  // Database variables
  PGHOST: Env.schema.string(),
  PGPORT: Env.schema.string(),
  PGUSER: Env.schema.string(),
  PGPASSWORD: Env.schema.string(),
  PGDATABASE: Env.schema.string(),
  
  // App variables
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  APP_KEY: Env.schema.string()
})