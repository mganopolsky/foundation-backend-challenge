export interface ChartData {
    time: string;
    type: 'open' | 'close' | 'high' | 'low' | 'priceUSD';
    value: number;
}

export const chartDataTypes = ['open', 'close', 'high', 'low', 'priceUSD'];