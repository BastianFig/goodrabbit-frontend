import { useQuery } from '@tanstack/react-query'
import { fetchDepartments, fetchEmployees, fetchPositions } from '../api/employees'

interface Filters {
  departmentName?: string
  positionName?: string
}

export function useEmployees(filters: Filters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePositions(departmentId: string) {
  return useQuery({
    queryKey: ['positions', departmentId],
    queryFn: () => fetchPositions(departmentId),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  })
}
