import { openDatabase } from "react-native-sqlite-storage";
import type { SQLiteDatabase } from "react-native-sqlite-storage";

export async function connectDb(databaseName: string): Promise<SQLiteDatabase> {
  const db = await openDatabase({
    name: databaseName,
    location: "default",
  });

  return db;
}

export const DATABASE_NAME = "ExchangeDB";

export const TABLE_NAME = "exchange_table";
