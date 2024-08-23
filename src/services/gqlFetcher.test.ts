// Mock the entire client module before importing it
jest.mock('../graphql/client', () => ({
    graphqlClient: {
      request: jest.fn(),
    },
  }));
  
  import { graphqlClient } from "../graphql/client";
  import { fetchTokenHourData } from "./gqlFetcher";
  
  describe('fetchTokenHourData', () => {
    const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const startTime = 1622515200; // Example Unix timestamp
    const endTime = 1622601600; // Example Unix timestamp
    const mockResponse = {
      tokenHourDatas: [
        {
          periodStartUnix: 1622518800,
          open: 1.0,
          close: 2.0,
          high: 3.0,
          low: 0.5,
          priceUSD: 1.5,
          token: {
            id: tokenAddress,
          },
        },
      ],
    };
  
    beforeEach(() => {
      // Here we assert the request method is properly mocked
      (graphqlClient.request as jest.Mock).mockResolvedValue(mockResponse);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should fetch and return token hour data with date conversion', async () => {
      const result = await fetchTokenHourData(tokenAddress, startTime, endTime);
  
      expect(graphqlClient.request).toHaveBeenCalledWith(
        expect.any(String), // Check the query string
        {
          tokenAddress: tokenAddress.toLowerCase(),
          skip: 0,
          startTime,
          endTime,
          first: expect.any(Number), // Check the limit
        }
      );
  
      expect(result).toEqual([
        {
          date: new Date(mockResponse.tokenHourDatas[0].periodStartUnix * 1000),
          open: 1.0,
          close: 2.0,
          high: 3.0,
          low: 0.5,
          priceUSD: 1.5,
          tokenAddress: tokenAddress.toLowerCase(),
        },
      ]);
    });
  
    it('should fetch all pages of data until less than 100 records are returned', async () => {
      await fetchTokenHourData(tokenAddress, startTime, endTime);
  
      expect(graphqlClient.request).toHaveBeenCalledTimes(1);
      // Additional expectations based on your actual pagination logic
    });
  });