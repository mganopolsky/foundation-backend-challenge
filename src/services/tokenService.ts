import { SEVEN_DAYS_OF_DATA_BY_THE_SECOND, MILLISECONDS } from "../config/constants";
import { TOKENS } from "../config/tokens";
import { storeTokenData, storeTokenHourData } from "../db/save";
import { fetchTokenData, fetchTokenHourData } from "./gqlFetcher";

export async function fetchAndStoreTokensData(timeSince: number, timeTill: number): Promise<void> {
  for (const [symbol, address] of Object.entries(TOKENS)) {
    console.log(`Fetching data for ${symbol}...`);
    
    //existing tokenData will be overwritten
    const tokenData = await fetchTokenData(address);
    console.log(`Token data:`, tokenData);
    await storeTokenData(tokenData, address);

    // now load the latest tokenHourData
    const hourlyData = await fetchTokenHourData(address, timeSince, timeTill);
    console.log(`Fetched ${hourlyData.length} day data points for ${symbol}`);
    await storeTokenHourData(address, hourlyData);
  }
}
