"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts"
import { Zap, TrendingUp, Users, Clock, Battery, MapPin } from "lucide-react"
import { getStatistics, type DailySession, type MonthlyStats, type SummaryStats } from "@/lib/data"

// Mock data for EV charger usage statistics (updated with INR)
const dailyUsageData = [
  { date: "2025-05-01", sessions: 12, energy: 145.2, revenue: 7260.0 },
  { date: "2025-05-02", sessions: 18, energy: 210.5, revenue: 10525.0 },
  { date: "2025-05-03", sessions: 15, energy: 178.3, revenue: 8915.0 },
  { date: "2025-05-04", sessions: 22, energy: 267.8, revenue: 13390.0 },
  { date: "2025-05-05", sessions: 19, energy: 234.1, revenue: 11705.0 },
  { date: "2025-05-06", sessions: 25, energy: 298.7, revenue: 14935.0 },
  { date: "2025-05-07", sessions: 28, energy: 342.5, revenue: 17125.0 },
  { date: "2025-05-08", sessions: 16, energy: 189.4, revenue: 9470.0 },
  { date: "2025-05-09", sessions: 21, energy: 251.6, revenue: 12580.0 },
  { date: "2025-05-10", sessions: 24, energy: 287.3, revenue: 14365.0 },
  { date: "2025-05-11", sessions: 30, energy: 365.8, revenue: 18290.0 },
  { date: "2025-05-12", sessions: 27, energy: 324.9, revenue: 16245.0 },
  { date: "2025-05-13", sessions: 23, energy: 276.4, revenue: 13820.0 },
  { date: "2025-05-14", sessions: 26, energy: 312.7, revenue: 15635.0 },
]

const hourlyUsageData = [
  { hour: "00:00", sessions: 2 },
  { hour: "01:00", sessions: 1 },
  { hour: "02:00", sessions: 1 },
  { hour: "03:00", sessions: 0 },
  { hour: "04:00", sessions: 1 },
  { hour: "05:00", sessions: 3 },
  { hour: "06:00", sessions: 8 },
  { hour: "07:00", sessions: 15 },
  { hour: "08:00", sessions: 22 },
  { hour: "09:00", sessions: 18 },
  { hour: "10:00", sessions: 12 },
  { hour: "11:00", sessions: 14 },
  { hour: "12:00", sessions: 16 },
  { hour: "13:00", sessions: 13 },
  { hour: "14:00", sessions: 11 },
  { hour: "15:00", sessions: 9 },
  { hour: "16:00", sessions: 12 },
  { hour: "17:00", sessions: 19 },
  { hour: "18:00", sessions: 25 },
  { hour: "19:00", sessions: 21 },
  { hour: "20:00", sessions: 16 },
  { hour: "21:00", sessions: 12 },
  { hour: "22:00", sessions: 8 },
  { hour: "23:00", sessions: 5 },
]

const chargerTypeData = [
  { type: "Level 1 (120V)", sessions: 45, color: "#10b981" },
  { type: "Level 2 (240V)", sessions: 156, color: "#3b82f6" },
  { type: "DC Fast Charging", sessions: 89, color: "#8b5cf6" },
]

const locationData = [
  { location: "Home Chargers", sessions: 120, energy: 1456.8 },
  { location: "Office Complex", sessions: 95, energy: 1234.5 },
  { location: "Shopping Mall", sessions: 75, energy: 987.3 },
]

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "#10b981",
  },
  energy: {
    label: "Energy (kWh)",
    color: "#3b82f6",
  },
  revenue: {
    label: "Revenue (₹)",
    color: "#8b5cf6",
  },
}

type TimePeriod = "today" | "week" | "month"

