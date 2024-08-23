import { db, initDatabase, getLatestPollingTimeStamp } from './init-db';
import { TOKEN_TABLE_NAME, TOKEN_HOUR_DATA_TABLE_NAME, TokenHourData } from '../types';
import dotenv from 'dotenv';
import { storeTokenData, storeTokenHourData } from './save';

dotenv.config();

const TEST_TOKEN_ADDRESS = '0x123'
const TEST_TOKEN_NAME =  'Test Token'
const TEST_TOKEN_TICKER = 'TTK'

const TEST_TOKEN_DATA = {
  name: TEST_TOKEN_NAME,
  symbol: TEST_TOKEN_TICKER,
  totalSupply: 1000,
  volume: 5000,
  decimals: 18,
};

const TEST_TOKEN_HOUR_DATA: TokenHourData = {
  tokenAddress: TEST_TOKEN_ADDRESS,
  date: new Date(),
  open: 10,
  close: 15,
  high: 17,
  low: 8,
  priceUSD: 2
}

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await initDatabase();
    expect(consoleSpy).toHaveBeenCalledWith('Database initialized');
    consoleSpy.mockRestore();
  });

  afterEach(async () => {
    jest.clearAllTimers();
  })

  afterAll(async () => {
    // Clean up the test database if needed, and close the connection
    await db.none(`DELETE from ${TOKEN_HOUR_DATA_TABLE_NAME} WHERE token_address = '${TEST_TOKEN_ADDRESS}' ;`);
    await db.none(`DELETE from ${TOKEN_TABLE_NAME} where address = '${TEST_TOKEN_ADDRESS}'  ;`);
    await db.$pool.end(); // Close the connection

    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Wait for 1 second before ending the test suite
    });
  });

  it('should insert token hour data', async () => {
    //make sure the original token is there for the primary key check 
    await storeTokenData(TEST_TOKEN_DATA, TEST_TOKEN_ADDRESS);
    // Insert data using the storeTokenData function
    await storeTokenHourData(TEST_TOKEN_ADDRESS, [TEST_TOKEN_HOUR_DATA]);

    // Verify the data was inserted
    const tokenResult = await db.oneOrNone(`SELECT * FROM ${TOKEN_TABLE_NAME} WHERE address = $1`, [TEST_TOKEN_ADDRESS]);
    expect(tokenResult).not.toBeNull();
    expect(tokenResult.name).toBe(TEST_TOKEN_NAME);
    expect(tokenResult.symbol).toBe(TEST_TOKEN_TICKER);
  });
});