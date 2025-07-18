import { api } from '../api';

export interface IActivityLog {
    id?: number;
    user_id: number;
    action: string;
    description?: string;
    ip_address?: string;
    user_agent?: string;
    created_at?: string;
}

export const activityLogsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Tạo log mới
        createLog: builder.mutation<IActivityLog, Partial<IActivityLog>>({
            query: (log) => ({
                url: 'activity-logs',
                method: 'POST',
                body: log
            }),
            invalidatesTags: ['ActivityLog']
        }),
        // Lấy danh sách log
        getLogs: builder.query<IActivityLog[], void>({
            query: () => 'activity-logs',
            providesTags: ['ActivityLog']
        })
    })
});

export const { useCreateLogMutation, useGetLogsQuery } = activityLogsApi; 