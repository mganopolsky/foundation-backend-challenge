import { MILLISECONDS, SECONDS_IN_AN_HOUR } from '../config/constants';
import { graphqlClient } from '../graphql/client';
import { GET_TOKEN_HOUR_DATA, GET_TOKEN_DATA, RECORD_LIMIT_COUNT } from '../graphql/queries';
import { TokenData, TokenHourData } from '../types';

export async function fetchTokenHourData(tokenAddress: string, startTime: number = -1): Promise<TokenHourData[]> {
    let allData: TokenHourData[] = [];
    let skip = 0;
  
    if (startTime == -1){
      startTime = Math.floor(Date.now() / MILLISECONDS) - SECONDS_IN_AN_HOUR;
    }

    while (true) {      
      const response: { tokenDayDatas: TokenHourData[] } = await graphqlClient.request(GET_TOKEN_HOUR_DATA, {
        tokenAddress: tokenAddress.toLowerCase(),
        startTime,
        skip
      });
  
      allData = allData.concat(response.tokenDayDatas);
  
      if (response.tokenDayDatas.length < 100) {
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

