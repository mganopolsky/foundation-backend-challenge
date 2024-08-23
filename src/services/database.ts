import { db } from '../db/database';
import { ChartData, TOKEN_HOUR_DATA_TABLE_NAME, TOKEN_TABLE_NAME } from '../types';

export const OPEN_TYPE_NAME = "open"
export const CLOSE_TYPE_NAME = "close"
export const HIGH_TYPE_NAME = "high"
export const LOW_TYPE_NAME = "low"
export const PRICE_USD_TYPE_NAME = "priceUSD"

const TYPE_NAMES = [OPEN_TYPE_NAME, CLOSE_TYPE_NAME, HIGH_TYPE_NAME, LOW_TYPE_NAME, PRICE_USD_TYPE_NAME]

export async function getDBChartData (tokenSymbol: string, timeUnitInHours: number): Promise<Array<Array<[string, string, number]>> >  {


    const query = `WITH TimeIntervals AS (
        SELECT generate_series(
            date_trunc('hour', CURRENT_TIMESTAMP - INTERVAL '1 day') - INTERVAL '1 hour' * (EXTRACT(HOUR FROM CURRENT_TIMESTAMP - INTERVAL '1 day') % $2),
            date_trunc('hour', CURRENT_TIMESTAMP),
            INTERVAL '1 hour' * $2
        ) AS interval_start
    ),
    TimeGroupedData AS (
        SELECT t.symbol,
              date_trunc('hour', th.date) - 
              INTERVAL '1 hour' * (EXTRACT(HOUR FROM th.date) % $2) AS interval_start,
              AVG(th.open) AS avg_open,
              AVG(th.close) AS avg_close,
              AVG(th.high) AS avg_high,
              AVG(th.low) AS avg_low,
              AVG(th.price_usd) AS avg_price_usd
        FROM ${TOKEN_HOUR_DATA_TABLE_NAME} th
        JOIN ${TOKEN_TABLE_NAME} t
          ON th.token_address = t.address
        WHERE t.symbol = $1          
        GROUP BY t.symbol, interval_start
    )
    SELECT TO_CHAR(ti.interval_start, 'YYYY-MM-DD"T"HH24:MI:SS') AS date,
          '${OPEN_TYPE_NAME}' AS type,
          COALESCE(tg.avg_open, 0) AS value
    FROM TimeIntervals ti
    LEFT JOIN TimeGroupedData tg
      ON ti.interval_start = tg.interval_start
    UNION ALL
    SELECT TO_CHAR(ti.interval_start, 'YYYY-MM-DD"T"HH24:MI:SS') AS date,
          '${CLOSE_TYPE_NAME}' AS type,
          COALESCE(tg.avg_close, 0) AS value
    FROM TimeIntervals ti
    LEFT JOIN TimeGroupedData tg
      ON ti.interval_start = tg.interval_start
    UNION ALL
    SELECT TO_CHAR(ti.interval_start, 'YYYY-MM-DD"T"HH24:MI:SS') AS date,
          '${HIGH_TYPE_NAME}' AS type,
          COALESCE(tg.avg_high, 0) AS value
    FROM TimeIntervals ti
    LEFT JOIN TimeGroupedData tg
      ON ti.interval_start = tg.interval_start
    UNION ALL
    SELECT TO_CHAR(ti.interval_start, 'YYYY-MM-DD"T"HH24:MI:SS') AS date,
          '${LOW_TYPE_NAME}' AS type,
          COALESCE(tg.avg_low, 0) AS value
    FROM TimeIntervals ti
    LEFT JOIN TimeGroupedData tg
      ON ti.interval_start = tg.interval_start
    UNION ALL
    SELECT TO_CHAR(ti.interval_start, 'YYYY-MM-DD"T"HH24:MI:SS') AS date,
          '${PRICE_USD_TYPE_NAME}' AS type,
          COALESCE(tg.avg_price_usd, 0) AS value
    FROM TimeIntervals ti
    LEFT JOIN TimeGroupedData tg
      ON ti.interval_start = tg.interval_start
    ORDER BY date ASC, type ASC;`

  // Execute the query
  const queryResult = await db.query(query, [tokenSymbol, timeUnitInHours]);
  const dataMap: Map<string, Array<[string, string, number]>> = new Map<string, Array<[string, string, number]>>();

  //initialize the dataset
  TYPE_NAMES.forEach(type => {
    dataMap.set(type, [])
  })

  // Populate the groupedData with results
  if (queryResult != null && queryResult.length > 0) {
    // Populate the data map with results
    queryResult.forEach((row: ChartData) => {
        const { date, type, value } = row;
        // Parse the value to ensure it's a number
        const result = dataMap.get(type)
        if ( TYPE_NAMES.includes(type) && result != null){
          result.push([date, type, Number(value)]);
        }
    });
  }  
  const groupedData: Array<Array<[string, string, number]>> = Array.from(dataMap.values());
  // reutrn 
  return groupedData;
};