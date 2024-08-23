import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();
const API_KEY = process.env.UNISWAP_KEY;

if (!API_KEY) {
    throw new Error('UNISWAP_KEY is not set in the environment variables');
}

export const UNISWAP_V3_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

export const graphqlClient = new GraphQLClient(UNISWAP_V3_SUBGRAPH_URL);