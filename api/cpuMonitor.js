const pidusage = require('pidusage');
const { exec } = require('child_process');

function startCpuMonitor(threshold = 70, interval = 5000) {
  console.log("start CPU Monitor");
  setInterval(() => {
    pidusage(process.pid, (err, stats) => {
      if (err) return console.error("CPU monitor error:", err);

      console.log(`CPU: ${stats.cpu.toFixed(2)}%`);

      if (stats.cpu > threshold) {
        console.warn("High CPU detected. Restarting...");
        exec('pm2 restart app'); // Ensure app is started with PM2 and named 'app'
      }
    });
  }, interval);
}

module.exports = startCpuMonitor;