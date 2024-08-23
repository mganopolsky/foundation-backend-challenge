import { getLatestPollingTimeStamp, initDatabase } from '../db/init-db';
import { DAYS_TO_GET_DATA, MILLISECONDS, MILLISECONDS_IN_AN_HOUR, SECONDS_IN_AN_HOUR } from '../config/constants';
import { fetchAndStoreTokensData } from './tokenService';

/**
 * This function will load the historical 7-day data into the db, if none exists.
 * If data does exist, it will skip the historical loading and it will just set up the polling service.
 * Polling service will run once an hour.
 */
async function initialize() {
    try {
        // Initialize the database
        await initDatabase();
        console.info("Database initialization successful");

        // Load historical data if none exists
        const lastPollDate = await getLatestPollingTimeStamp();
        if (lastPollDate == null) {
            await loadHistoricalData();
        }

        // Delay the start of the polling service by one hour after historical data loading
        setTimeout(startPollingService, MILLISECONDS_IN_AN_HOUR);
    } catch (error) {
        console.error(`[ERROR]: ${JSON.stringify(error)}`);
        process.exit(1); // Exit if initialization fails
    }
}

function getStartAndEndTimestampsForDaysAgo(daysAgo: number): [number, number] {
    const now = Math.floor(Date.now() / MILLISECONDS);
    const endTimestamp = now - (daysAgo * 24 * 60 * 60);
    const startTimestamp = endTimestamp - (24 * 60 * 60);
    return [startTimestamp, endTimestamp];
}

async function fetchAndStoreHistoricalDataForDate(startTimestamp: number, endTimestamp: number): Promise<void> {
    try {
        console.info(`Fetching data from ${startTimestamp} to ${endTimestamp}`);
        await fetchAndStoreTokensData(startTimestamp, endTimestamp);
    } catch (error) {
        console.error(`Error fetching and storing data from ${startTimestamp} to ${endTimestamp}:`, error);
    }
}

async function loadHistoricalData(): Promise<void> {
    console.info("Loading historical data");
  
    // Generate tasks for each day
    const tasks = Array.from({ length: DAYS_TO_GET_DATA }, (_, daysAgo) => {
      const [startTimestamp, endTimestamp] = getStartAndEndTimestampsForDaysAgo(daysAgo + 1);
      return () => fetchAndStoreHistoricalDataForDate(startTimestamp, endTimestamp);
    });
  
    // Run tasks concurrently
    try {
      await Promise.all(tasks.map(task => task()));
      console.log("Historical data loading completed");
    } catch (error) {
      console.error("Error during historical data loading:", error);
    }
}

async function startPollingService() {
    async function pollData() {
        // Get current timestamp
        const now = Math.floor(Date.now() / MILLISECONDS);
        // Define polling interval
        const endTime = now;
        const startTime = endTime - SECONDS_IN_AN_HOUR; // 3600 seconds = 1 hour

        try {
            console.info(`Polling: Fetching data from ${startTime} to ${endTime}`);
            await fetchAndStoreTokensData(startTime, endTime);
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
