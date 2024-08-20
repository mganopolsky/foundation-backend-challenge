//import { GraphQLClient } from 'graphql-request';
const { GraphQLClient } = require('graphql-request');

const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

export const graphqlClient = new GraphQLClient(UNISWAP_V3_SUBGRAPH_URL);