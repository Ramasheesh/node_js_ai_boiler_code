module.exports = {
  apps: [
    {
      name: 'backend-boilerplate',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_file: 'logs/pm2-combined.log',
      time: true,
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 10000,
    },
  ],
};
