import { gql } from 'graphql-request';

export const RECORD_LIMIT_COUNT = 100

export const GET_TOKEN_HOUR_DATA = gql`
  query getTokenHourData($tokenAddress: ID!, $startTime: Int!, $skip: Int!) {
    tokenDayDatas(
      where: { token: $tokenAddress, date_gte: $startTime }
      first: RECORD_LIMIT_COUNT
      skip: $skip
      orderBy: date
      orderDirection: asc
    ) {
      date
      open
      high
      low
      close
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
