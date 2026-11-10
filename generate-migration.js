const { spawn } = require('child_process');

const p = spawn('npx.cmd', ['drizzle-kit', 'generate'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

p.stdout.on('data', (d) => {
  const str = d.toString();
  process.stdout.write(str);
  
  if (str.includes('Is habit_resets table created or renamed')) {
    // We want option 2: streak_resets -> habit_resets
    setTimeout(() => {
      p.stdin.write('\x1B[B\r'); // Arrow Down, Enter
    }, 500);
  }
  
  if (str.includes('Is habits table created or renamed')) {
    // We want option 2: streaks -> habits
    setTimeout(() => {
      p.stdin.write('\x1B[B\r'); // Arrow Down, Enter
    }, 500);
  }
});

p.stderr.on('data', (d) => process.stderr.write(d));
p.on('close', (code) => console.log('Process exited with code', code));
