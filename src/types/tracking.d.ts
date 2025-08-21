import { ViewPage } from '@/constants/tracking';

interface PageDetail {
  pageDetailId: string | null;
  pageName: string | null;
  total: number;
}

interface PageTracking {
  page: string;
  total: number;
  details?: PageDetail[];
}

export type DashboardTracking = PageTracking[];

interface ITrackingHistory {
  id: string;
  page: ViewPage;
  pageDetailId: string | null;
  pageName: string | null;
  source: string | null;
  ip: string;
  city: string;
  region: string;
  country: string;
  createdAt: string;
}

export type PageHistory = ITrackingHistory[];
