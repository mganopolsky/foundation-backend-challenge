// init-db.test.ts
import { getLatestPollingTimeStamp, initDatabase } from './init-db';
import { db } from './database';

jest.spyOn(db, 'none');

describe('Database Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initDatabase should create necessary tables', async () => {
    await initDatabase();

    expect(db.none).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS'));
    expect(db.none).toHaveBeenCalledTimes(1);
  });

  test('getLatestPollingTimeStamp should return null when no data exists', async () => {
    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
  
    const result = await getLatestPollingTimeStamp();
  
    expect(result).toBeNull();
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT MAX(date) AS latest_date'));
    expect(db.query).toHaveBeenCalledTimes(1);
  });
  
  test('getLatestPollingTimeStamp should return a date when data exists', async () => {
    const mockDate = new Date('2024-01-01T00:00:00Z');
    jest.spyOn(db, 'query').mockResolvedValueOnce({
      rows: [{ latest_date: mockDate.toISOString() }],
    });
  
    const result = await getLatestPollingTimeStamp();
  
    expect(result).toEqual(mockDate);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT MAX(date) AS latest_date'));
    expect(db.query).toHaveBeenCalledTimes(1);
  });
  
  test('getLatestPollingTimeStamp should handle errors gracefully', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'));
  
    const result = await getLatestPollingTimeStamp();
  
    expect(result).toBeNull(); // Should return null on error
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('initDatabase should handle errors gracefully', async () => {
    jest.spyOn(db, 'none').mockRejectedValueOnce(new Error('Database error'));
  
    await expect(initDatabase()).rejects.toThrow('Database error');
    expect(db.none).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS'));
    expect(db.none).toHaveBeenCalledTimes(1);
  });
});
