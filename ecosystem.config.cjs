module.exports = {
	apps: [
		{
			name: "brologue-backend",
			script: "dist/index.js",
			cwd: __dirname,
			instances: 1,
			exec_mode: "cluster",
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
			watch: false,
			max_memory_restart: "500M",
			error_file: "logs/pm2-error.log",
			out_file: "logs/pm2-out.log",
			merge_logs: true,
			time: true,
		},
	],
};

