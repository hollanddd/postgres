// import pg from "pg";
import { createPool } from "./postgres";
import { format } from "./formatter";

const max = process.env.MAX_CONNECTIONS
  ? parseInt(process.env.MAX_CONNECTIONS)
  : 10;

const idleTimeoutMillis = process.env.IDLE_TIMEOUT_MILLIS
  ? parseInt(process.env.IDLE_TIMEOUT_MILLIS)
  : 5000;

const connectionTimeoutMillis = process.env.CONN_TIMEOUT_MILLIS
  ? parseInt(process.env.CONN_TIMEOUT_MILLIS)
  : 5000;

const pool = createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max,
  idleTimeoutMillis,
  connectionTimeoutMillis,
});

async function _query(text: string, values?: any[] | undefined) {
  const client = await pool.connect();

  try {
    return await client.query(text, values);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Construct SQL queries using a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates|tagged template}. The function translates queries into a native Postgres parameterized query to help {@link https://node-postgres.com/features/queries#parameterized-query|prevent SQL injections}.
 *
 * The function automatically creates a pooled database connection and connects to the databse specified by standard pg environment variables.
 *
 * @param strings The query as a template literal string .
 * @param values The values, if any, of the template literal string.
 * @return The result of the query.
 *
 * @example
 * const greeting = "Hello, world!";
 * const { rows, rowCount } =
 *   await sql`select ${greeting}::text as "message"`;
 *
 */
export async function sql(strings: any, ...values: any) {
  const parts: string[] = strings as string[];

  try {
    // extract parameters and add them to an array if any
    let text = values.length ? "" : strings.join("");

    // make a parameterized representation to be passed to `pg`
    if (values.length) {
      values.forEach((_: unknown, index: number) => {
        text += `${parts[index]}${"$" + (index + 1)}`;
      });
      text += parts[parts.length - 1];
    }

    text = format(text);

    return await _query(text, values);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid call to template literal");
    } else {
      throw error;
    }
  }
}
