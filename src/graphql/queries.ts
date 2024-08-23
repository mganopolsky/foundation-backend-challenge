import { gql } from 'graphql-request';

export const RECORD_LIMIT_COUNT = 100

export const GET_TOKEN_HOUR_DATA_QUERY = gql`
  query getTokenHourData($tokenAddress: String!, $skip: Int!, $startTime: Int!, $endTime: Int!, $first: Int!) {
    tokenHourDatas(
      where: { 
        token: $tokenAddress 
        periodStartUnix_gte: $startTime
        periodStartUnix_lt: $endTime
      }
      first: $first
      skip: $skip
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      open
      high
      low
      close
      priceUSD
      token {
        id
      }
    }
  }
`;

export const GET_TOKEN_DATA = gql`
  query getTokenData($tokenAddress: ID!) {
    token(id: $tokenAddress) {
      name
      symbol
      totalSupply
      volume
      decimals
    }
  }
`;
