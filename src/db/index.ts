import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sessionsTable, usersTable } from './schema';
import { eq } from 'drizzle-orm';

const poolConnection = mysql.createPool({
  host: process.env.SQL_HOST,
  port: Number(process.env.SQL_PORT),
  user: process.env.SQL_USER,
  password: process.env.SQL_PWD,
  database: process.env.SQL_DB,
});
const db = drizzle({ client: poolConnection, logger: true });

export async function insertSession(id: number, expiresAt: Date) {
  return await db
    .insert(sessionsTable)
    .values({
      userId: id,
      expiresAt,
    })
    .onDuplicateKeyUpdate({ set: { expiresAt } })
    .$returningId();
}

export async function updateSession(id: number, expiresAt: Date) {
  return await db
    .update(sessionsTable)
    .set({ expiresAt })
    .where(eq(sessionsTable.id, id))
    .execute();
}

export async function insertUser(
  name: string,
  email: string,
  password: string
) {
  return await db
    .insert(usersTable)
    .values({
      name,
      email,
      password,
    })
    .$returningId()
    .execute();
}

export async function getUserById(id: number) {
  return await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .execute();
}

export async function getUserByEmail(email: string) {
  return await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .execute();
}
