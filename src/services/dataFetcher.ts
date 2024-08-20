import { graphqlClient } from '../graphql/client';
import { GET_TOKEN_HOUR_DATA, GET_TOKEN_DATA } from '../graphql/queries';
import { TOKENS } from '../config/tokens';

interface TokenHourData {
  periodStartUnix: string;
  open: string;
  close: string;
  high: string;
  low: string;
  priceUSD: string;
}

interface TokenData {
    name: string;
    symbol: string;
    totalSupply: string;
    volume: string;
    decimals: string;
  }

interface TokenDayData {
    date: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }

  export async function fetchTokenHourData(tokenAddress: string, startTime: number): Promise<TokenDayData[]> {
    let allData: TokenDayData[] = [];
    let skip = 0;
  
    while (true) {
      const response: { tokenDayDatas: TokenDayData[] } = await graphqlClient.request(GET_TOKEN_HOUR_DATA, {
        tokenAddress: tokenAddress.toLowerCase(),
        startTime,
        skip
      });
  
      allData = allData.concat(response.tokenDayDatas);
  
      if (response.tokenDayDatas.length < 100) {
        break;
      }
  
      skip += 100;
    }
  
    return allData;
  }

export async function fetchTokenData(tokenAddress: string): Promise<TokenData> {
  const response: { token: TokenData } = await graphqlClient.request(GET_TOKEN_DATA, {
    tokenAddress: tokenAddress.toLowerCase()
  });

  return response.token;
}

export async function fetchAllTokensData(): Promise<void> {
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

  for (const [symbol, address] of Object.entries(TOKENS)) {
    console.log(`Fetching data for ${symbol}...`);
    
    const tokenData = await fetchTokenData(address);
    console.log(`Token data:`, tokenData);

    const hourData = await fetchTokenHourData(address, sevenDaysAgo);
    console.log(`Fetched ${hourData.length} day data points for ${symbol}`);

    // TODO: Store this data in the database
  }
}