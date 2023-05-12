import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;


const configDatabase = {
    connectionString: process.env.DATABASE_URL
};
let db;
export default db = new Pool(configDatabase);
