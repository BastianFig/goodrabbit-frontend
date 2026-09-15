import { useReport } from '../hooks/useReport'
import Spinner from './ui/Spinner'

// Estilos reutilizables
const card: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 12,
  padding: '16px 20px', borderRadius: 8,
  border: '1px solid #e5e7eb', background: '#f9fafb',
}

const btn = (color: string): React.CSSProperties => ({
  padding: '10px 20px', borderRadius: 6, border: 'none',
  background: color, color: 'white', fontWeight: 600,
  cursor: 'pointer', fontSize: 14,
})

export default function ReportButton() {
  const { generate, isGenerating, isPolling, report, timedOut, error, reset } = useReport()

  // ── Estado 1: acción en curso (POST enviado o polling activo) ─────────────
  if (isGenerating || isPolling) {
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Spinner />
          <span style={{ color: '#374151', fontWeight: 500 }}>
            {isGenerating ? 'Iniciando reporte...' : 'Procesando reporte...'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          Esto puede tardar hasta 2 minutos.
        </p>
      </div>
    )
  }

  // ── Estado 2: timeout — la API nunca llegó a Completed ────────────────────
  if (timedOut) {
    return (
      <div style={{ ...card, borderColor: '#fca5a5', background: '#fef2f2' }}>
        <p style={{ margin: 0, color: '#dc2626', fontWeight: 500 }}>
          El reporte tardó demasiado en generarse.
        </p>
        <button style={btn('#6b7280')} onClick={reset}>
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado 3: error en el POST o en alguna consulta de status ─────────────
  if (error) {
    return (
      <div style={{ ...card, borderColor: '#fca5a5', background: '#fef2f2' }}>
        <p style={{ margin: 0, color: '#dc2626', fontWeight: 500 }}>
          Error al generar el reporte.
        </p>
        <button style={btn('#6b7280')} onClick={reset}>
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado 4: reporte completado — mostramos el resultado ────────────────
  if (report?.status === 'Completed') {
    return (
      <div style={{ ...card, borderColor: '#86efac', background: '#f0fdf4' }}>
        <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>
          Reporte generado exitosamente
        </p>
        {!!report.result && (
          <pre style={{
            margin: 0, padding: 12, borderRadius: 6,
            background: '#1e1e1e', color: '#d4d4d4',
            fontSize: 12, overflow: 'auto', maxHeight: 200,
          }}>
            {JSON.stringify(report.result, null, 2)}
          </pre>
        )}
        <button style={btn('#1e40af')} onClick={reset}>
          Generar nuevo reporte
        </button>
      </div>
    )
  }

  // ── Estado 0 (idle): aún no se ha generado nada ──────────────────────────
  return (
    <button style={btn('#1e40af')} onClick={() => generate()}>
      Generar reporte
    </button>
  )
}
