const { gql } = require('graphql-request');

export const GET_TOKEN_HOUR_DATA = gql`
  query getTokenHourData($tokenAddress: String!, $startTime: Int!, $skip: Int!) {
    tokenHourDatas(
      where: { token: $tokenAddress, periodStartUnix_gte: $startTime }
      first: 100
      skip: $skip
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      open
      close
      high
      low
      priceUSD
    }
  }
`;

export const GET_TOKEN_DATA = gql`
  query getTokenData($tokenAddress: String!) {
    token(id: $tokenAddress) {
      name
      symbol
      totalSupply
      volumeUSD
      decimals
    }
  }
`;