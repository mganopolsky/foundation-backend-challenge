import { db } from '../db/database';
import { ChartData, chartDataTypes, TOKEN_HOUR_DATA_TABLE_NAME } from '../types';

export async function getDBChartData (tokenSymbol: string, timeUnitInHours: number): Promise<Array<Array<[string, string, number]>>> {

  const query = `
    SELECT time, type, value
    FROM ${TOKEN_HOUR_DATA_TABLE_NAME}
    WHERE symbol = $1 AND EXTRACT(HOUR FROM time) % $2 = 0
    ORDER BY time ASC
  `
  const queryResult = await db.query(query, [tokenSymbol, timeUnitInHours]);

  // Transform the data into the required 3D array format
  const groupedData: Array<Array<[string, string, number]>> = [];

  chartDataTypes.forEach(type => {
    const typeData = queryResult
      .filter((row: ChartData) => row.type === type)
      .map((row: ChartData) => [row.time, row.type, row.value] as [string, string, number]);

    groupedData.push(typeData);
  });

  return groupedData;
};