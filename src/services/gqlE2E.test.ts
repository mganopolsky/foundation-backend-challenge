import { fetchTokenHourData } from "./gqlFetcher";

describe('fetchTokenHourData E2E from yesterdays 12pm-4pm time span', () => {
    const tokenAddress = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1); // Go to yesterday's date
    yesterday.setHours(12, 0, 0, 0); // Set time to 12:00 PM
    const startTime = Math.floor(yesterday.getTime() / 1000); // Convert to Unix timestamp

    const endTimeDate = new Date(yesterday);
    endTimeDate.setHours(16, 0, 0, 0); // Set time to 4:00 PM
    const endTime = Math.floor(endTimeDate.getTime() / 1000); // Convert to Unix timestamp


    it('should fetch token hour data from the GraphQL API', async () => {
        const data = await fetchTokenHourData(tokenAddress, startTime, endTime);

        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);

        // Validate that the structure matches the expected schema
        data.forEach(entry => {
        expect(entry).toHaveProperty('date');
        expect(entry).toHaveProperty('open');
        expect(entry).toHaveProperty('close');
        expect(entry).toHaveProperty('high');
        expect(entry).toHaveProperty('low');
        expect(entry).toHaveProperty('priceUSD');
        expect(entry).toHaveProperty('tokenAddress', tokenAddress.toLowerCase());
        });
    }, 500000000);
});
