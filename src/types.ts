export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface Professional {
  id: number;
  name: string;
  active: boolean;
}

export interface Location {
  id: number;
  name: string;
  active: boolean;
}

export interface ProductType {
  id: number;
  name: string;
  active: boolean;
}

export interface Report {
  id: number;
  professional_id: number;
  professional_name: string;
  report_date: string;
  day_of_week: string;
  is_holiday: boolean;
  location_id: number;
  location_name: string;
  data: Record<string, any>;
  total_production: number;
  created_at: string;
}

export interface DashboardData {
  topJournalists: { name: string; total: number }[];
  topProducts: { name: string; total: number }[];
  topDays: { date: string; total: number }[];
  bottomDays: { date: string; total: number }[];
  summary: {
    totalContents: number;
    totalReports: number;
    avgPerReport: number;
    avgPerDay: number;
    uniqueDays: number;
  };
  locationProduction: Record<string, number>;
}
