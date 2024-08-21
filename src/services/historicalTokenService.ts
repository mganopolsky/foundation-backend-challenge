import { MILLISECONDS, SEVEN_DAYS_OF_DATA_BY_THE_SECOND } from "../config/constants";
import { TOKENS } from "../config/tokens";
import { storeTokenData, storeTokenHourData } from "../db/save";
import { fetchTokenData, fetchTokenHourData } from "./gql";

export async function fetchAndStoreTokensData(microsecondsSince: number = SEVEN_DAYS_OF_DATA_BY_THE_SECOND): Promise<void> {
    const sevenDaysAgoInSeconds = Math.floor(Date.now() / MILLISECONDS) - microsecondsSince;
  
    for (const [symbol, address] of Object.entries(TOKENS)) {
      console.log(`Fetching data for ${symbol}...`);
      
      const tokenData = await fetchTokenData(address);
      console.log(`Token data:`, tokenData);
      await storeTokenData(tokenData, address);
  
      const dayData = await fetchTokenHourData(address, sevenDaysAgoInSeconds);
      console.log(`Fetched ${dayData.length} day data points for ${symbol}`);
      await storeTokenHourData(address, dayData);
    }
  }

