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

const getDbConfig = () => {
    // For unit tests with SQLite
    if (process.env.NODE_ENV === 'test' && process.env.DB_TYPE === 'sqlite') {
        return {
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        };
    }
    
    // For integration tests with MySQL
    if (process.env.NODE_ENV === 'test' && process.env.DB_TYPE === 'mysql') {
        return {
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            database: 'med-app-test',
            username: 'root',
            password: '005078xzq',
            logging: false
        };
    }

    // Default production/development config
    return {
        dialect: 'mysql',
        host: getDbHost(),
        port: 3306,
        database: 'med-app-dev',
        username: 'root',
        password: '005078xzq',
        logging: (msg) => console.log('Sequelize Log:', msg),
        dialectOptions: {
            connectTimeout: 60000,
            socketPath: undefined,
            debug: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    };
};

const sequelize = new Sequelize(getDbConfig());

const connectWithRetry = async (retries = 5) => {
    if (process.env.NODE_ENV === 'unit-test') {
        try {
            await sequelize.authenticate();
            console.log('Test database connected successfully');
            const models = require('../models');
            await sequelize.sync({ force: true });
            console.log('Test database synchronized');
            return;
        } catch (err) {
            console.error('Test database setup failed:', err);
            throw err;
        }
    }

    for (let i = retries; i > 0; i--) {
        try {
            await sequelize.authenticate();
            console.log('Database connected successfully');
            const models = require('../models');
            await sequelize.sync({ alter: false });
            console.log('All models synchronized with database');
            return;
        } catch (err) {
            if (i === 1) {
                console.error('Unable to connect to the database:', err);
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

if (process.env.NODE_ENV !== 'test') {
    connectWithRetry();
}

module.exports = sequelize;