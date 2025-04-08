/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to setup the HTTP server and to define
| global middleware that runs before and after each HTTP request.
|
*/

import { HttpServer } from '@adonisjs/core/build/standalone'

/**
 * Creating the HTTP server with configuration from the .env file
 */
const server = new HttpServer()

/**
 * Starting the HTTP server and booting the application
 */
export default server