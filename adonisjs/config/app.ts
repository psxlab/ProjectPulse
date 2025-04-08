import { defineConfig } from '@adonisjs/core/config'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Application name
  |--------------------------------------------------------------------------
  |
  | The name of your application. This value is used when the framework needs
  | to place your application's name in a notification or similar places.
  |
  */
  name: 'Project Management',

  /*
  |--------------------------------------------------------------------------
  | Default connection
  |--------------------------------------------------------------------------
  |
  | The default database connection to use for database operations in the
  | application.
  |
  */
  database: {
    connection: 'pg',
  },

  /*
  |--------------------------------------------------------------------------
  | Default application logger
  |--------------------------------------------------------------------------
  |
  | The default logger that must be used for logging application events
  |
  */
  logger: {
    default: 'application',
    channels: {
      application: {
        enabled: true,
        level: 'info',
        transport: 'console',
      },
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Application middleware
  |--------------------------------------------------------------------------
  |
  | Middleware are functions that have access to the HTTP request and response
  | before the application routes are handled.
  |
  */
  middleware: {
    register: [
      () => import('#middleware/container_bindings_middleware'),
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | HTTP server configuration
  |--------------------------------------------------------------------------
  |
  | The configuration for the HTTP server. The server is used to respond to
  | HTTP requests.
  |
  */
  http: {
    cookie: {},
    trustProxy: false,
  },
})