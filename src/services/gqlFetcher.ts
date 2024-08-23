import { MILLISECONDS, SECONDS_IN_AN_HOUR } from '../config/constants';
import { graphqlClient } from '../graphql/client';
import { GET_TOKEN_HOUR_DATA_QUERY, GET_TOKEN_DATA, RECORD_LIMIT_COUNT } from '../graphql/queries';
import { TokenData, TokenHourData, UniswapTokenHourData } from '../types';


/*
fetchTokenHourData gets the token's historical data information
tokenAddress has be lowercase, as per requirements
*/
export async function fetchTokenHourData(tokenAddress: string, startTime: number, endTime: number): Promise<TokenHourData[]> {
    let allData: TokenHourData[] = [];
    let skip = 0;
    const recordLimitCount = RECORD_LIMIT_COUNT

    // query until we have less then 100 records
    // addresses have to be lowercase as per requirements
    while (true) {      
      const response: { tokenHourDatas: UniswapTokenHourData[] } = await graphqlClient.request(GET_TOKEN_HOUR_DATA_QUERY, {
        tokenAddress: tokenAddress.toLowerCase(),        
        skip,
        startTime,
        endTime,
        first: recordLimitCount
      });

      const tokenData: TokenHourData[] = response.tokenHourDatas.map(data => ({
        date: new Date(data.periodStartUnix * 1000), // Convert Unix timestamp to Date
        open: data.open,
        close: data.close,
        high: data.high,
        low: data.low,
        priceUSD: data.priceUSD,
        tokenAddress: data.token.id // Assign the token address
      }));

            
      allData = allData.concat(tokenData);
  
      if (tokenData.length < 100) {
        break;
      }
  
      skip += RECORD_LIMIT_COUNT;
    }
  
    return allData;
  }

export async function fetchTokenData(tokenAddress: string): Promise<TokenData> {
  const response: { token: TokenData } = await graphqlClient.request(GET_TOKEN_DATA, {
    tokenAddress: tokenAddress.toLowerCase()
  });

  return response.token;
}

