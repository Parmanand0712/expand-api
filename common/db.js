const { Pool } = require('pg');
const config = require('./configuration/db.json');

const pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
});

module.exports = {

    query: async (text = '', params = []) => {
        try {
            const result = await pool.query(text, params);
            return result;
        } catch (error) { return null; }
    },

    transaction: async (text = '', params = []) => {
        try {
            const client = await pool.connect();
            
            try {
                await client.query('BEGIN');
                await client.query(text, params);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                return false;
            } finally {
                client.release();
                // eslint-disable-next-line
                return true;
            }
        } catch (error) {return null; }
    }   

};