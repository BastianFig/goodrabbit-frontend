interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({ message = 'Ocurrió un error', onRetry }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <p style={{ color: '#dc2626', fontWeight: 600 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 8, padding: '8px 16px', cursor: 'pointer' }}>
          Reintentar
        </button>
      )}
    </div>
  )
}
