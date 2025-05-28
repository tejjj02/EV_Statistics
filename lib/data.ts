export interface DailySession {
  date: string;
  sessions: number;
  activeUsers: number;
  avgDuration: number;
}

export interface MonthlyStats {
  month: string;
  totalSessions: number;
  totalUsers: number;
  avgSessionDuration: number;
  peakConcurrentUsers: number;
}

export interface SummaryStats {
  totalSessions: number;
  totalUsers: number;
  avgSessionDuration: number;
  peakConcurrentUsers: number;
  growthRate: number;
  retentionRate: number;
}

export interface Statistics {
  dailySessions: DailySession[];
  monthlyStats: MonthlyStats[];
  summary: SummaryStats;
}

export async function getStatistics(): Promise<Statistics> {
  const response = await fetch('/mock-data.json');
  const data = await response.json();
  return data.statistics;
}

export async function getDailySessions(): Promise<DailySession[]> {
  const stats = await getStatistics();
  return stats.dailySessions;
}

export async function getMonthlyStats(): Promise<MonthlyStats[]> {
  const stats = await getStatistics();
  return stats.monthlyStats;
}

export async function getSummaryStats(): Promise<SummaryStats> {
  const stats = await getStatistics();
  return stats.summary;
} 