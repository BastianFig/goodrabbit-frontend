import client from './client'
import type { ReportJob } from '../types'

export async function generateReport(): Promise<{ executionId: string }> {
  const { data } = await client.post<{ executionId: string }>('/api/report/generate')
  return data
}

export async function fetchReportStatus(executionId: string, signal?: AbortSignal): Promise<ReportJob> {
  const { data } = await client.get<ReportJob>(`/api/report/${executionId}/status`, { signal })
  return data
}