export function ChargerDashboard() {
  const [sessionsView, setSessionsView] = useState<TimePeriod>("month")
  const [energyView, setEnergyView] = useState<TimePeriod>("month")
  const [revenueView, setRevenueView] = useState<TimePeriod>("month")
  const [dailySessions, setDailySessions] = useState<DailySession[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await getStatistics()
        setDailySessions(stats.dailySessions)
        setMonthlyStats(stats.monthlyStats)
        setSummaryStats(stats.summary)
      } catch (error) {
        console.error('Error loading statistics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate metrics for different time periods
  const getSessionsData = (period: TimePeriod) => {
    if (!dailySessions.length) return { value: 0, change: "0%" }

    switch (period) {
      case "today":
        const today = dailySessions[dailySessions.length - 1]
        const yesterday = dailySessions[dailySessions.length - 2]
        const todayChange = ((today.sessions - yesterday.sessions) / yesterday.sessions) * 100
        return {
          value: today.sessions,
          change: `${todayChange >= 0 ? '+' : ''}${todayChange.toFixed(1)}% from yesterday`,
        }
      case "week":
        const lastWeek = dailySessions.slice(-14, -7).reduce((sum, day) => sum + day.sessions, 0)
        const thisWeek = dailySessions.slice(-7).reduce((sum, day) => sum + day.sessions, 0)
        const weekChange = ((thisWeek - lastWeek) / lastWeek) * 100
        return {
          value: thisWeek,
          change: `${weekChange >= 0 ? '+' : ''}${weekChange.toFixed(1)}% from last week`,
        }
      case "month":
        const lastMonth = monthlyStats[monthlyStats.length - 2]?.totalSessions || 0
        const thisMonth = monthlyStats[monthlyStats.length - 1]?.totalSessions || 0
        const monthChange = ((thisMonth - lastMonth) / lastMonth) * 100
        return {
          value: thisMonth,
          change: `${monthChange >= 0 ? '+' : ''}${monthChange.toFixed(1)}% from last month`,
        }
    }
  }

  const getEnergyData = (period: TimePeriod) => {
    if (!dailySessions.length) return { value: 0, change: "0%" }

    switch (period) {
      case "today":
        const today = dailySessions[dailySessions.length - 1]
        const yesterday = dailySessions[dailySessions.length - 2]
        const todayChange = ((today.avgDuration - yesterday.avgDuration) / yesterday.avgDuration) * 100
        return {
          value: today.avgDuration,
          change: `${todayChange >= 0 ? '+' : ''}${todayChange.toFixed(1)}% from yesterday`,
        }
      case "week":
        const lastWeek = dailySessions.slice(-14, -7).reduce((sum, day) => sum + day.avgDuration, 0) / 7
        const thisWeek = dailySessions.slice(-7).reduce((sum, day) => sum + day.avgDuration, 0) / 7
        const weekChange = ((thisWeek - lastWeek) / lastWeek) * 100
        return {
          value: thisWeek,
          change: `${weekChange >= 0 ? '+' : ''}${weekChange.toFixed(1)}% from last week`,
        }
      case "month":
        const lastMonth = monthlyStats[monthlyStats.length - 2]?.avgSessionDuration || 0
        const thisMonth = monthlyStats[monthlyStats.length - 1]?.avgSessionDuration || 0
        const monthChange = ((thisMonth - lastMonth) / lastMonth) * 100
        return {
          value: thisMonth,
          change: `${monthChange >= 0 ? '+' : ''}${monthChange.toFixed(1)}% from last month`,
        }
    }
  }

  const getRevenueData = (period: TimePeriod) => {
    if (!summaryStats) return { value: 0, change: "0%" }

    switch (period) {
      case "today":
        return {
          value: summaryStats.totalSessions * 2.5, // Assuming ₹2.5 per session
          change: `${summaryStats.growthRate >= 0 ? '+' : ''}${summaryStats.growthRate}% from yesterday`,
        }
      case "week":
        return {
          value: summaryStats.totalSessions * 2.5 * 7,
          change: `${summaryStats.growthRate >= 0 ? '+' : ''}${summaryStats.growthRate}% from last week`,
        }
      case "month":
        return {
          value: summaryStats.totalSessions * 2.5 * 30,
          change: `${summaryStats.growthRate >= 0 ? '+' : ''}${summaryStats.growthRate}% from last month`,
        }
    }
  }

  const sessionsData = getSessionsData(sessionsView)
  const energyData = getEnergyData(energyView)
  const revenueData = getRevenueData(revenueView)

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">EV Charger Usage Dashboard</h1>
        </div>
        <p className="text-gray-600">Real-time statistics and analytics for electric vehicle charging stations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </div>
            <Select value={sessionsView} onValueChange={(value: TimePeriod) => setSessionsView(value)}>
              <SelectTrigger className="w-[100px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsData.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{sessionsData.change}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            </div>
            <Select value={energyView} onValueChange={(value: TimePeriod) => setEnergyView(value)}>
              <SelectTrigger className="w-[100px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{energyData.value.toFixed(1)} min</div>
            <p className="text-xs text-muted-foreground">{energyData.change}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </div>
            <Select value={revenueView} onValueChange={(value: TimePeriod) => setRevenueView(value)}>
              <SelectTrigger className="w-[100px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueData.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{revenueData.change}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats?.peakConcurrentUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Peak concurrent users</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sessions Duration</CardTitle>
            <CardDescription>Average charging duration per day (minutes)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySessions}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const day = date.getDate();
                      return day % 5 === 0 ? day.toString() : '';
                    }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Duration (minutes)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { 
                        textAnchor: 'middle',
                        fill: '#6b7280',
                        fontSize: 12
                      }
                    }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const date = new Date(label);
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-600">
                              Duration: {payload[0].value.toFixed(1)} minutes
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="avgDuration" 
                    fill="url(#colorDuration)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth Trend</CardTitle>
            <CardDescription>Average daily sessions per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStats}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => value.split(' ')[0]}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Avg Daily Sessions', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { 
                        textAnchor: 'middle',
                        fill: '#6b7280',
                        fontSize: 12
                      }
                    }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const avgDailySessions = Math.round(payload[0].value / 30);
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">
                              Avg Daily Sessions: {avgDailySessions}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total Sessions: {payload[0].value.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalSessions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ 
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      r: 4
                    }}
                    activeDot={{ 
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      r: 6
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
