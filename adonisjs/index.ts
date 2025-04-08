/*
|--------------------------------------------------------------------------
| AdonisJS Entry point
|--------------------------------------------------------------------------
|
| This file is the entry point for AdonisJS application. You should import
| the application instance and boot it to start the HTTP server.
|
*/

import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'

/**
 * Boot the application
 */
async function bootstrap() {
  const ignitor = new Ignitor(__dirname)
  const app = await ignitor.ace().handle(process.argv.slice(2))
  
  // In case the process was not terminated via ace commands
  if (app) {
    /**
     * Boot the application
     */
    await app.init()
    await app.boot()
    
    /**
     * Start the HTTP server
     */
    await app.start()
  }
}

bootstrap()
  .catch(console.error)