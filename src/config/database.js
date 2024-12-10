const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('med-app-dev', 'root', '005078xzq', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


sequelize.authenticate()
    .then(() => {
        console.log('Database connected.');
        // Add this part to sync models
        return sequelize.sync({alter:true}); // or { force: true } for development
    })
    .then(() => {
        console.log('Models synchronized with database.');
    })
    .catch(err => console.error('Unable to connect to the database:', err));
module.exports = sequelize;
