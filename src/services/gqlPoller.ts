import { getLatestPollingTimeStamp, initDatabase } from '../db/init-db';
import { fetchAndStoreTokensData } from './historicalTokenService';
import { MILLISECONDS_IN_AN_HOUR, TWO_SECOND_BUFFER } from '../config/constants';

/**
 * This function will load the historical 7-day data into the db, if none exists
 * If data does exist, it will skip the historical loading and it will just set up the polling service
 * Polling service will run once an hour
 */
async function initialize() {
 try {
     // Initialize the database
     await initDatabase();
     console.info("Database initialization successful");

     // Load historical data if needed
     const lastPollDate = await getLatestPollingTimeStamp();
     if (lastPollDate == null)
     {
         console.info("Loading historical data");
         await fetchAndStoreTokensData();
         console.log("Historical data loading completed");
     }
    
     startPollingService();
 } catch (error) {
     console.error(`[ERROR]: ${JSON.stringify(error)}`);
     process.exit(1); // Exit if initialization fails
 }
}

async function startPollingService() {
    async function pollData() {
        try {
            console.info("Polling: Fetching interval data");
            await fetchAndStoreTokensData(MILLISECONDS_IN_AN_HOUR - TWO_SECOND_BUFFER);
            console.log("Polling: Data fetching and storage completed");
        } catch (error) {
            console.error("Error fetching polling data:", error);
        }

        // Schedule the next poll after the current one completes
        setTimeout(pollData, MILLISECONDS_IN_AN_HOUR);
    }
    // Start the first polling cycle
    pollData();
}

// Initialize the application
initialize();
