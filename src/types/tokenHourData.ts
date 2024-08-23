export interface TokenHourData {    
    date: Date;
    open: number;
    close: number;
    high: number;
    low: number;
    priceUSD: number;
    tokenAddress: string;
}

export interface UniswapTokenHourData {    
    periodStartUnix: number;
    open: number;
    close: number;
    high: number;
    low: number;
    priceUSD: number;
    token: {
        id: string;
    }
}