# Postgres

A PostgreSQL utility library aimed as serverless compute on AWS RDS.

# Install

```bash
npm install lit-postgres --save
```

# SQL tagged template

`sql`

Construct SQL queries using a [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates). The function translates queries into a native Postgres parameterized query to help [prevent SQL injections](https://node-postgres.com/features/queries#parameterized-query).

The function automatically creates a pooled database connection and connects to the databse specified by standard pg environment variables.

```typescript
 const greeting = "Hello, world!";
 const { rows, rowCount } =
   await sql`select ${greeting}::text as "message"`;
```
