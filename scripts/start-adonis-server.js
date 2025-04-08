const { spawn } = require('child_process');
const path = require('path');

// Path to AdonisJS application directory
const adonisAppPath = path.join(__dirname, '../adonisjs');

// Start AdonisJS server
const adonisProcess = spawn('node', ['index.js'], {
  cwd: adonisAppPath,
  stdio: 'pipe',
  env: { ...process.env, PORT: 3333 } // Set AdonisJS to run on port 3333
});

// Log the output from AdonisJS
adonisProcess.stdout.on('data', (data) => {
  console.log(`[AdonisJS]: ${data.toString().trim()}`);
});

adonisProcess.stderr.on('data', (data) => {
  console.error(`[AdonisJS Error]: ${data.toString().trim()}`);
});

adonisProcess.on('close', (code) => {
  console.log(`AdonisJS process exited with code ${code}`);
});

// Ensure AdonisJS process is terminated when this script is terminated
process.on('SIGINT', () => {
  console.log('Terminating AdonisJS process...');
  adonisProcess.kill('SIGINT');
  process.exit(0);
});