const knex = require('knex');

module.exports = {
  db: knex({
    client: "pg", 
    connection: {
      // host: process.env.DB_HOST,
      // port: process.env.DB_PORT,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  })
};
