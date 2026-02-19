import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "STD_Check",
  password: "Suriya010747",
  port: 5432,
});

export default pool;
