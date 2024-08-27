import type { AST } from "node-sql-parser";
import { Parser } from "node-sql-parser";

const options = { database: "postgresql" };

const parser = new Parser();

const astify = (sql: string) => parser.astify(sql, options);

const sqlify = (ast: AST | AST[]) => parser.sqlify(ast, options);

export const format = (sql: string) => sqlify(astify(sql));
