module.exports = {
    apps : [{
        name: 'pdf-genServer',
        script: 'src/index.js',
        args: '',
        autorestart: true,
        max_memory_restart: '800M',
        instances: 2, // 根据需求设置实例数量
        exec_mode: 'cluster',
        watch: false,
        env: {
            NODE_ENV: 'production',
        },
    }]
};
