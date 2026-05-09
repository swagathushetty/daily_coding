
const { fork } = require('child_process');
const path = require('path');

function startProcess(file, label) {
  const child = fork(path.join(__dirname, file), [], { silent: false });

  child.on('error', err => {
    console.error(`[RUNNER] Failed to start ${label}:`, err.message);
  });

  child.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`[RUNNER] ${label} exited with code ${code} (${signal})`);
    }
  });

  return child;
}

console.log('[RUNNER] Starting main service + sidecar...\n');
console.log('Architecture:');
console.log('  External traffic → :8080 (sidecar) → :3000 (main service)');
console.log('  Main service is NOT reachable directly from outside.\n');

// Start main service first, give it a moment, then start sidecar
const main = startProcess('main-service.js', 'main-service');

setTimeout(() => {
  startProcess('sidecar.js', 'sidecar');
}, 500);

process.on('SIGINT', () => {
  console.log('\n[RUNNER] Shutting down...');
  main.kill();
  process.exit(0);
});
