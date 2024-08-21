import dotenv from 'dotenv';
import { initDatabase } from './db/init-db';
import { fetchAndStoreTokensData } from './services/historicalTokenService';

dotenv.config();

async function main() {
  console.log("Foundation Backend Challenge");
  
  try {
    await initDatabase();
    await fetchAndStoreTokensData();
    console.log("Data fetching amd storage completed");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

main();