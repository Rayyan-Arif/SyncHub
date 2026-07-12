import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";

import { Pool } from "pg";

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: +process.env.DATABASE_PORT,

    max: 25,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000  
});

const createOwnerAccount = async() => {
    try{
        const password = await bcrypt.hash('test1234', 12);

        await pool.query("INSERT INTO users (user_name, user_email, user_password, user_role) values ($1, $2, $3, $4);", ['Owner Khan', 'owner@gmail.com', password, 'OWNER']);
    } catch(err){
        console.error(err);
    }
}

await createOwnerAccount();