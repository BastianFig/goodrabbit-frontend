export interface Employee {
  id: string
  name: string
  email: string
  dni?: string
  department: string
  department_Id?: string
  position: string
  position_Id?: string
}

export interface Department {
  id: string
  name: string
}

export interface Position {
  id: string
  name: string
  departmentId: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  username: string
  token: string
  expiresAtUtc: string
}

export type ReportStatus = 'Processing' | 'Completed'

export interface ReportJob {
  id: string
  status: ReportStatus
  createdAt: string
  completedAt?: string
  result?: unknown
}
