import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // For development/production with self-signed certs if needed
    },
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export default pool;
