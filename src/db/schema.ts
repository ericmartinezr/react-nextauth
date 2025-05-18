import { mysqlTable, int, datetime, varchar } from 'drizzle-orm/mysql-core';

export const sessionsTable = mysqlTable('sessions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').unique().notNull(),
  expiresAt: datetime('expires_at').notNull(),
});

export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
});
