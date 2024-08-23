import { db } from "../db/database";
import { CLOSE_TYPE_NAME, getDBChartData, HIGH_TYPE_NAME, LOW_TYPE_NAME, OPEN_TYPE_NAME, PRICE_USD_TYPE_NAME } from "./database";

jest.mock('../db/database', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('getDBChartData', () => {
  const tokenSymbol = 'WBTC';
  const timeUnitInHours = 4;
  const mockQueryResult = [
      { date: '2024-08-22T08:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-22T08:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-22T08:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-22T08:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-22T08:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-22T12:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-22T12:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-22T12:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-22T12:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-22T12:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-22T16:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-22T16:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-22T16:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-22T16:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-22T16:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-22T20:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-22T20:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-22T20:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-22T20:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-22T20:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-23T00:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-23T00:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-23T00:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-23T00:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-23T00:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-23T04:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-23T04:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-23T04:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-23T04:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-23T04:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
      { date: '2024-08-23T08:00:00', type: CLOSE_TYPE_NAME, value: 0 },
      { date: '2024-08-23T08:00:00', type: HIGH_TYPE_NAME, value: 0 },
      { date: '2024-08-23T08:00:00', type: LOW_TYPE_NAME, value: 0 },
      { date: '2024-08-23T08:00:00', type: OPEN_TYPE_NAME, value: 0 },
      { date: '2024-08-23T08:00:00', type: PRICE_USD_TYPE_NAME, value: 0 },
    ];

  const expectedResult = [
    [
      ["2024-08-22T08:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-22T12:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-22T16:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-22T20:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-23T00:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-23T04:00:00", OPEN_TYPE_NAME, 0],
      ["2024-08-23T08:00:00", OPEN_TYPE_NAME, 0]
    ],
    [
      ["2024-08-22T08:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-22T12:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-22T16:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-22T20:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-23T00:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-23T04:00:00", CLOSE_TYPE_NAME, 0],
      ["2024-08-23T08:00:00", CLOSE_TYPE_NAME, 0]
    ],
    [
      ["2024-08-22T08:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-22T12:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-22T16:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-22T20:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-23T00:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-23T04:00:00", HIGH_TYPE_NAME, 0],
      ["2024-08-23T08:00:00", HIGH_TYPE_NAME, 0]
    ],
    [
      ["2024-08-22T08:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-22T12:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-22T16:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-22T20:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-23T00:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-23T04:00:00", LOW_TYPE_NAME, 0],
      ["2024-08-23T08:00:00", LOW_TYPE_NAME, 0]
    ],
    [
      ["2024-08-22T08:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-22T12:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-22T16:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-22T20:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-23T00:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-23T04:00:00", PRICE_USD_TYPE_NAME, 0],
      ["2024-08-23T08:00:00", PRICE_USD_TYPE_NAME, 0]
    ]
  ];

  beforeEach(() => {
    (db.query as jest.Mock).mockResolvedValue(mockQueryResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return token chart data in the correct format', async () => {
    const result = await getDBChartData(tokenSymbol, timeUnitInHours);

    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      [tokenSymbol, timeUnitInHours]
    );

    expect(result).toEqual(expectedResult);
  });
});