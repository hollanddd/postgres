import pg from "pg";

const { Pool } = pg;

let pool: any;

export const createPool = (args: any) => {
  if (pool) return pool;
  pool = new Pool(args);
  return pool;
};

export const createClient = async (args: any) => {
  const pool = createPool(args);
  const client = await pool.connect();
  const query = client.query();
  const release = client.release();

  client.query = (...args: any) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};
