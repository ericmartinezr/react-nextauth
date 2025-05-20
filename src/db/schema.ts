import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
});
