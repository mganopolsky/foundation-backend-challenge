import { SEVEN_DAYS_OF_DATA_BY_THE_SECOND } from "../config/constants";
import { TOKENS } from "../config/tokens";
import { storeTokenData, storeTokenHourData } from "../db/save";
import { fetchTokenData, fetchTokenHourData } from "./gql";

export async function fetchAndStoreTokensData(symbol: string, address:string): Promise<void> {
  
    for (const [symbol, address] of Object.entries(TOKENS)) {
      console.log(`Fetching data for ${symbol}...`);
      
      const tokenData = await fetchTokenData(address);
      console.log(`Token data:`, tokenData);
      await storeTokenData(tokenData, address);
  
      const dayData = await fetchTokenHourData(address, SEVEN_DAYS_OF_DATA_BY_THE_SECOND);
      console.log(`Fetched ${dayData.length} day data points for ${symbol}`);
      await storeTokenHourData(address, dayData);
    }
  }