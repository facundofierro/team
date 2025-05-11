module.exports = {
  apps: [
    {
      name: 'teamhub',
      script: 'pnpm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
