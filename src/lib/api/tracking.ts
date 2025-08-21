import { ViewPage } from '@/constants/tracking';
import { DashboardTracking, PageHistory } from '@/types';
import { api } from '../api';

export const trackingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query<DashboardTracking, void>({
      query: () => '/track/dashboard'
    }),
    pageHistory: builder.query<PageHistory, { page: ViewPage }>({
      query: ({ page }) => `/track/page-history/${page}`
    }),
    pageDetailHistory: builder.query<PageHistory, { pageDetailId: string }>({
      query: ({ pageDetailId }) => `/track/detail-page-history/${pageDetailId}`
    })
  })
});

export const {
  useDashboardQuery,
  usePageDetailHistoryQuery,
  usePageHistoryQuery
} = trackingApi;
