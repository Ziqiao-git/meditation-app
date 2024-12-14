const { Sequelize } = require('sequelize');

const getDbHost = () => {
    console.log('Build timestamp: ' + new Date().toISOString());
    const host = process.env.NODE_ENV === 'kubernetes' ? 'mysql-service' : 
                 process.env.NODE_ENV === 'development' ? (process.env.DB_HOST || 'db') : 
                 'localhost';
    console.log('\n=== Database Connection Configuration ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('Resolved Host:', host);
    console.log('Process Environment:', process.env);
    console.log('=====================================\n');
    return host;
};

const sequelize = new Sequelize('med-app-dev', 'root', '005078xzq', {
    host: getDbHost(),
    port: 3306,
    dialect: 'mysql',
    logging: (msg) => console.log('Sequelize Log:', msg),
    dialectOptions: {
        connectTimeout: 60000,
        socketPath: undefined,
        debug: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectWithRetry = async (retries = 5) => {
    for (let i = retries; i > 0; i--) {
        try {
            const config = {
                host: getDbHost(),
                port: 3306,
                database: 'med-app-dev',
                user: 'root'
            };
            console.log('\n=== Connection Attempt ===');
            console.log('Config:', JSON.stringify(config, null, 2));
            console.log('========================\n');
            
            await sequelize.authenticate();
            console.log('Database connected successfully');
            
            const models = require('../models');
            await sequelize.sync({ alter: false });
            console.log('All models synchronized with database');
            return;
        } catch (err) {
            console.log('\n=== Connection Error ===');
            console.log('Failed to connect. Retries left:', i-1);
            console.log('\n=== Database Connection Configuration ===');
            console.log('NODE_ENV:', process.env.NODE_ENV);
            console.log('DB_HOST:', process.env.DB_HOST);
            console.log('Process Environment:', process.env);
            console.log('=====================================\n');
            console.log('Error Type:', err.constructor.name);
            console.log('Error Message:', err.message);
            console.log('Error Details:', {
                code: err.original?.code,
                errno: err.original?.errno,
                syscall: err.original?.syscall,
                address: err.original?.address,
                port: err.original?.port,
                hostname: err.original?.hostname
            });
            console.log('=====================\n');
            
            if (i === 1) {
                console.error('Unable to connect to the database:', err);
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

connectWithRetry();

module.exports = sequelize;