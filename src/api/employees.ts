import client from './client'
import type { Department, Employee, Position } from '../types'

export async function fetchEmployees(params?: {
  departmentName?: string
  positionName?: string
}): Promise<Employee[]> {
  const { data } = await client.get<Employee[]>('/api/employee', { params })
  return data
}

export async function fetchDepartments(): Promise<Department[]> {
  const { data } = await client.get<Department[]>('/api/employee/departments')
  return data
}

export async function fetchPositions(departmentId: string): Promise<Position[]> {
  const { data } = await client.get<Position[]>(
    `/api/employee/departments/${departmentId}/positions`
  )
  return data
}
