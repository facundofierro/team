import { eq, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export const getFunctions = (database: NodePgDatabase) => {
  return {
    addTable: (tableName: string, columns: string[]) =>
      database.execute(sql`CREATE TABLE ${tableName} (${columns.join(', ')})`),
    getTableNames: () =>
      database
        .select({ name: sql`table_name` })
        .from(sql`information_schema.tables`),
    getTableColumns: (tableName: string) =>
      database
        .select({ name: sql`column_name` })
        .from(sql`information_schema.columns`)
        .where(eq(sql`table_name`, tableName)),
    queryTable: (tableName: string, maxRows: number = 100) =>
      database
        .select()
        .from(sql`${tableName}`)
        .limit(maxRows),
    query: (query: string) => database.execute(sql`${query}`),
    insert: (tableName: string, data: any) =>
      database.execute(
        sql`INSERT INTO ${tableName} ${sql.raw(
          Object.keys(data)
            .map((key) => `${key}`)
            .join(', ')
        )} VALUES ${sql.raw(
          Object.values(data)
            .map((value) => `'${value}'`)
            .join(', ')
        )}`
      ),
    update: (tableName: string, id: string, data: any) =>
      database.execute(
        sql`UPDATE ${tableName} SET ${sql.raw(
          Object.entries(data)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ')
        )} WHERE id = ${id}`
      ),
    delete: (tableName: string, id: string) =>
      database.execute(sql`DELETE FROM ${tableName} WHERE id = ${id}`),
  }
}
