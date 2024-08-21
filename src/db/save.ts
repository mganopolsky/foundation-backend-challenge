import { db } from "./database";
import { TokenData, TokenHourData, TOKEN_HOUR_DATA_TABLE_NAME, TOKEN_TABLE_NAME } from "../types";

export async function storeTokenData(tokenData: TokenData, address: string) {
    await db.none(`
      INSERT INTO ${TOKEN_TABLE_NAME} (address, name, symbol, total_supply, volume_usd, decimals)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (address) DO UPDATE SET
        name = EXCLUDED.name,
        symbol = EXCLUDED.symbol,
        total_supply = EXCLUDED.total_supply,
        volume_usd = EXCLUDED.volume_usd,
        decimals = EXCLUDED.decimals
    `, [address, tokenData.name, tokenData.symbol, tokenData.totalSupply, tokenData.volume, tokenData.decimals]);
  }
  
  export async function storeTokenHourData(tokenAddress: string, hourData: TokenHourData[]) {
    const values = hourData.map(d => {
      const dateString = d.date.toISOString().slice(0, 19).replace('T', ' ');
      return `('${tokenAddress}', '${dateString}', ${d.open}, ${d.high}, ${d.low}, ${d.close})`;
    }).join(',');

    const insert_statement = `
      INSERT INTO ${TOKEN_HOUR_DATA_TABLE_NAME} (token_address, date, open, high, low, close)
      VALUES ${values}
      ON CONFLICT (token_address, date) DO UPDATE SET
        open = EXCLUDED.open,
        high = EXCLUDED.high,
        low = EXCLUDED.low,
        close = EXCLUDED.close
    `
    await db.none(insert_statement);
  }