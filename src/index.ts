import { initDatabase, getLatestPollingTimeStamp } from './db/init-db';
import { startServer } from './services/chartsServer';
import { fetchAndStoreTokensData } from './services/tokenService';
import { MILLISECONDS_IN_AN_HOUR } from './config/constants';

async function main() {
  console.log("Initializing application...");
  
  // Initialize the database
  await initDatabase();
  
  // Get the latest polling timestamp
  const lastPollDate = await getLatestPollingTimeStamp();
  
  // If no data exists, perform initial data ingestion
  if (lastPollDate === null) {
    console.log("No existing data found. Starting initial data ingestion...");
    await performInitialDataIngestion();
  }
  
  // Start the polling service
  startPollingService();
  
  // Start the API server
  startServer();
  
  console.log("Application initialized and running.");
}

async function performInitialDataIngestion() {
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - (7 * 24 * 60 * 60);
  await fetchAndStoreTokensData(sevenDaysAgo, now);
}

function startPollingService() {
  async function pollData() {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    
    try {
      await fetchAndStoreTokensData(oneHourAgo, now);
      console.log("Hourly data fetching completed");
    } catch (error) {
      console.error("Error fetching hourly data:", error);
    }
    
    // Schedule the next poll
    setTimeout(pollData, MILLISECONDS_IN_AN_HOUR);
  }
  
  // Start the first polling cycle
  pollData();
}

// Run the main function
main().catch(error => {
  console.error("Application failed to start:", error);
  process.exit(1);
});