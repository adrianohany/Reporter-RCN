import { User, Professional, Location, ProductType, Report, DashboardData } from '../types';

const API_BASE = '/api';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};

export const dataService = {
  async getProfessionals(): Promise<Professional[]> {
    const res = await fetch(`${API_BASE}/professionals`);
    return res.json();
  },
  async getLocations(): Promise<Location[]> {
    const res = await fetch(`${API_BASE}/locations`);
    return res.json();
  },
  async getProductTypes(): Promise<ProductType[]> {
    const res = await fetch(`${API_BASE}/product-types`);
    return res.json();
  },
  async submitReport(report: Partial<Report>): Promise<{ id: number }> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    return res.json();
  },
  async getReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE}/reports`);
    return res.json();
  },
  async getDashboardData(filters: any = {}): Promise<DashboardData> {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/analytics/dashboard?${query}`);
    return res.json();
  },
};

export const adminService = {
  async addProfessional(name: string) {
    const res = await fetch(`${API_BASE}/admin/professionals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },
  async deleteProfessional(id: number) {
    const res = await fetch(`${API_BASE}/admin/professionals/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
