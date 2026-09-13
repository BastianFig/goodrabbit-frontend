import { useState } from 'react'
import { useEmployees } from '../hooks/useEmployees'
import EmployeeTable from '../components/EmployeeTable'
import EmployeeFilters from '../components/EmployeeFilters'
import ReportButton from '../components/ReportButton'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

interface Filters {
  departmentName?: string
  positionName?: string
}

export default function EmployeesPage() {
  const [filters, setFilters] = useState<Filters>({})

  const { data: allEmployees = [] } = useEmployees({})
  const { data: employees = [], isLoading, isError, refetch } = useEmployees(filters)

  function handleLogout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: '#1e40af' }}>Empleados</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ReportButton />
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <EmployeeFilters employees={allEmployees} onFilterChange={setFilters} />

      {isLoading && <Spinner />}
      {isError && <ErrorMessage message="Error al cargar los empleados" onRetry={refetch} />}
      {!isLoading && !isError && <EmployeeTable employees={employees} />}
    </div>
  )
}
