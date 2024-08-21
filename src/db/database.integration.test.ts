import { db, initDatabase, getLatestPollingTimeStamp } from './init-db';
import { TOKEN_TABLE_NAME, TOKEN_HOUR_DATA_TABLE_NAME } from '../types';
import dotenv from 'dotenv';

dotenv.config();

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // Initialize the database (run migrations, etc.)
    await initDatabase();
  });

  afterAll(async () => {
    // Clean up the test database if needed, and close the connection
    await db.none(`TRUNCATE TABLE ${TOKEN_HOUR_DATA_TABLE_NAME} RESTART IDENTITY CASCADE;`);
    await db.none(`TRUNCATE TABLE ${TOKEN_TABLE_NAME} RESTART IDENTITY CASCADE;`);
    await db.$pool.end(); // Close the connection
  });

  
  it.skip('should create tables and insert data', async () => {
    // Insert data into TOKEN_TABLE_NAME
    const tokenAddress = '0x123';
    const tokenInsertQuery = `
      INSERT INTO ${TOKEN_TABLE_NAME} (address, name, symbol, total_supply, volume_usd, decimals)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.none(tokenInsertQuery, [
      tokenAddress,
      'Test Token',
      'TTK',
      1000,
      5000,
      18
    ]);

    // Verify the data was inserted
    const tokenResult = await db.oneOrNone(`SELECT * FROM ${TOKEN_TABLE_NAME} WHERE address = $1`, [tokenAddress]);
    expect(tokenResult).not.toBeNull();
    expect(tokenResult.name).toBe('Test Token');
    expect(tokenResult.symbol).toBe('TTK');
  });

  it.skip('should return null when no polling data exists', async () => {
    const result = await getLatestPollingTimeStamp();
    expect(result).toBeNull();
  });

  it.skip('should return the latest timestamp when polling data exists', async () => {
    const tokenAddress = '0x123';
    const date = new Date('2024-01-01T00:00:00Z');
    const insertTokenHourDataQuery = `
      INSERT INTO ${TOKEN_HOUR_DATA_TABLE_NAME} (token_address, date, open, high, low, close)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.none(insertTokenHourDataQuery, [tokenAddress, date, 10, 20, 5, 15]);

    const latestDate = await getLatestPollingTimeStamp();
    expect(latestDate).toEqual(date);
  });
});