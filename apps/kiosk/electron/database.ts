import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

export interface TransactionRow {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  customer_name: string | null;
  crypto_type: string;
  token_mint: string | null;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  customerName?: string;
  cryptoType: string;
  tokenMint?: string;
}

let db: Database.Database | null = null;

export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'ghostpay.db');
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed')),
      timestamp TEXT NOT NULL,
      customer_name TEXT,
      crypto_type TEXT NOT NULL,
      token_mint TEXT
    )
  `);
}

export function getTransactions(): Transaction[] {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC');
  const rows = stmt.all() as TransactionRow[];

  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    timestamp: new Date(row.timestamp),
    customerName: row.customer_name ?? undefined,
    cryptoType: row.crypto_type,
    tokenMint: row.token_mint ?? undefined,
  }));
}

export function saveTransaction(tx: Transaction): void {
  if (!db) throw new Error('Database not initialized');

  // Handle both Date objects and ISO strings
  const timestamp = tx.timestamp instanceof Date
    ? tx.timestamp
    : new Date(tx.timestamp);

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO transactions (id, amount, currency, status, timestamp, customer_name, crypto_type, token_mint)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    tx.id,
    tx.amount,
    tx.currency,
    tx.status,
    timestamp.toISOString(),
    tx.customerName ?? null,
    tx.cryptoType,
    tx.tokenMint ?? null
  );
}

export function deleteTransaction(id: string): void {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
  stmt.run(id);
}
