import { TOKEN_HOUR_DATA_TABLE_NAME, TOKEN_TABLE_NAME } from '../types';
import { db } from './database';

const init_table_query = `
    CREATE TABLE IF NOT EXISTS ${TOKEN_TABLE_NAME} (
      address TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      total_supply NUMERIC NOT NULL,
      volume_usd NUMERIC NOT NULL,
      decimals INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${TOKEN_HOUR_DATA_TABLE_NAME} (
      id SERIAL PRIMARY KEY,
      token_address TEXT REFERENCES ${TOKEN_TABLE_NAME}(address),
      date TIMESTAMP NOT NULL,
      open NUMERIC NOT NULL,
      high NUMERIC NOT NULL,
      low NUMERIC NOT NULL,
      close NUMERIC NOT NULL
    );
`
const last_timestamp_query = `SELECT MAX(date) AS latest_date
      FROM ${TOKEN_HOUR_DATA_TABLE_NAME};`

export async function initDatabase() {
  await db.none(init_table_query);
  console.log('Database initialized');
}

export async function getLatestPollingTimeStamp() : Promise<Date | null>{
  try {
    const result = await db.query(last_timestamp_query)

    if (result.rows.length > 0 && result.rows[0].latest_date) {
      const latestDate = new Date(result.rows[0].latest_date);

      return latestDate; // Data is already loaded, no need to load again      
    }
  } catch (error) {
    console.error("[ERROR]: Could not get latest timestamp : ", error)
  }
  // if no data exists, return null - indicates no history exists
  return null 
}
export { db };

