import { useMemo, useState } from 'react'
import type { Employee } from '../types'

interface Props {
  employees: Employee[]
  onFilterChange: (filters: { departmentName?: string; positionName?: string }) => void
}

export default function EmployeeFilters({ employees, onFilterChange }: Props) {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')

  const departments = useMemo(
    () => [...new Set(employees.map(e => e.department))].sort(),
    [employees]
  )

  const positions = useMemo(
    () =>
      selectedDepartment
        ? [...new Set(employees.filter(e => e.department === selectedDepartment).map(e => e.position))].sort()
        : [],
    [employees, selectedDepartment]
  )

  function handleDepartmentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const dept = e.target.value
    setSelectedDepartment(dept)
    setSelectedPosition('')
    onFilterChange({ departmentName: dept || undefined, positionName: undefined })
  }

  function handlePositionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const pos = e.target.value
    setSelectedPosition(pos)
    onFilterChange({ departmentName: selectedDepartment || undefined, positionName: pos || undefined })
  }

  function handleClear() {
    setSelectedDepartment('')
    setSelectedPosition('')
    onFilterChange({})
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
      <select value={selectedDepartment} onChange={handleDepartmentChange} style={{ padding: '8px 12px' }}>
        <option value="">Todos los departamentos</option>
        {departments.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={selectedPosition}
        onChange={handlePositionChange}
        disabled={!selectedDepartment}
        style={{ padding: '8px 12px' }}
      >
        <option value="">Todos los cargos</option>
        {positions.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {(selectedDepartment || selectedPosition) && (
        <button onClick={handleClear} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
