import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initDatabase } from '../db/init-db';
import { getDBChartData } from './database';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Base route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/getChartData', async (req, res) => {
    const { tokenSymbol, timeUnitInHours } = req.query;
  
    if (!tokenSymbol || !timeUnitInHours) {
      return res.status(400).json({ error: 'Missing tokenSymbol or timeUnitInHours' });
    }
  
    try {
      await initDatabase();
      const data = await getDBChartData(tokenSymbol as string, parseInt(timeUnitInHours as string));
      res.json(data);
    } catch (error) {
      console.error(`[ERROR] : ${JSON.stringify(error)}`)
      res.status(500).json({ error: 'Error fetching chart data' });
    }
});

export function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
