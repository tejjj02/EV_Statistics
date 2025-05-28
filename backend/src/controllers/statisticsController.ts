import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { promises as fs } from 'fs';

export const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use the full absolute path
    const dataPath = "C:/Users/dmont/OneDrive/Desktop/EV/public/mock-data.json";
    const fileContents = await fs.readFile(dataPath, 'utf-8');
    const mockData = JSON.parse(fileContents);
    res.json(mockData);
  } catch (error) {
    console.error(error);
    next(new AppError(500, 'Error fetching statistics'));
  }
};