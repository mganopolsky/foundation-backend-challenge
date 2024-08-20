import dotenv from 'dotenv';
dotenv.config();

console.log("Foundation Backend Challenge");

import { fetchAllTokensData } from './services/dataFetcher';

async function main() {
  console.log("Foundation Backend Challenge");
  
  try {
    await fetchAllTokensData();
    console.log("Data fetching completed");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

main();