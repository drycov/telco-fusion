module.exports = {
  apps: [
    {
      name: "telco-fusion",
      cwd: "/opt/telco-fusion/",
      script: "npm run start:two",
      watch: true,
      autorestart: true,
      max_restarts: 10,
      ignore_watch: ["logs", "node_modules", "sessions", ".vscode", "src"],
      env_production: {
        NODE_ENV: "production",
        APP_TYPE: "PROD",
      },
      env_development: {
        NODE_ENV: "development",
        APP_TYPE: "DEV",
      },
    },
  ],
  deploy: {
    production: {
      host: "localhost",
      user: "root",
      ref: "origin/main", // Change to your default branch name
      repo: "https://github.com/drycov/telco-fusion.git", // HTTPS URL of your GitHub repo
      path: "/opt/ttcNSA",
      "post-deploy":
        "npm install && npm install --include dev && npm i -g typescript ts-node rimraf pre-commit nodemon copyfiles && npm run build && pm2 reload ecosystem.config.js --env production --trace",
    },
  },
};
