import { List, type RowComponentProps } from 'react-window'
import type { Employee } from '../types'

interface Props {
  employees: Employee[]
}

interface RowProps {
  employees: Employee[]
}

// de acuerdo a esto react-window va calculando cuando datos trae simultaneamente aproximadamente...

const ROW_HEIGHT = 48 
const TABLE_HEIGHT = 600

const columns = [
  { label: 'Nombre', key: 'name' as const, flex: 3 },
  { label: 'Email', key: 'email' as const, flex: 4 },
  { label: 'Departamento', key: 'department' as const, flex: 3 },
  { label: 'Cargo', key: 'position' as const, flex: 3 },
]

const headerStyle: React.CSSProperties = {
  display: 'flex',
  background: '#1e40af',
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
  borderRadius: '8px 8px 0 0',
}

const cellStyle: React.CSSProperties = {
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

function Row({ index, style, employees }: RowComponentProps<RowProps>) {
  const employee = employees[index]
  const isEven = index % 2 === 0

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        background: isEven ? '#f9fafb' : '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 14,
      }}
    >
      {columns.map(col => (
        <div key={col.key} style={{ ...cellStyle, flex: col.flex }} title={employee[col.key]}>
          {employee[col.key]}
        </div>
      ))}
    </div>
  )
}

export default function EmployeeTable({ employees }: Props) {
  if (employees.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
        No se encontraron empleados con los filtros aplicados.
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      <div style={headerStyle}>
        {columns.map(col => (
          <div key={col.key} style={{ ...cellStyle, flex: col.flex, height: ROW_HEIGHT }}>
            {col.label}
          </div>
        ))}
      </div>

      <List
        rowComponent={Row}
        rowCount={employees.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ employees }}
        style={{ height: TABLE_HEIGHT }}
      >
      </List>

      <div style={{ padding: '8px 16px', background: '#f9fafb', fontSize: 13, color: '#6b7280', borderTop: '1px solid #e5e7eb' }}>
        {employees.length} empleado{employees.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
